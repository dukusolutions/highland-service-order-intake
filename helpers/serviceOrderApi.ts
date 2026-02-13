import {
  ServiceOrderLookupResponse,
  ServiceOrderRequestPayload,
} from "@/types/emergencyLeakService";

async function readLookupResponse(
  response: Response,
): Promise<ServiceOrderLookupResponse> {
  const result = (await response.json()) as ServiceOrderLookupResponse;

  if (!response.ok) {
    throw new Error(result.message ?? "Lookup request failed.");
  }

  return result;
}

export async function lookupServiceOrderByNumber(
  serviceOrderNumber: string,
): Promise<ServiceOrderLookupResponse> {
  const response = await fetch(
    "/api/emergency-leak-service/lookup/service-order",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ serviceOrderNumber }),
    },
  );

  return readLookupResponse(response);
}

export async function lookupServiceOrderByEmail(
  email: string,
): Promise<ServiceOrderLookupResponse> {
  const response = await fetch("/api/emergency-leak-service/lookup/email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  return readLookupResponse(response);
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
