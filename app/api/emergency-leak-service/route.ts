import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();

  return NextResponse.json(
    {
      message:
        "Emergency leak service endpoint stub is ready for backend integration.",
      received: body,
    },
    { status: 200 },
  );
}
