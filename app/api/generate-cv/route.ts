import { NextRequest, NextResponse } from "next/server";
import { generateCV } from "../../../lib/gemini";
import type { FormData as CVFormData } from "../../../lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const formData: CVFormData = await request.json();

    if (!formData.personal?.fullName || !formData.personal?.email) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 }
      );
    }

    const generatedCV = await generateCV(formData);

    return NextResponse.json(generatedCV);
  } catch (error) {
    console.error("CV generation error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to generate CV. Please try again.",
      },
      { status: 500 }
    );
  }
}
