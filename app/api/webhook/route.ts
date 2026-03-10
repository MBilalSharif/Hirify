import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    { error: "Payment webhook is not yet configured." },
    { status: 501 }
  );
}
