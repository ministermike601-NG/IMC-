import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Loader2, ShieldCheck } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/lib/supabase";
import {
  AGE_RANGES,
  EVENT,
  GENDERS,
  MEMBERSHIP_STATUSES,
} from "@/lib/event";

const title = "Register — Influencers Nations Membership Class";
const description =
  "Reserve your place in the three-week Influencers Nations Membership Class. Registration takes about two minutes.";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: RegisterPage,
});

/** Accepts international formats: +234 801 234 5678, 08012345678, etc. */
const phoneSchema = z
  .string()
  .trim()
  .min(7, "Enter a valid phone number")
  .max(20, "Phone number is too long")
  .regex(/^\+?[0-9\s()-]{7,20}$/, "Enter a valid phone number");

const optionalPhone = z
  .string()
  .trim()
  .max(20, "Phone number is too long")
  .regex(/^\+?[0-9\s()-]{7,20}$/, "Enter a valid phone number")
  .optional()
  .or(z.literal(""));

const formSchema = z.object({
  full_name: z.string().trim().min(2, "Please enter your full name").max(120),
  phone: phoneSchema,
  whatsapp: optionalPhone,
  email: z
    .string()
    .trim()
    .email("Enter a valid email address")
    .max(255)
    .optional()
    .or(z.literal("")),
  gender: z.string().optional(),
  date_of_birth: z.string().optional().or(z.literal("")),
  age_range: z.string().optional(),
  occupation: z.string().trim().max(120).optional().or(z.literal("")),
  country: z.string().trim().max(80).optional().or(z.literal("")),
  state: z.string().trim().max(80).optional().or(z.literal("")),
  city: z.string().trim().max(80).optional().or(z.literal("")),
  is_new_member: z.enum(["yes", "no"]).optional(),
  membership_status: z.string().optional(),
  church_name: z.string().trim().max(150).optional().or(z.literal("")),
  pastor_name: z.string().trim().max(150).optional().or(z.literal("")),
  info_accurate: z.literal(true, {
    errorMap: () => ({ message: "Please confirm your information is accurate" }),
  }),
});

type FormValues = z.infer<typeof formSchema>;

/** Empty strings become null so the database stores clean values. */
const clean = (value?: string) => {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
};

function RegisterPage() {
  const navigate = useNavigate();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      full_name: "",
      phone: "",
      whatsapp: "",
      email: "",
      date_of_birth: "",
      occupation: "",
      country: "",
      state: "",
      city: "",
      church_name: "",
      pastor_name: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    const { error } = await supabase.from("registrations").insert({
      full_name: values.full_name.trim(),
      phone: values.phone.trim(),
      whatsapp: clean(values.whatsapp),
      email: clean(values.email)?.toLowerCase() ?? null,
      gender: clean(values.gender),
      date_of_birth: clean(values.date_of_birth),
      age_range: clean(values.age_range),
      occupation: clean(values.occupation),
      country: clean(values.country),
      state: clean(values.state),
      city: clean(values.city),
      is_new_member: values.is_new_member ? values.is_new_member === "yes" : null,
      membership_status: clean(values.membership_status),
      church_name: clean(values.church_name),
      pastor_name: clean(values.pastor_name),
      info_accurate: true,
    });

    if (error) {
      // 23505 = unique violation on phone or email
      if (error.code === "23505") {
        toast.error("You have already registered with this phone number or email address.");
        return;
      }
      toast.error("We couldn't complete your registration. Please try again.");
      return;
    }

    navigate({
  to: "/success",
  search: {
    name: values.full_name,
  },
});
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <header className="text-center">
        <p className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">
          Registration
        </p>
        <h1 className="mt-3 font-display text-4xl font-bold sm:text-5xl">Reserve your place</h1>
        <p className="mt-3 text-muted-foreground">
          {EVENT.name} · three weeks · Fridays &amp; Saturdays ({EVENT.timezone})
        </p>
      </header>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-10 space-y-8">
          <Section title="Personal information">
            <FormField
              control={form.control}
              name="full_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full name *</FormLabel>
                  <FormControl>
                    <Input placeholder="Your full name" autoComplete="name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid gap-5 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone number *</FormLabel>
                    <FormControl>
                      <Input type="tel" inputMode="tel" placeholder="+234 801 234 5678" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="whatsapp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>WhatsApp number</FormLabel>
                    <FormControl>
                      <Input type="tel" inputMode="tel" placeholder="Optional" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email address</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      placeholder="you@example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid gap-5 sm:grid-cols-2">
              <SelectField control={form.control} name="gender" label="Gender" options={[...GENDERS]} />
              <FormField
                control={form.control}
                name="date_of_birth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date of birth</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <SelectField
                control={form.control}
                name="age_range"
                label="Age range"
                options={[...AGE_RANGES]}
              />
              <FormField
                control={form.control}
                name="occupation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Occupation</FormLabel>
                    <FormControl>
                      <Input placeholder="What do you do?" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </Section>

          <Section title="Location">
            <div className="grid gap-5 sm:grid-cols-3">
              {(["country", "state", "city"] as const).map((name) => (
                <FormField
                  key={name}
                  control={form.control}
                  name={name}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="capitalize">{name}</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
            </div>
          </Section>

          <Section title="Membership">
            <FormField
              control={form.control}
              name="is_new_member"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Are you a new member?</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="flex gap-3"
                    >
                      {[
                        { value: "yes", label: "Yes" },
                        { value: "no", label: "No" },
                      ].map((option) => (
                        <FormItem key={option.value} className="flex-1">
                          <FormLabel className="flex cursor-pointer items-center gap-3 rounded-xl border border-input p-4 transition-colors has-[button[data-state=checked]]:border-primary has-[button[data-state=checked]]:bg-primary-soft">
                            <FormControl>
                              <RadioGroupItem value={option.value} />
                            </FormControl>
                            {option.label}
                          </FormLabel>
                        </FormItem>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <SelectField
              control={form.control}
              name="membership_status"
              label="Membership status"
              options={[...MEMBERSHIP_STATUSES]}
            />
          </Section>

          <Section title="Church information">
            <div className="grid gap-5 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="church_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Embassy Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your Embassy name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="pastor_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ambassador's Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your Ambassador's name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </Section>

          <Section title="Consent">
            <FormField
              control={form.control}
              name="info_accurate"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start gap-3 rounded-xl border border-input p-4">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1">
                    <FormLabel className="font-normal">
                      I confirm that the information I have submitted is accurate. *
                    </FormLabel>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
          </Section>

          <Button
            type="submit"
            size="lg"
            disabled={form.formState.isSubmitting}
            className="h-14 w-full rounded-full text-base font-semibold shadow-elegant"
          >
            {form.formState.isSubmitting ? (
              <>
                <Loader2 className="mr-2 size-5 animate-spin" aria-hidden /> Submitting…
              </>
            ) : (
              "Complete registration"
            )}
          </Button>

          <p className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="size-4" aria-hidden />
            Your details are stored securely and used only for this programme.
          </p>
        </form>
      </Form>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="space-y-5 rounded-3xl border border-border/70 p-5 shadow-soft sm:p-7">
      <legend className="px-2 font-display text-xl font-semibold">{title}</legend>
      {children}
    </fieldset>
  );
}

/** Small wrapper so the many single-select fields stay declarative. */
function SelectField({
  control,
  name,
  label,
  options,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: any;
  name: keyof FormValues;
  label: string;
  options: string[];
}) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <Select onValueChange={field.onChange} value={(field.value as string) || undefined}>
            <FormControl>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}