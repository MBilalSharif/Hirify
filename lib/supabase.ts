import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase env vars: NEXT_PUBLIC_SUPABASE_URL and/or NEXT_PUBLIC_SUPABASE_ANON_KEY"
  );
}

if (supabaseAnonKey.startsWith("sb_secret_")) {
  throw new Error(
    "NEXT_PUBLIC_SUPABASE_ANON_KEY is set to a Supabase secret key (sb_secret_*). Use the anon public key from Supabase Dashboard → Project Settings → API."
  );
}

export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);

export interface CVRecord {
  id: string;
  user_id: string;
  form_data: FormData;
  generated_cv: GeneratedCV;
  is_paid: boolean;
  created_at: string;
}

export interface FormData {
  personal: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    linkedinUrl: string;
    portfolioUrl: string;
  };
  experience: {
    company: string;
    role: string;
    duration: string;
    description: string;
  }[];
  internships: {
    company: string;
    role: string;
    duration: string;
    description: string;
  }[];
  isFreshGraduate: boolean;
  education: {
    degree: string;
    institution: string;
    startMonth: string;
    startYear: string;
    endMonth: string;
    endYear: string;
    grade: string;
  }[];
  skills: string[];
  languages: string[];
  certifications: string[];
  projects: {
    title: string;
    description: string;
    techUsed: string;
  }[];
  bio: string;
}

export interface GeneratedCV {
  summary: string;
  experience: {
    role: string;
    company: string;
    duration: string;
    bullets: string[];
  }[];
  education: {
    degree: string;
    institution: string;
    year: string;
    grade: string;
  }[];
  skills: string[];
  languages: string[];
  certifications: string[];
  projects: {
    title: string;
    description: string;
    techUsed: string[];
  }[];
}
