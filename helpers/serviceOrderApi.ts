import {
  PrefillLookupResponse,
  ServiceOrderRequestPayload,
} from "@/types/emergencyLeakService";

export async function prefillServiceOrderByAccount(
  companyName: string,
  email: string,
): Promise<PrefillLookupResponse> {
  const response = await fetch("/api/emergency-leak-service/prefill", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ companyName, email }),
  });

  const result = (await response.json()) as PrefillLookupResponse;

  if (!response.ok) {
    throw new Error(result.message ?? "Prefill request failed.");
  }

  return result;
}

export async function submitServiceOrderRequest(
  payload: ServiceOrderRequestPayload,
): Promise<void> {
  const response = await fetch("/api/emergency-leak-service", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Submit request failed.");
  }
}
