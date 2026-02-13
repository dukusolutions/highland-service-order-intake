"use client";

import {
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  INITIAL_FORM_DATA,
  validateEmergencyLeakServiceForm,
} from "@/helpers/emergencyLeakServiceForm";
import {
  prefillServiceOrderByAccount,
  submitServiceOrderRequest,
} from "@/helpers/serviceOrderApi";
import { buildServiceOrderRequestPayload } from "@/helpers/serviceOrderPayload";
import {
  IntakeFormData,
  LeakingProperty,
  ValidationErrors,
} from "@/types/emergencyLeakService";
import LeakingPropertySection from "@/components/emergencyLeakService/LeakingPropertySection";
import ContactInfoSection from "@/components/emergencyLeakService/ContactInfoSection";
import BillingInfoSection from "@/components/emergencyLeakService/BillingInfoSection";

type EmergencyLeakServiceFormProps = {
  className?: string;
};

export default function EmergencyLeakServiceForm({
  className,
}: EmergencyLeakServiceFormProps) {
  const [formData, setFormData] = useState<IntakeFormData>(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitState, setSubmitState] = useState<"idle" | "success" | "error">(
    "idle",
  );
  const lastPrefillKeyRef = useRef("");

  const activeProperty = useMemo(
    () => formData.leakingProperties[0],
    [formData.leakingProperties],
  );

  function updateField<K extends keyof IntakeFormData>(
    field: K,
    value: IntakeFormData[K],
  ) {
    setFormData((current) => ({ ...current, [field]: value }));
  }

  function updatePropertyField<K extends keyof LeakingProperty>(
    field: K,
    value: LeakingProperty[K],
  ) {
    setFormData((current) => ({
      ...current,
      leakingProperties: [{ ...current.leakingProperties[0], [field]: value }],
    }));
  }

  function applyPrefillData(data: Partial<IntakeFormData>) {
    setFormData((current) => {
      const next: IntakeFormData = {
        ...current,
        ...data,
      };

      if (data.leakingProperties && data.leakingProperties.length > 0) {
        next.leakingProperties = [
          {
            ...current.leakingProperties[0],
            ...data.leakingProperties[0],
          },
        ];
      }

      return next;
    });
  }

  const prefillFromLookup = useCallback(
    async (companyName: string, email: string) => {
      try {
        const result = await prefillServiceOrderByAccount(companyName, email);
        if (result.found && result.data) {
          applyPrefillData(result.data as Partial<IntakeFormData>);
        }
      } catch {
        return;
      }
    },
    [],
  );

  useEffect(() => {
    const companyName = formData.clientAccountName.trim();
    const email = formData.clientEmail.trim();

    if (!companyName && !email) {
      return;
    }

    const lookupKey = `${companyName}::${email}`;
    if (lookupKey === lastPrefillKeyRef.current) {
      return;
    }

    const timeout = setTimeout(() => {
      lastPrefillKeyRef.current = lookupKey;
      void prefillFromLookup(companyName, email);
    }, 500);

    return () => clearTimeout(timeout);
  }, [formData.clientAccountName, formData.clientEmail, prefillFromLookup]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitState("idle");

    const validation = validateEmergencyLeakServiceForm(formData);
    setErrors(validation);

    if (Object.keys(validation).length > 0) {
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = buildServiceOrderRequestPayload(formData);
      await submitServiceOrderRequest(payload);

      setSubmitState("success");
      setFormData(INITIAL_FORM_DATA);
      setErrors({});
      lastPrefillKeyRef.current = "";
    } catch {
      setSubmitState("error");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      className={className ?? "space-y-8 px-6 py-8 md:px-10"}
      onSubmit={onSubmit}
      noValidate
    >
      <ContactInfoSection
        formData={formData}
        errors={errors}
        onFieldChange={updateField}
      />

      <LeakingPropertySection
        property={activeProperty}
        errors={errors}
        onPropertyChange={updatePropertyField}
      />

      <div className="-mt-4">
        <button
          type="button"
          className="inline-flex items-center justify-center border border-emerald-600 px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50"
        >
          Add Property
        </button>
      </div>

      <BillingInfoSection
        formData={formData}
        errors={errors}
        onFieldChange={updateField}
      />

      <div className="flex flex-col gap-3 border-t border-slate-300 pt-6 md:flex-row md:justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center justify-center rounded-md bg-emerald-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? "Submitting..." : "Submit Request"}
        </button>
      </div>

      {submitState === "success" ? (
        <p className="rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
          Request submitted successfully.
        </p>
      ) : null}

      {submitState === "error" ? (
        <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          Submission failed. Connect your backend endpoint and try again.
        </p>
      ) : null}
    </form>
  );
}
