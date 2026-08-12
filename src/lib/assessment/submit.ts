import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";

type SubmissionFile = {
  name: string;
  type: string;
  data: string;
};

export type SubmissionInput = {
  testSlug: string;
  fullName: string;
  phone: string;
  files: SubmissionFile[];
};

function getSupabaseAdmin() {
  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error("Supabase server credentials are not configured.");
  }

  return createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export const submitAssessment = createServerFn({
  method: "POST",
})
  .validator((input: SubmissionInput) => input)
  .handler(async ({ data }) => {
    const supabase = getSupabaseAdmin();

    const fullName = data.fullName.trim();
    const phone = data.phone.trim();

    if (!fullName || !phone) {
      throw new Error("Full name and phone number are required.");
    }

    if (!data.files.length) {
      throw new Error("Please upload at least one answer page.");
    }

    if (data.files.length > 20) {
      throw new Error("You can upload a maximum of 20 answer pages.");
    }

    const { data: registrations, error: registrationError } =
      await supabase
        .from("registrations")
        .select("id, full_name, phone")
        .ilike("full_name", fullName)
        .eq("phone", phone)
        .limit(1);

    if (registrationError) {
      console.error(registrationError);
      throw new Error("Unable to verify your registration.");
    }

    const registration = registrations?.[0];

    if (!registration) {
      throw new Error(
        "We could not find a registration matching those details. Please check your name and phone number.",
      );
    }

    const classNumber = Number(
      data.testSlug.replace("class-", ""),
    );

    if (
      !Number.isInteger(classNumber) ||
      classNumber < 1 ||
      classNumber > 8
    ) {
      throw new Error("Invalid assessment.");
    }

    const { data: test, error: testError } = await supabase
      .from("imc_tests")
      .select("id, class_number, title, is_available")
      .eq("class_number", classNumber)
      .eq("is_available", true)
      .maybeSingle();

    if (testError) {
      console.error(testError);
      throw new Error("Unable to load the assessment.");
    }

    if (!test) {
      throw new Error("This assessment is not currently available.");
    }

    const { data: existingSubmission, error: existingError } =
      await supabase
        .from("imc_test_submissions")
        .select("id, status")
        .eq("test_id", test.id)
        .eq("registration_id", registration.id)
        .maybeSingle();

    if (existingError) {
      console.error(existingError);
      throw new Error(
        "Unable to check your previous submission.",
      );
    }

    if (existingSubmission) {
      throw new Error(
        "You have already submitted this assessment. Your submission is being processed.",
      );
    }

    const { data: submission, error: submissionError } =
      await supabase
        .from("imc_test_submissions")
        .insert({
          test_id: test.id,
          registration_id: registration.id,
          status: "submitted",
        })
        .select("id")
        .single();

    if (submissionError || !submission) {
      console.error(submissionError);
      throw new Error("Unable to create your submission.");
    }

    const uploadedPages: {
      submission_id: string;
      page_number: number;
      storage_path: string;
      original_file_name: string;
    }[] = [];

    try {
      for (let index = 0; index < data.files.length; index++) {
        const file = data.files[index];

        if (!file.type.startsWith("image/")) {
          throw new Error(
            `Page ${index + 1} is not a valid image file.`,
          );
        }

        const base64 = file.data.replace(
          /^data:image\/[^;]+;base64,/,
          "",
        );

        const binary = Buffer.from(base64, "base64");

        const extension =
          file.name.split(".").pop()?.toLowerCase() || "jpg";

        const storagePath =
          `${registration.id}/${test.id}/${submission.id}/page-${index + 1}.${extension}`;

        const { error: uploadError } = await supabase.storage
          .from("imc-test-submissions")
          .upload(storagePath, binary, {
            contentType: file.type,
            upsert: false,
          });

        if (uploadError) {
          throw uploadError;
        }

        uploadedPages.push({
          submission_id: submission.id,
          page_number: index + 1,
          storage_path: storagePath,
          original_file_name: file.name,
        });
      }

      const { error: pagesError } = await supabase
        .from("imc_submission_pages")
        .insert(uploadedPages);

      if (pagesError) {
        throw pagesError;
      }

      return {
        success: true,
        submissionId: submission.id,
        message:
          "Your test has been submitted successfully and is now awaiting marking.",
      };
    } catch (error) {
      await supabase
        .from("imc_test_submissions")
        .delete()
        .eq("id", submission.id);

      console.error(error);

      throw new Error(
        "We could not complete your upload. Please try again.",
      );
    }
  });