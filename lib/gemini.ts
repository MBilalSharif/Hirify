import { GoogleGenerativeAI } from "@google/generative-ai";
import type { FormData, GeneratedCV } from "./supabase";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function generateCV(formData: FormData): Promise<GeneratedCV> {
  const prompt = `You are a professional CV writer. Take the following raw user information and return a polished, ATS-friendly CV as structured JSON only, no markdown, no explanation, no code fences.

IMPORTANT RULES:
- You MUST return ALL sections listed below, even if user data is minimal — never skip a section.
- Every array must have at least one item if the user provided data for it, or be an empty array [] if not.
- For education "year" field, combine the start and end dates into a single string like "Sep 2020 - Jun 2024".
- For experience, write 3-5 professional bullet points per role based on the user's description.
- For projects, rewrite the descriptions professionally and split techUsed into an array of individual technologies.
- Return ONLY valid JSON — no trailing commas, no comments, no markdown.

Return this EXACT JSON structure (all 7 keys are mandatory):
{
  "summary": "string (3-4 compelling sentences)",
  "experience": [{ "role": "string", "company": "string", "duration": "string", "bullets": ["string"] }],
  "education": [{ "degree": "string", "institution": "string", "year": "string", "grade": "string" }],
  "skills": ["string"],
  "languages": ["string"],
  "certifications": ["string"],
  "projects": [{ "title": "string", "description": "string", "techUsed": ["string"] }]
}

User Data:
Name: ${formData.personal.fullName}
Email: ${formData.personal.email}
Phone: ${formData.personal.phone}
Location: ${formData.personal.location}
LinkedIn: ${formData.personal.linkedinUrl || "Not provided"}
Portfolio: ${formData.personal.portfolioUrl || "Not provided"}

Work Experience:
${formData.experience.length > 0
  ? formData.experience
      .map(
        (exp) =>
          `- ${exp.role} at ${exp.company} (${exp.duration}): ${exp.description}`
      )
      .join("\n")
  : "None"}

Internships:
${formData.internships.length > 0
  ? formData.internships
      .map(
        (intern) =>
          `- ${intern.role} at ${intern.company} (${intern.duration}): ${intern.description}`
      )
      .join("\n")
  : "None"}

Fresh Graduate: ${formData.isFreshGraduate ? "Yes" : "No"}

Education:
${formData.education
  .map(
    (edu) =>
      `- ${edu.degree} from ${edu.institution} (${edu.startMonth} ${edu.startYear} - ${edu.endMonth} ${edu.endYear}), Grade: ${edu.grade}`
  )
  .join("\n")}

Skills: ${formData.skills.join(", ")}
Languages: ${formData.languages.join(", ")}
Certifications: ${formData.certifications.length > 0 ? formData.certifications.join(", ") : "None"}
Projects:
${formData.projects && formData.projects.length > 0
  ? formData.projects
      .map(
        (proj) =>
          `- ${proj.title}: ${proj.description} (Tech: ${proj.techUsed})`
      )
      .join("\n")
  : "None"}

${formData.bio ? `Bio/Summary: ${formData.bio}` : ""}

Remember: Return ALL 7 top-level keys (summary, experience, education, skills, languages, certifications, projects). Do not omit any.`;

  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: {
      temperature: 0.7,
      topP: 0.9,
      maxOutputTokens: 8192,
    },
  });

  const result = await model.generateContent(prompt);
  const textResponse = result.response.text();

  if (!textResponse) {
    throw new Error("No response received from Gemini API");
  }

  const cleanedResponse = textResponse
    .replace(/```json\n?/g, "")
    .replace(/```\n?/g, "")
    .trim();

  const parsed = JSON.parse(cleanedResponse);

  const generatedCV: GeneratedCV = {
    summary: parsed.summary || "",
    experience: Array.isArray(parsed.experience) ? parsed.experience : [],
    education: Array.isArray(parsed.education) ? parsed.education : [],
    skills: Array.isArray(parsed.skills) ? parsed.skills : [],
    languages: Array.isArray(parsed.languages) ? parsed.languages : [],
    certifications: Array.isArray(parsed.certifications) ? parsed.certifications : [],
    projects: Array.isArray(parsed.projects) ? parsed.projects : [],
  };

  return generatedCV;
}
