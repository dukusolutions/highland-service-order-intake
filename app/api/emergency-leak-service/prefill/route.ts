import { NextResponse } from "next/server";
import {
  PrefillLookupRequest,
  PrefillLookupResponse,
} from "@/types/emergencyLeakService";

export async function POST(request: Request) {
  const body = (await request.json()) as PrefillLookupRequest;
  const hasLookup = body.companyName?.trim() || body.email?.trim();

  if (!hasLookup) {
    const emptyResponse: PrefillLookupResponse = {
      found: false,
      message: "Provide a company name or email to prefill.",
    };
    return NextResponse.json(emptyResponse, { status: 400 });
  }

  const response: PrefillLookupResponse = {
    found: false,
    message:
      "Prefill endpoint stub is ready. Connect this route to your backend lookup service.",
  };

  return NextResponse.json(response, { status: 200 });
}
