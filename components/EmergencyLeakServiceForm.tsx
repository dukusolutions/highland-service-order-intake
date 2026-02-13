"use client";

import { FormEvent, useMemo, useState } from "react";
import {
  INITIAL_FORM_DATA,
  validateEmergencyLeakServiceForm,
} from "@/helpers/emergencyLeakServiceForm";
import { submitServiceOrderRequest } from "@/helpers/serviceOrderApi";
import { buildServiceOrderRequestPayload } from "@/helpers/serviceOrderPayload";
import {
  BillingInfoPayload,
  ClientInfoPayload,
  IntakeFormData,
  LeakDetailsPayload,
  LeakingProperty,
  ServiceOrderLookupResponse,
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
  const [serviceOrderLookupValue, setServiceOrderLookupValue] = useState("");
  const [emailLookupValue, setEmailLookupValue] = useState("");
  const [lookupResults, setLookupResults] =
    useState<ServiceOrderLookupResponse | null>(null);
  const [lookupMessage, setLookupMessage] = useState("");
  const [isLookingUp] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitState, setSubmitState] = useState<"idle" | "success" | "error">(
    "idle",
  );

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

  function applyClientSelection(client: ClientInfoPayload) {
    applyPrefillData({
      clientAccountName: client.AccountName,
      clientAccountContactName: client.AccountContactName,
      clientEmail: client.Email,
      clientPhone: client.Phone,
    });
  }

  function applyBillingSelection(billing: BillingInfoPayload) {
    applyPrefillData({
      billingEntityBillToName: billing.EntityBillToName,
      billingBillToAddress: billing.BillToAddress,
      billingBillToAddress2: billing.BillToAddress2,
      billingBillToCity: billing.BillToCity,
      billingBillToZip: billing.BillToZip,
      billingBillToEmail: billing.BillToEmail,
    });
  }

  function applyLeakSelection(leak: LeakDetailsPayload) {
    applyPrefillData({
      leakingProperties: [
        {
          siteName: leak.SiteName,
          siteAddress: leak.SiteAddress,
          siteAddress2: leak.SiteAddress2,
          siteCity: leak.SiteCity,
          siteZip: leak.SiteZip,
          tenantBusinessName: leak.TenantBusinessName,
          tenantContactName: leak.TenantContactName,
          tenantContactPhone: leak.TenantContactPhone,
          tenantContactCell: leak.TenantContactCell,
          tenantContactEmail: leak.TenantContactEmail,
          hoursOfOperation: leak.HoursOfOperation,
          leakLocation: leak.LeakLocation,
          leakNear: leak.LeakNear,
          leakNearOther: leak.LeakNearOther,
          hasAccessCode: leak.HasAccessCode,
          accessCode: leak.AccessCode,
          isSaturdayAccessPermitted: leak.IsSaturdayAccessPermitted,
          isKeyRequired: leak.IsKeyRequired,
          isLadderRequired: leak.IsLadderRequired,
          roofPitch: leak.RoofPitch,
          comments: leak.Comments,
        },
      ],
    });
  }

  function handleLookupByServiceOrder() {
    return;
  }

  function handleLookupByEmail() {
    return;
  }

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
      setLookupResults(null);
      setLookupMessage("");
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
      <section className="grid grid-cols-1 gap-5 rounded-lg border border-slate-300 p-4 md:grid-cols-2">
        <h2 className="md:col-span-2 text-lg font-bold text-slate-900">
          Lookup Existing Records
        </h2>

        <label
          className="flex flex-col gap-2 text-sm font-semibold text-slate-800"
          htmlFor="lookupServiceOrderNumber"
        >
          Previous Service Order Number
          <input
            id="lookupServiceOrderNumber"
            name="lookupServiceOrderNumber"
            value={serviceOrderLookupValue}
            onChange={(event) => setServiceOrderLookupValue(event.target.value)}
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-200"
          />
          <button
            type="button"
            onClick={handleLookupByServiceOrder}
            disabled={isLookingUp || !serviceOrderLookupValue.trim()}
            className="mt-2 inline-flex items-center justify-center rounded-md border border-emerald-600 px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Lookup by Service Order
          </button>
        </label>

        <label
          className="flex flex-col gap-2 text-sm font-semibold text-slate-800"
          htmlFor="lookupEmail"
        >
          Lookup Email
          <input
            id="lookupEmail"
            name="lookupEmail"
            value={emailLookupValue}
            onChange={(event) => setEmailLookupValue(event.target.value)}
            type="email"
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-200"
          />
          <button
            type="button"
            onClick={handleLookupByEmail}
            disabled={isLookingUp || !emailLookupValue.trim()}
            className="mt-2 inline-flex items-center justify-center rounded-md border border-emerald-600 px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Lookup by Email
          </button>
        </label>

        {lookupMessage ? (
          <p className="md:col-span-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
            {lookupMessage}
          </p>
        ) : null}

        {lookupResults ? (
          <div className="md:col-span-2 grid grid-cols-1 gap-4">
            {lookupResults.clients.map((client, index) => (
              <div
                key={`client-${index}`}
                className="rounded-md border border-slate-200 p-3"
              >
                <p className="text-sm font-semibold text-slate-900">
                  Client: {client.AccountName}
                </p>
                <p className="text-xs text-slate-600">
                  {client.AccountContactName} · {client.Email}
                </p>
                <button
                  type="button"
                  onClick={() => applyClientSelection(client)}
                  className="mt-2 inline-flex items-center rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700"
                >
                  Use Client
                </button>
              </div>
            ))}

            {lookupResults.billings.map((billing, index) => (
              <div
                key={`billing-${index}`}
                className="rounded-md border border-slate-200 p-3"
              >
                <p className="text-sm font-semibold text-slate-900">
                  Billing: {billing.EntityBillToName}
                </p>
                <p className="text-xs text-slate-600">
                  {billing.BillToAddress} {billing.BillToCity}
                </p>
                <button
                  type="button"
                  onClick={() => applyBillingSelection(billing)}
                  className="mt-2 inline-flex items-center rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700"
                >
                  Use Billing
                </button>
              </div>
            ))}

            {lookupResults.leaks.map((leak, index) => (
              <div
                key={`leak-${index}`}
                className="rounded-md border border-slate-200 p-3"
              >
                <p className="text-sm font-semibold text-slate-900">
                  Leak: {leak.SiteName}
                </p>
                <p className="text-xs text-slate-600">
                  {leak.SiteAddress}, {leak.SiteCity}
                </p>
                <button
                  type="button"
                  onClick={() => applyLeakSelection(leak)}
                  className="mt-2 inline-flex items-center rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700"
                >
                  Use Leak Details
                </button>
              </div>
            ))}
          </div>
        ) : null}
      </section>

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
