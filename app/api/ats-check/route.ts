import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { PDFParse } from "pdf-parse";

export const runtime = "nodejs";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

async function extractPdfText(buffer: Buffer): Promise<string> {
  const parser = new PDFParse({ data: new Uint8Array(buffer) });
  const result = await parser.getText();
  await parser.destroy();
  return result.text?.trim() || "";
}

export async function POST(request: NextRequest) {
  try {
    let text = "";

    const contentType = request.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const file = formData.get("file") as File | null;

      if (!file) {
        return NextResponse.json(
          { error: "No file provided." },
          { status: 400 }
        );
      }

      if (file.type === "text/plain") {
        text = await file.text();
      } else if (file.type === "application/pdf") {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        text = await extractPdfText(buffer);

        if (text.length < 30) {
          return NextResponse.json(
            {
              error:
                "Could not extract enough text from this PDF. It may be image-based or scanned. Please paste your CV text instead.",
            },
            { status: 400 }
          );
        }
      } else {
        return NextResponse.json(
          {
            error:
              "Unsupported file format. Please upload a PDF or TXT file, or paste your CV text.",
          },
          { status: 400 }
        );
      }
    } else {
      const body = await request.json();
      text = body.text;
    }

    if (!text || typeof text !== "string" || text.trim().length < 50) {
      return NextResponse.json(
        { error: "Please upload a valid CV with enough content to analyze." },
        { status: 400 }
      );
    }

    const prompt = `You are an expert ATS (Applicant Tracking System) analyst. Analyze the following CV/resume text and return a JSON object with an ATS compatibility score and detailed feedback.

Score the CV from 0-100 based on these ATS criteria:
1. **Contact Information** (10 pts): Full name, email, phone, location clearly present
2. **Professional Summary** (10 pts): Clear, keyword-rich summary/objective section
3. **Work Experience** (20 pts): Properly formatted with role, company, dates, bullet points with action verbs and quantified achievements
4. **Education** (10 pts): Degree, institution, dates, GPA/grades clearly listed
5. **Skills** (15 pts): Dedicated skills section with relevant industry keywords
6. **Formatting** (15 pts): Clean structure, standard section headings (no tables, images, columns that ATS can't parse)
7. **Keywords** (10 pts): Industry-specific keywords and phrases present
8. **Completeness** (10 pts): All essential CV sections present (no major gaps)

Return ONLY valid JSON, no markdown, no code fences:
{
  "score": number (0-100),
  "breakdown": {
    "contactInfo": { "score": number (0-10), "feedback": "string" },
    "summary": { "score": number (0-10), "feedback": "string" },
    "experience": { "score": number (0-20), "feedback": "string" },
    "education": { "score": number (0-10), "feedback": "string" },
    "skills": { "score": number (0-15), "feedback": "string" },
    "formatting": { "score": number (0-15), "feedback": "string" },
    "keywords": { "score": number (0-10), "feedback": "string" },
    "completeness": { "score": number (0-10), "feedback": "string" }
  },
  "strengths": ["string", "string", "string"],
  "improvements": ["string", "string", "string"],
  "missingKeywords": ["string"]
}

CV Text to analyze:
${text}`;

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        temperature: 0.3,
        topP: 0.9,
        maxOutputTokens: 4096,
      },
    });

    const result = await model.generateContent(prompt);
    const textResponse = result.response.text();

    if (!textResponse) {
      throw new Error("No response from Gemini API");
    }

    const cleaned = textResponse
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();

    const parsed = JSON.parse(cleaned);

    const atsResult = {
      score: typeof parsed.score === "number" ? parsed.score : 0,
      breakdown: parsed.breakdown || {},
      strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],
      improvements: Array.isArray(parsed.improvements) ? parsed.improvements : [],
      missingKeywords: Array.isArray(parsed.missingKeywords) ? parsed.missingKeywords : [],
    };

    return NextResponse.json(atsResult);
  } catch (error) {
    console.error("ATS check error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to analyze CV. Please try again.",
      },
      { status: 500 }
    );
  }
}
