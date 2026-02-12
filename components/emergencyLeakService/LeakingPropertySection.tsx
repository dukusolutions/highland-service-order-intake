import { ChangeEvent } from "react";
import {
  LeakingProperty,
  ValidationErrors,
} from "@/types/emergencyLeakService";
import {
  FormInput,
  FormTextarea,
} from "@/components/emergencyLeakService/FormInput";

type LeakingPropertySectionProps = {
  property: LeakingProperty;
  errors: ValidationErrors;
  onPropertyChange: <K extends keyof LeakingProperty>(
    field: K,
    value: LeakingProperty[K],
  ) => void;
};

export default function LeakingPropertySection({
  property,
  errors,
  onPropertyChange,
}: LeakingPropertySectionProps) {
  const handleInput =
    <K extends keyof LeakingProperty>(field: K) =>
    (event: ChangeEvent<HTMLInputElement>) =>
      onPropertyChange(field, event.target.value as LeakingProperty[K]);

  return (
    <section className="rounded-lg border border-slate-300 bg-white">
      <div className="border-b border-slate-300 bg-slate-100 px-4 py-3">
        <h2 className="text-lg font-bold text-slate-900">Leaking Property 1</h2>
      </div>
      <div className="grid grid-cols-1 gap-5 p-4 md:grid-cols-2">
        <FormInput
          id="propertyNameId"
          label="Property Name/ID*"
          value={property.propertyNameId}
          onChange={handleInput("propertyNameId")}
          error={errors.propertyNameId}
        />
        <FormInput
          id="streetAddress"
          label="Street Address*"
          value={property.streetAddress}
          onChange={handleInput("streetAddress")}
          error={errors.streetAddress}
        />
        <FormInput
          id="city"
          label="City*"
          value={property.city}
          onChange={handleInput("city")}
          error={errors.city}
        />
        <FormInput
          id="state"
          label="State*"
          value={property.state}
          onChange={handleInput("state")}
          error={errors.state}
        />
        <FormInput
          id="zipCode"
          label="Zip Code*"
          value={property.zipCode}
          onChange={handleInput("zipCode")}
          error={errors.zipCode}
        />
        <FormInput
          id="propertyType"
          label="Property Type*"
          value={property.propertyType}
          onChange={handleInput("propertyType")}
          error={errors.propertyType}
        />
        <FormTextarea
          id="serviceDescription"
          label="Description of Services*"
          value={property.serviceDescription}
          onChange={(event) =>
            onPropertyChange("serviceDescription", event.target.value)
          }
          error={errors.serviceDescription}
          className="md:col-span-2 flex flex-col gap-2 text-sm font-semibold text-slate-800"
        />
      </div>
    </section>
  );
}
