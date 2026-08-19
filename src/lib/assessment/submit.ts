import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";

type FileMetadata = {
  name: string;
  type: string;
};

export type PrepareSubmissionInput = {
  testSlug: string;
  fullName: string;
  phone: string;
  files: FileMetadata[];
};

export type FinalizeSubmissionInput = {
  submissionId: string;
  files: {
    pageNumber: number;
    storagePath: string;
    originalFileName: string;
  }[];
};

export type CancelSubmissionInput = {
  submissionId: string;
  storagePaths?: string[];
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

/**
 * Normalize names so harmless differences don't prevent
 * a legitimate student from being found.
 *
 * Examples:
 * "Innocent Ehiabhi"
 * "innocent ehiabhi"
 * "  Innocent   Ehiabhi  "
 *
 * all become:
 * "innocent ehiabhi"
 */
function normalizeName(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

/**
 * Normalize Nigerian phone numbers.
 *
 * Examples:
 *
 * 07059201948
 * +2347059201948
 * 2347059201948
 * 0705 920 1948
 *
 * all become:
 *
 * 07059201948
 */
function normalizeNigerianPhone(value: string) {
  const digits = value.replace(/\D/g, "");

  if (digits.startsWith("234")) {
    return `0${digits.slice(3)}`;
  }

  if (digits.startsWith("0")) {
    return digits;
  }

  return digits;
}

/**
 * Find the student's registration using their
 * registered name and phone number.
 *
 * We deliberately do NOT require auth_user_id.
 *
 * This allows students who registered before accounts
 * were introduced to submit their assessments.
 */
async function findRegistration(
  fullName: string,
  phone: string,
) {
  const supabase = getSupabaseAdmin();

  const normalizedName = normalizeName(fullName);
  const normalizedPhone = normalizeNigerianPhone(phone);

  if (!normalizedName || !normalizedPhone) {
    throw new Error(
      "Please enter your registered full name and phone number.",
    );
  }

  const {
    data: registrations,
    error,
  } = await supabase
    .from("registrations")
    .select("id, full_name, phone, email, auth_user_id");

  if (error) {
    console.error(
      "Registration lookup error:",
      error,
    );

    throw new Error(
      "Unable to verify your registration.",
    );
  }

  const matches = (registrations ?? []).filter(
    (registration) => {
      const registrationName = normalizeName(
        registration.full_name,
      );

      const registrationPhone =
        normalizeNigerianPhone(
          registration.phone,
        );

      return (
        registrationName === normalizedName &&
        registrationPhone === normalizedPhone
      );
    },
  );

  /**
   * No match.
   */
  if (matches.length === 0) {
    throw new Error(
      "We could not find a registration matching those details. Please make sure you enter the same name and phone number you used when registering.",
    );
  }

  /**
   * More than one registration has exactly the
   * same normalized name and phone.
   *
   * Never guess which student it is.
   */
  if (matches.length > 1) {
    throw new Error(
      "More than one registration matches these details. Please contact the class administrator so your registration can be identified.",
    );
  }

  return matches[0];
}

function getClassNumber(testSlug: string) {
  const classNumber = Number(
    testSlug.replace("class-", ""),
  );

  if (
    !Number.isInteger(classNumber) ||
    classNumber < 1 ||
    classNumber > 8
  ) {
    throw new Error("Invalid assessment.");
  }

  return classNumber;
}

/**
 * Prepare an assessment submission.
 *
 * IMPORTANT:
 * This does NOT require authentication.
 *
 * The student's registration is verified using:
 *
 *   full name + normalized Nigerian phone number
 */
export const prepareAssessmentSubmission =
  createServerFn({
    method: "POST",
  })
    .validator(
      (input: PrepareSubmissionInput) => input,
    )
    .handler(async ({ data }) => {
      const supabase = getSupabaseAdmin();

      const fullName = data.fullName.trim();
      const phone = data.phone.trim();

      if (!fullName || !phone) {
        throw new Error(
          "Full name and phone number are required.",
        );
      }

      if (!data.files.length) {
        throw new Error(
          "Please upload at least one answer page.",
        );
      }

      if (data.files.length > 20) {
        throw new Error(
          "You can upload a maximum of 20 answer pages.",
        );
      }

      /**
       * Find the actual registration.
       *
       * No auth_user_id required.
       */
      const registration =
        await findRegistration(
          fullName,
          phone,
        );

      const classNumber =
        getClassNumber(data.testSlug);

      const {
        data: test,
        error: testError,
      } = await supabase
        .from("imc_tests")
        .select(
          "id, class_number, title, is_available",
        )
        .eq("class_number", classNumber)
        .eq("is_available", true)
        .maybeSingle();

      if (testError) {
        console.error(
          "Test lookup error:",
          testError,
        );

        throw new Error(
          "Unable to load the assessment.",
        );
      }

      if (!test) {
        throw new Error(
          "This assessment is not currently available.",
        );
      }

      /**
       * Prevent duplicate submissions.
       */
      const {
        data: existingSubmission,
        error: existingError,
      } = await supabase
        .from("imc_test_submissions")
        .select("id, status")
        .eq("test_id", test.id)
        .eq(
          "registration_id",
          registration.id,
        )
        .maybeSingle();

      if (existingError) {
        console.error(
          "Existing submission check error:",
          existingError,
        );

        throw new Error(
          "Unable to check your previous submission.",
        );
      }

      if (existingSubmission) {
        throw new Error(
          "You have already submitted this assessment. Your submission is being processed.",
        );
      }

      /**
       * Create the submission.
       */
      const {
        data: submission,
        error: submissionError,
      } = await supabase
        .from("imc_test_submissions")
        .insert({
          test_id: test.id,
          registration_id:
            registration.id,
          status: "submitted",
        })
        .select("id")
        .single();

      if (
        submissionError ||
        !submission
      ) {
        console.error(
          "Submission creation error:",
          submissionError,
        );

        throw new Error(
          "Unable to create your submission.",
        );
      }

      try {
        const uploadUrls = [];

        for (
          let index = 0;
          index < data.files.length;
          index++
        ) {
          const file =
            data.files[index];

          if (
            !file.type.startsWith("image/")
          ) {
            throw new Error(
              `Page ${
                index + 1
              } is not a valid image file.`,
            );
          }

          const extension =
            file.name
              .split(".")
              .pop()
              ?.toLowerCase() || "jpg";

          const storagePath =
            `${registration.id}/${test.id}/${submission.id}/page-${index + 1}.${extension}`;

          const {
            data: signedUpload,
            error:
              signedUploadError,
          } =
            await supabase.storage
              .from(
                "imc-test-submissions",
              )
              .createSignedUploadUrl(
                storagePath,
              );

          if (
            signedUploadError ||
            !signedUpload
          ) {
            console.error(
              `Signed upload URL error for page ${
                index + 1
              }:`,
              signedUploadError,
            );

            throw new Error(
              `Unable to prepare page ${
                index + 1
              } for upload.`,
            );
          }

          uploadUrls.push({
            pageNumber: index + 1,
            storagePath,
            token:
              signedUpload.token,
            originalFileName:
              file.name,
          });
        }

        return {
          success: true,
          submissionId:
            submission.id,
          uploadUrls,

          /**
           * Return registration details
           * so the UI can display the
           * verified student name.
           */
          fullName:
            registration.full_name,

          email:
            registration.email,
        };
      } catch (error) {
        /**
         * If preparation fails, remove
         * the database submission.
         */
        await supabase
          .from(
            "imc_test_submissions",
          )
          .delete()
          .eq(
            "id",
            submission.id,
          );

        console.error(
          "Assessment preparation error:",
          error,
        );

        throw new Error(
          error instanceof Error
            ? error.message
            : "We could not prepare your test submission.",
        );
      }
    });

/**
 * Finalize the assessment.
 *
 * The submission itself already contains
 * registration_id, so we verify that the
 * submission exists before saving pages.
 */
export const finalizeAssessmentSubmission =
  createServerFn({
    method: "POST",
  })
    .validator(
      (input: FinalizeSubmissionInput) =>
        input,
    )
    .handler(async ({ data }) => {
      const supabase =
        getSupabaseAdmin();

      if (!data.submissionId) {
        throw new Error(
          "Missing submission ID.",
        );
      }

      if (!data.files.length) {
        throw new Error(
          "No uploaded answer pages were provided.",
        );
      }

      if (data.files.length > 20) {
        throw new Error(
          "A maximum of 20 answer pages is allowed.",
        );
      }

      const {
        data: submission,
        error: submissionError,
      } = await supabase
        .from(
          "imc_test_submissions",
        )
        .select(
          "id, registration_id, status",
        )
        .eq(
          "id",
          data.submissionId,
        )
        .maybeSingle();

      if (submissionError) {
        console.error(
          "Submission verification error:",
          submissionError,
        );

        throw new Error(
          "Unable to verify your submission.",
        );
      }

      if (!submission) {
        throw new Error(
          "Submission could not be found.",
        );
      }

      /**
       * Prevent finalizing an already
       * completed submission.
       */
      if (
        submission.status !==
          "submitted"
      ) {
        throw new Error(
          "This submission has already been processed.",
        );
      }

      const uploadedPages =
        data.files.map(
          (file) => ({
            submission_id:
              data.submissionId,
            page_number:
              file.pageNumber,
            storage_path:
              file.storagePath,
            original_file_name:
              file.originalFileName,
          }),
        );

      const {
        error: pagesError,
      } = await supabase
        .from(
          "imc_submission_pages",
        )
        .insert(
          uploadedPages,
        );

      if (pagesError) {
        console.error(
          "Submission pages database error:",
          pagesError,
        );

        await supabase.storage
          .from(
            "imc-test-submissions",
          )
          .remove(
            data.files.map(
              (file) =>
                file.storagePath,
            ),
          );

        await supabase
          .from(
            "imc_test_submissions",
          )
          .delete()
          .eq(
            "id",
            data.submissionId,
          );

        throw new Error(
          "Your images were uploaded, but we could not save the submission. Please try again.",
        );
      }

      return {
        success: true,
        submissionId:
          data.submissionId,
        message:
          "Your test has been submitted successfully and is now awaiting marking.",
      };
    });

/**
 * Cancel a submission when something fails
 * during the upload process.
 */
export const cancelAssessmentSubmission =
  createServerFn({
    method: "POST",
  })
    .validator(
      (input: CancelSubmissionInput) =>
        input,
    )
    .handler(async ({ data }) => {
      const supabase =
        getSupabaseAdmin();

      if (!data.submissionId) {
        return {
          success: false,
        };
      }

      const {
        data: submission,
        error,
      } = await supabase
        .from(
          "imc_test_submissions",
        )
        .select(
          "id, registration_id",
        )
        .eq(
          "id",
          data.submissionId,
        )
        .maybeSingle();

      if (
        error ||
        !submission
      ) {
        return {
          success: false,
        };
      }

      /**
       * Remove uploaded files.
       */
      if (
        data.storagePaths?.length
      ) {
        await supabase.storage
          .from(
            "imc-test-submissions",
          )
          .remove(
            data.storagePaths,
          );
      }

      /**
       * Remove incomplete submission.
       */
      await supabase
        .from(
          "imc_test_submissions",
        )
        .delete()
        .eq(
          "id",
          data.submissionId,
        )
        .eq(
          "registration_id",
          submission.registration_id,
        );

      return {
        success: true,
      };
    });