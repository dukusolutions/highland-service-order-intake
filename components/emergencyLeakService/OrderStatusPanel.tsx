"use client";

import { useCallback, useEffect, useState } from "react";
import { getServiceOrderStatus } from "@/helpers/serviceOrderApi";
import {
  ServiceOrderStatusData,
  ServiceOrderStatusName,
} from "@/types/emergencyLeakService";

type OrderStatusPanelProps = {
  referenceId: string;
  /** Called when the user clicks "Submit Another Request" */
  onDismiss: () => void;
};

const STATUS_LABELS: Record<ServiceOrderStatusName, string> = {
  NEW: "New",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

const STATUS_COLORS: Record<ServiceOrderStatusName, string> = {
  NEW: "bg-blue-100 text-blue-800 border-blue-300",
  IN_PROGRESS: "bg-amber-100 text-amber-800 border-amber-300",
  COMPLETED: "bg-emerald-100 text-emerald-800 border-emerald-300",
  CANCELLED: "bg-red-100 text-red-800 border-red-300",
};

const LEAK_LOCATION_LABELS: Record<number, string> = {
  1: "Front",
  2: "Middle",
  3: "Back",
};

const LEAK_NEAR_LABELS: Record<number, string> = {
  1: "HVAC Duct",
  2: "Skylight",
  3: "Wall",
  4: "Drain",
  5: "Other",
};

const ROOF_PITCH_LABELS: Record<number, string> = {
  1: "Flat Roof",
  2: "Steep / Shingle / Tile",
};

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

function StatusBadge({ status }: { status: ServiceOrderStatusName }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold ${STATUS_COLORS[status] ?? "bg-slate-100 text-slate-800 border-slate-300"}`}
    >
      {STATUS_LABELS[status] ?? status}
    </span>
  );
}

function LeakCard({
  leak,
  label,
}: {
  leak: ServiceOrderStatusData["LeakDetails"];
  label: string;
}) {
  return (
    <div className="rounded-md border border-slate-200 bg-white p-4">
      <p className="text-sm font-bold text-slate-900">{label}</p>
      <div className="mt-2 grid grid-cols-1 gap-x-6 gap-y-1 text-sm sm:grid-cols-2">
        <Detail label="Site Name" value={leak.SiteName} />
        <Detail
          label="Address"
          value={
            [leak.SiteAddress, leak.SiteAddress2].filter(Boolean).join(", ") +
            ` — ${leak.SiteCity} ${leak.SiteZip}`
          }
        />
        <Detail label="Tenant" value={leak.TenantBusinessName} />
        <Detail label="Tenant Contact" value={leak.TenantContactName} />
        <Detail label="Phone" value={leak.TenantContactPhone} />
        <Detail label="Cell" value={leak.TenantContactCell} />
        <Detail label="Email" value={leak.TenantContactEmail} />
        <Detail label="Hours" value={leak.HoursOfOperation} />
        <Detail
          label="Leak Location"
          value={
            LEAK_LOCATION_LABELS[leak.LeakLocation] ?? String(leak.LeakLocation)
          }
        />
        <Detail
          label="Leak Near"
          value={
            leak.LeakNearOther ||
            (LEAK_NEAR_LABELS[leak.LeakNear] ?? String(leak.LeakNear))
          }
        />
        <Detail
          label="Roof Pitch"
          value={ROOF_PITCH_LABELS[leak.RoofPitch] ?? String(leak.RoofPitch)}
        />
        <Detail
          label="Access Code"
          value={leak.HasAccessCode ? leak.AccessCode || "Yes" : "None"}
        />
        <Detail
          label="Saturday Access"
          value={leak.IsSaturdayAccessPermitted ? "Yes" : "No"}
        />
        <Detail
          label="Key Required"
          value={leak.IsKeyRequired ? "Yes" : "No"}
        />
        <Detail
          label="Ladder Required"
          value={leak.IsLadderRequired ? "Yes" : "No"}
        />
        {leak.Comments ? (
          <div className="sm:col-span-2">
            <Detail label="Comments" value={leak.Comments} />
          </div>
        ) : null}
      </div>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <p className="text-slate-700">
      <span className="font-semibold text-slate-500">{label}: </span>
      {value}
    </p>
  );
}

export default function OrderStatusPanel({
  referenceId,
  onDismiss,
}: OrderStatusPanelProps) {
  const [status, setStatus] = useState<ServiceOrderStatusName | null>(null);
  const [data, setData] = useState<ServiceOrderStatusData | null>(null);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchStatus = useCallback(async () => {
    try {
      const result = await getServiceOrderStatus(referenceId);
      setStatus(result.Status);
      setData(result.Data);
      setMessage(result.Message);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to check status.");
    } finally {
      setIsLoading(false);
    }
  }, [referenceId]);

  // Initial fetch
  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center gap-3 rounded-lg border border-slate-200 bg-white p-8">
        <svg
          className="h-5 w-5 animate-spin text-emerald-600"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          />
        </svg>
        <p className="text-sm font-medium text-slate-600">
          Checking order status…
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4 rounded-lg border border-red-200 bg-red-50 p-6">
        <p className="text-sm font-medium text-red-700">{error}</p>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={fetchStatus}
            className="inline-flex items-center rounded-md border border-red-300 px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-100"
          >
            Retry
          </button>
          <button
            type="button"
            onClick={onDismiss}
            className="inline-flex items-center rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            Submit Another Request
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 rounded-lg border border-slate-200 bg-slate-50 p-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Service Order Status
          </h2>
          <p className="mt-1 text-sm text-slate-600">{message}</p>
        </div>
        {status ? <StatusBadge status={status} /> : null}
      </div>

      {/* Reference & dates */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-md border border-slate-200 bg-white px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Reference ID
          </p>
          <p className="mt-1 break-all text-sm font-bold text-slate-900">
            {referenceId}
          </p>
        </div>
        {data?.RequestDate ? (
          <div className="rounded-md border border-slate-200 bg-white px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Requested
            </p>
            <p className="mt-1 text-sm text-slate-900">
              {formatDate(data.RequestDate)}
            </p>
          </div>
        ) : null}
        {data?.CreatedAt ? (
          <div className="rounded-md border border-slate-200 bg-white px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Created
            </p>
            <p className="mt-1 text-sm text-slate-900">
              {formatDate(data.CreatedAt)}
            </p>
          </div>
        ) : null}
      </div>

      {data ? (
        <>
          {/* Client & Billing */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-md border border-slate-200 bg-white p-4">
              <p className="text-sm font-bold text-slate-900">Contact Info</p>
              <div className="mt-2 space-y-1 text-sm text-slate-700">
                <Detail label="Account" value={data.Client.AccountName} />
                <Detail
                  label="Contact"
                  value={data.Client.AccountContactName}
                />
                <Detail label="Email" value={data.Client.Email} />
                <Detail label="Phone" value={data.Client.Phone} />
              </div>
            </div>

            <div className="rounded-md border border-slate-200 bg-white p-4">
              <p className="text-sm font-bold text-slate-900">Billing Info</p>
              <div className="mt-2 space-y-1 text-sm text-slate-700">
                <Detail label="Bill To" value={data.Billing.EntityBillToName} />
                <Detail
                  label="Address"
                  value={
                    [data.Billing.BillToAddress, data.Billing.BillToAddress2]
                      .filter(Boolean)
                      .join(", ") +
                    ` — ${data.Billing.BillToCity} ${data.Billing.BillToZip}`
                  }
                />
                <Detail label="Email" value={data.Billing.BillToEmail} />
              </div>
            </div>
          </div>

          {/* Leak details */}
          <div className="space-y-4">
            <LeakCard leak={data.LeakDetails} label="Primary Leak" />
            {data.AdditionalLeaks.map((leak, i) => (
              <LeakCard
                key={`additional-leak-${i}`}
                leak={leak}
                label={`Additional Leak ${i + 1}`}
              />
            ))}
          </div>
        </>
      ) : null}

      {/* Actions */}
      <div className="flex flex-col gap-3 border-t border-slate-200 pt-4 sm:flex-row sm:justify-between">
        <button
          type="button"
          onClick={fetchStatus}
          className="inline-flex items-center justify-center gap-2 rounded-md border border-emerald-600 px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50"
        >
          Refresh Status
        </button>
        <button
          type="button"
          onClick={onDismiss}
          className="inline-flex items-center justify-center rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
        >
          Submit Another Request
        </button>
      </div>
    </div>
  );
}
