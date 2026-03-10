"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";
import Button from "../components/ui/Button";

export default function LandingPage() {
  const router = useRouter();

  const handleGoogleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) {
      console.error("Login error:", error.message);
      alert(`Login failed: ${error.message}`);
    } else {
      console.log("OAuth redirect URL:", data?.url);
    }
  };

  const handleGetStarted = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      router.push("/dashboard");
    } else {
      handleGoogleLogin();
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight">AI CV Builder</span>
          </div>
          <Button onClick={handleGoogleLogin} size="sm">
            Sign In with Google
          </Button>
        </div>
      </nav>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-600 mb-6">
          <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          Powered by Google Gemini AI
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-balance">
          Build a Professional CV
          <br />
          <span className="text-gray-400">in Minutes, Not Hours</span>
        </h1>

        <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto text-balance">
          Enter your details, and our AI will craft a polished, ATS-friendly
          resume that gets you noticed. Completely free.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button onClick={handleGetStarted} size="lg" className="min-w-[200px]">
            Get Started Free
            <svg
              className="w-4 h-4 ml-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </Button>
          <Button variant="ghost" size="lg" onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}>
            See How It Works
          </Button>
        </div>
      </section>

      <section id="features" className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
        <h2 className="text-2xl font-bold text-center mb-12">How It Works</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              ),
              title: "1. Fill in Your Details",
              description:
                "Complete our simple multi-step form with your experience, education, and skills.",
            },
            {
              icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              ),
              title: "2. AI Generates Your CV",
              description:
                "Our AI polishes your content into a professional, ATS-optimized resume instantly.",
            },
            {
              icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              ),
              title: "3. Preview & Download",
              description:
                "Preview your CV and download it as a professional PDF — completely free.",
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="p-6 bg-gray-50 rounded-2xl border border-gray-100 hover:border-gray-200 transition-colors"
            >
              <div className="w-12 h-12 bg-white rounded-xl border border-gray-200 flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-2xl mx-auto px-4 sm:px-6 py-20">
        <h2 className="text-2xl font-bold text-center mb-12">
          Everything You Need, 100% Free
        </h2>

        <div className="bg-white border-2 border-gray-900 rounded-2xl p-8 text-center">
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
            No Credit Card Required
          </p>
          <div className="mt-4 flex items-baseline justify-center gap-1">
            <span className="text-5xl font-bold">Free</span>
          </div>
          <ul className="mt-6 space-y-3 text-sm text-gray-600">
            {[
              "AI-powered professional writing",
              "ATS-friendly format",
              "Free PDF download",
              "Unlimited re-edits",
              "No sign-up fees",
            ].map((item) => (
              <li key={item} className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {item}
              </li>
            ))}
          </ul>
          <Button onClick={handleGetStarted} size="lg" className="mt-8 w-full">
            Build Your CV Now
          </Button>
        </div>
      </section>

      <footer className="border-t border-gray-100 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center text-sm text-gray-400">
          &copy; {new Date().getFullYear()} AI CV Builder. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
