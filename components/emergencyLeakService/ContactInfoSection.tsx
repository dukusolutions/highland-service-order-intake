import { ChangeEvent } from "react";
import { IntakeFormData, ValidationErrors } from "@/types/emergencyLeakService";
import { FormInput } from "@/components/emergencyLeakService/FormInput";

type ContactInfoSectionProps = {
  formData: IntakeFormData;
  errors: ValidationErrors;
  onFieldChange: <K extends keyof IntakeFormData>(
    field: K,
    value: IntakeFormData[K],
  ) => void;
};

export default function ContactInfoSection({
  formData,
  errors,
  onFieldChange,
}: ContactInfoSectionProps) {
  const handleInput =
    <K extends keyof IntakeFormData>(field: K) =>
    (event: ChangeEvent<HTMLInputElement>) =>
      onFieldChange(field, event.target.value as IntakeFormData[K]);

  return (
    <section className="grid grid-cols-1 gap-5 rounded-lg border border-slate-300 p-4 md:grid-cols-2">
      <h2 className="md:col-span-2 text-lg font-bold text-slate-900">
        Contact Info
      </h2>
      <FormInput
        id="clientAccountName"
        label="Account Name*"
        value={formData.clientAccountName}
        onChange={handleInput("clientAccountName")}
        error={errors.clientAccountName}
      />
      <FormInput
        id="clientAccountContactName"
        label="Account Contact Name*"
        value={formData.clientAccountContactName}
        onChange={handleInput("clientAccountContactName")}
        error={errors.clientAccountContactName}
      />
      <FormInput
        id="clientPhone"
        label="Phone Number*"
        value={formData.clientPhone}
        onChange={handleInput("clientPhone")}
        error={errors.clientPhone}
      />
      <FormInput
        id="clientEmail"
        label="Email Address*"
        value={formData.clientEmail}
        onChange={handleInput("clientEmail")}
        error={errors.clientEmail}
        type="email"
      />
    </section>
  );
}
