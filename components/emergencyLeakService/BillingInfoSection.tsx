import { ChangeEvent } from "react";
import { IntakeFormData, ValidationErrors } from "@/types/emergencyLeakService";
import { FormInput } from "@/components/emergencyLeakService/FormInput";

type BillingInfoSectionProps = {
  formData: IntakeFormData;
  errors: ValidationErrors;
  onFieldChange: <K extends keyof IntakeFormData>(
    field: K,
    value: IntakeFormData[K],
  ) => void;
};

export default function BillingInfoSection({
  formData,
  errors,
  onFieldChange,
}: BillingInfoSectionProps) {
  const handleInput =
    <K extends keyof IntakeFormData>(field: K) =>
    (event: ChangeEvent<HTMLInputElement>) =>
      onFieldChange(field, event.target.value as IntakeFormData[K]);

  return (
    <section className="grid grid-cols-1 gap-5 rounded-lg border border-slate-300 p-4 md:grid-cols-2">
      <h2 className="md:col-span-2 text-lg font-bold text-slate-900">
        Billing Info
      </h2>
      <FormInput
        id="billingContactName"
        label="Billing Contact Name*"
        value={formData.billingContactName}
        onChange={handleInput("billingContactName")}
        error={errors.billingContactName}
      />
      <FormInput
        id="billingPhone"
        label="Billing Phone*"
        value={formData.billingPhone}
        onChange={handleInput("billingPhone")}
        error={errors.billingPhone}
      />
      <FormInput
        id="billingEmail"
        label="Billing Email*"
        value={formData.billingEmail}
        onChange={handleInput("billingEmail")}
        error={errors.billingEmail}
        type="email"
      />

      <label
        className="md:col-span-2 flex flex-col gap-2 text-sm font-semibold text-slate-800"
        htmlFor="billingAddress"
      >
        Billing Address (Street, City, State, Zip)*
        <input
          id="billingAddress"
          name="billingAddress"
          value={formData.billingAddress}
          onChange={(event) =>
            onFieldChange("billingAddress", event.target.value)
          }
          className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-200"
        />
        {errors.billingAddress ? (
          <span className="text-xs font-medium text-red-600">
            {errors.billingAddress}
          </span>
        ) : null}
      </label>
    </section>
  );
}
