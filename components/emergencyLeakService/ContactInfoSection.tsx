import { ChangeEvent } from "react";
import {
  IntakeFormData,
  PreferredContactMethod,
  ValidationErrors,
} from "@/types/emergencyLeakService";
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
        id="contactName"
        label="Your Name*"
        value={formData.contactName}
        onChange={handleInput("contactName")}
        error={errors.contactName}
      />
      <FormInput
        id="companyName"
        label="Company Name*"
        value={formData.companyName}
        onChange={handleInput("companyName")}
        error={errors.companyName}
      />
      <FormInput
        id="phoneNumber"
        label="Phone Number*"
        value={formData.phoneNumber}
        onChange={handleInput("phoneNumber")}
        error={errors.phoneNumber}
      />
      <FormInput
        id="email"
        label="Email Address*"
        value={formData.email}
        onChange={handleInput("email")}
        error={errors.email}
        type="email"
      />

      <label
        className="flex flex-col gap-2 text-sm font-semibold text-slate-800"
        htmlFor="preferredContactMethod"
      >
        Preferred Contact Method*
        <select
          id="preferredContactMethod"
          name="preferredContactMethod"
          value={formData.preferredContactMethod}
          onChange={(event) =>
            onFieldChange(
              "preferredContactMethod",
              event.target.value as PreferredContactMethod,
            )
          }
          className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-200"
        >
          <option value="Phone">Phone</option>
          <option value="Email">Email</option>
          <option value="Text">Text</option>
        </select>
      </label>
    </section>
  );
}
