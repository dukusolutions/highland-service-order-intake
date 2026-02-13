import { NextResponse } from "next/server";
import { ServiceOrderLookupResponse } from "@/types/emergencyLeakService";

export async function POST() {
  const response: ServiceOrderLookupResponse = {
    clients: [],
    billings: [],
    leaks: [],
    serviceOrders: [],
    message:
      "Service-order lookup stub is ready. Connect this route to backend lookup by service order number.",
  };

  return NextResponse.json(response, { status: 200 });
}
