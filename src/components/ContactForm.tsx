import { FormEvent, useMemo, useState } from "react";

type FormState = {
  fullName: string;
  email: string;
  phone: string;
  propertyType: string;
  financingNeed: string;
  financingAmount: string;
  message: string;
  consent: boolean;
};

type FormErrors = Partial<Record<keyof FormState, string>>;
type SubmitState = "idle" | "loading" | "success" | "error";

const initialFormState: FormState = {
  fullName: "",
  email: "",
  phone: "",
  propertyType: "",
  financingNeed: "",
  financingAmount: "",
  message: "",
  consent: false,
};

const propertyTypes = [
  "Working farm",
  "Rural residential property",
  "Vacant land",
  "Acreage or hobby farm",
  "Mixed-use rural property",
  "Other rural property",
];

const financingNeeds = [
  "Farm purchase",
  "Land acquisition",
  "Refinance",
  "Construction or expansion",
  "Private mortgage solution",
  "Debt consolidation",
];

function validateForm(form: FormState) {
  const errors: FormErrors = {};

  if (!form.fullName.trim()) {
    errors.fullName = "Full name is required.";
  }

  if (!form.email.trim()) {
    errors.email = "Email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = "Enter a valid email address.";
  }

  if (!form.phone.trim()) {
    errors.phone = "Phone is required.";
  }

  if (!form.propertyType) {
    errors.propertyType = "Select a property type.";
  }

  if (!form.financingNeed) {
    errors.financingNeed = "Select a financing need.";
  }

  if (!form.financingAmount.trim()) {
    errors.financingAmount = "Approximate financing amount is required.";
  }

  if (!form.consent) {
    errors.consent = "Consent is required before submitting.";
  }

  return errors;
}

function ContactForm() {
  const [form, setForm] = useState<FormState>(initialFormState);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [statusMessage, setStatusMessage] = useState("");

  const workerUrl = useMemo(
    () => import.meta.env.VITE_CONTACT_WORKER_URL as string | undefined,
    [],
  );

  const updateField = (field: keyof FormState, value: string | boolean) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatusMessage("");

    const validationErrors = validateForm(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setSubmitState("error");
      setStatusMessage("Please complete the required fields.");
      return;
    }

    if (!workerUrl) {
      setSubmitState("error");
      setStatusMessage(
        "The contact endpoint is not configured. Add VITE_CONTACT_WORKER_URL before deploying.",
      );
      return;
    }

    setSubmitState("loading");

    const payload = {
      ...form,
      source: "farm-financing-ontario-website",
      formName: "Farm Financing Solution Lead Form",
      submittedAt: new Date().toISOString(),
    };

    try {
      const response = await fetch(workerUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = (await response.json().catch(() => null)) as
        | { success?: boolean; error?: string }
        | null;

      if (!response.ok || data?.success === false) {
        throw new Error(
          data?.error || "Unable to submit your request right now.",
        );
      }

      setSubmitState("success");
      setStatusMessage(
        "Thank you. Your financing request has been sent successfully.",
      );
      setForm(initialFormState);
      setErrors({});
    } catch (error) {
      setSubmitState("error");
      setStatusMessage(
        error instanceof Error
          ? error.message
          : "Unable to submit your request right now.",
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-lg border border-oat bg-white p-6 shadow-soft sm:p-8"
      noValidate
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <FieldWrapper
          label="Full name"
          fieldId="fullName"
          error={errors.fullName}
        >
          <input
            id="fullName"
            name="fullName"
            value={form.fullName}
            onChange={(event) => updateField("fullName", event.target.value)}
            autoComplete="name"
            className="focus-ring w-full rounded-md border border-stone-300 bg-white px-4 py-3 text-stone-900"
            aria-invalid={Boolean(errors.fullName)}
            aria-describedby={errors.fullName ? "fullName-error" : undefined}
            required
          />
        </FieldWrapper>

        <FieldWrapper label="Email" fieldId="email" error={errors.email}>
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={(event) => updateField("email", event.target.value)}
            autoComplete="email"
            className="focus-ring w-full rounded-md border border-stone-300 bg-white px-4 py-3 text-stone-900"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "email-error" : undefined}
            required
          />
        </FieldWrapper>

        <FieldWrapper label="Phone" fieldId="phone" error={errors.phone}>
          <input
            id="phone"
            name="phone"
            value={form.phone}
            onChange={(event) => updateField("phone", event.target.value)}
            autoComplete="tel"
            className="focus-ring w-full rounded-md border border-stone-300 bg-white px-4 py-3 text-stone-900"
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={errors.phone ? "phone-error" : undefined}
            required
          />
        </FieldWrapper>

        <FieldWrapper
          label="Approximate financing amount"
          fieldId="financingAmount"
          error={errors.financingAmount}
        >
          <input
            id="financingAmount"
            name="financingAmount"
            value={form.financingAmount}
            onChange={(event) =>
              updateField("financingAmount", event.target.value)
            }
            inputMode="decimal"
            placeholder="$750,000"
            className="focus-ring w-full rounded-md border border-stone-300 bg-white px-4 py-3 text-stone-900 placeholder:text-stone-400"
            aria-invalid={Boolean(errors.financingAmount)}
            aria-describedby={
              errors.financingAmount ? "financingAmount-error" : undefined
            }
            required
          />
        </FieldWrapper>

        <FieldWrapper
          label="Property type"
          fieldId="propertyType"
          error={errors.propertyType}
        >
          <select
            id="propertyType"
            name="propertyType"
            value={form.propertyType}
            onChange={(event) => updateField("propertyType", event.target.value)}
            className="focus-ring w-full rounded-md border border-stone-300 bg-white px-4 py-3 text-stone-900"
            aria-invalid={Boolean(errors.propertyType)}
            aria-describedby={
              errors.propertyType ? "propertyType-error" : undefined
            }
            required
          >
            <option value="">Select property type</option>
            {propertyTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </FieldWrapper>

        <FieldWrapper
          label="Financing need"
          fieldId="financingNeed"
          error={errors.financingNeed}
        >
          <select
            id="financingNeed"
            name="financingNeed"
            value={form.financingNeed}
            onChange={(event) =>
              updateField("financingNeed", event.target.value)
            }
            className="focus-ring w-full rounded-md border border-stone-300 bg-white px-4 py-3 text-stone-900"
            aria-invalid={Boolean(errors.financingNeed)}
            aria-describedby={
              errors.financingNeed ? "financingNeed-error" : undefined
            }
            required
          >
            <option value="">Select financing need</option>
            {financingNeeds.map((need) => (
              <option key={need} value={need}>
                {need}
              </option>
            ))}
          </select>
        </FieldWrapper>

        <FieldWrapper label="Message" fieldId="message" className="sm:col-span-2">
          <textarea
            id="message"
            name="message"
            value={form.message}
            onChange={(event) => updateField("message", event.target.value)}
            rows={5}
            placeholder="Share the property location, timing, lender history, or anything else that would help with the review."
            className="focus-ring w-full rounded-md border border-stone-300 bg-white px-4 py-3 text-stone-900 placeholder:text-stone-400"
          />
        </FieldWrapper>
      </div>

      <div className="mt-6">
        <label className="flex gap-3 text-sm leading-6 text-stone-700">
          <input
            type="checkbox"
            checked={form.consent}
            onChange={(event) => updateField("consent", event.target.checked)}
            className="focus-ring mt-1 h-4 w-4 rounded border-stone-300 text-field"
            aria-invalid={Boolean(errors.consent)}
            aria-describedby={errors.consent ? "consent-error" : undefined}
            required
          />
          <span>
            I consent to Farm Financing Ontario contacting me about my financing
            request.
          </span>
        </label>
        {errors.consent && (
          <p id="consent-error" className="mt-2 text-sm text-red-700">
            {errors.consent}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={submitState === "loading"}
        className="focus-ring mt-7 inline-flex w-full items-center justify-center rounded-md bg-field px-6 py-3.5 text-base font-semibold text-white shadow-sm transition hover:bg-moss disabled:cursor-not-allowed disabled:bg-stone-400"
      >
        {submitState === "loading"
          ? "Submitting Request..."
          : "Submit Financing Request"}
      </button>

      {statusMessage && (
        <p
          className={`mt-4 rounded-md px-4 py-3 text-sm ${
            submitState === "success"
              ? "bg-green-50 text-green-800"
              : "bg-red-50 text-red-800"
          }`}
          role="status"
          aria-live="polite"
        >
          {statusMessage}
        </p>
      )}
    </form>
  );
}

type FieldWrapperProps = {
  label: string;
  fieldId: keyof FormState;
  error?: string;
  className?: string;
  children: React.ReactNode;
};

function FieldWrapper({
  label,
  fieldId,
  error,
  className = "",
  children,
}: FieldWrapperProps) {
  return (
    <div className={className}>
      <label
        htmlFor={fieldId}
        className="mb-2 block text-sm font-semibold text-stone-800"
      >
        {label}
      </label>
      {children}
      {error && (
        <p id={`${fieldId}-error`} className="mt-2 text-sm text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}

export default ContactForm;
