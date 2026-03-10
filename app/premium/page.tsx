"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";
import Button from "../../components/ui/Button";
import { useToast } from "../../components/ui/Toast";

const PLANS = [
  {
    id: "international",
    label: "International",
    price: "$5",
    currency: "USD",
    amount: 5,
    description: "One-time payment for lifetime premium access",
    features: [
      "All 7 ATS-optimized CV templates",
      "AI-powered CV generation (unlimited)",
      "PDF download with no watermark",
      "Priority support",
      "Future templates included free",
    ],
  },
  {
    id: "pakistan",
    label: "Pakistan",
    price: "Rs 600",
    currency: "PKR",
    amount: 600,
    description: "One-time payment for lifetime premium access",
    features: [
      "All 7 ATS-optimized CV templates",
      "AI-powered CV generation (unlimited)",
      "PDF download with no watermark",
      "Priority support",
      "Future templates included free",
    ],
  },
];

export default function PremiumPage() {
  const router = useRouter();
  const { showToast, ToastContainer } = useToast();
  const [selectedPlan, setSelectedPlan] = useState("international");
  const [processing, setProcessing] = useState(false);
  const [userName, setUserName] = useState("");

  const checkAuth = useCallback(async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      router.push("/");
      return;
    }
    setUserName(
      session.user.user_metadata?.full_name || session.user.email || "User"
    );
  }, [router]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const handlePayment = async () => {
    setProcessing(true);
    try {
      const plan = PLANS.find((p) => p.id === selectedPlan);
      if (!plan) return;

      // Call the checkout API
      const response = await fetch("/api/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planId: plan.id,
          currency: plan.currency,
          amount: plan.amount,
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Payment initiation failed");
      }

      const data = await response.json();

      if (data.url) {
        // Redirect to Stripe checkout
        window.location.href = data.url;
      } else {
        showToast("Payment session created. Redirecting...", "success");
      }
    } catch (err) {
      console.error("Payment error:", err);
      showToast(
        err instanceof Error ? err.message : "Payment failed. Please try again.",
        "error"
      );
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer />

      <header className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-2 hover:opacity-70 transition-opacity"
          >
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
          </button>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 hidden sm:block">
              {userName}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/dashboard")}
            >
              ← Dashboard
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-100 text-amber-700 rounded-full text-sm font-semibold mb-4">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            Premium Access
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Upgrade to Premium
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Get lifetime access to all ATS-optimized CV templates, unlimited AI
            generations, and watermark-free PDF downloads.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-12">
          {PLANS.map((plan) => {
            const isSelected = selectedPlan === plan.id;
            return (
              <button
                key={plan.id}
                type="button"
                onClick={() => setSelectedPlan(plan.id)}
                className={`text-left rounded-2xl border-2 p-6 transition-all ${
                  isSelected
                    ? "border-amber-400 bg-amber-50 shadow-lg shadow-amber-100"
                    : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-md"
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      {plan.label}
                    </h3>
                    <p className="text-sm text-gray-500">{plan.description}</p>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      isSelected
                        ? "border-amber-500 bg-amber-500"
                        : "border-gray-300"
                    }`}
                  >
                    {isSelected && (
                      <svg
                        className="w-3 h-3 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={3}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </div>
                </div>

                <div className="mb-5">
                  <span className="text-4xl font-bold text-gray-900">
                    {plan.price}
                  </span>
                  <span className="text-sm text-gray-500 ml-2">
                    {plan.currency} / one-time
                  </span>
                </div>

                <ul className="space-y-2.5">
                  {plan.features.map((feature, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-sm text-gray-700"
                    >
                      <svg
                        className="w-4 h-4 text-green-500 mt-0.5 shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </button>
            );
          })}
        </div>

        <div className="max-w-md mx-auto text-center">
          <Button
            size="lg"
            onClick={handlePayment}
            loading={processing}
            className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white border-0 text-base py-3"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            Pay{" "}
            {PLANS.find((p) => p.id === selectedPlan)?.price ?? "$5"}{" "}
            {PLANS.find((p) => p.id === selectedPlan)?.currency ?? "USD"} —
            Become Premium
          </Button>
          <p className="text-xs text-gray-400 mt-3">
            Secure payment via Stripe. One-time charge, no recurring fees.
          </p>
        </div>

        <div className="mt-16 max-w-3xl mx-auto">
          <h2 className="text-xl font-bold text-center text-gray-900 mb-8">
            What&apos;s Included in Premium
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {[
              {
                icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
                title: "7 ATS-Optimized Templates",
                desc: "Software Engineer, Fresh Graduate, Graphic Designer, Data Scientist, Marketing Manager, Project Manager, UI/UX Designer",
              },
              {
                icon: "M13 10V3L4 14h7v7l9-11h-7z",
                title: "Unlimited AI Generation",
                desc: "Generate as many CV versions as you need with Google Gemini AI — no limits",
              },
              {
                icon: "M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
                title: "Clean PDF Downloads",
                desc: "Download your CV as a professional A4 PDF with no watermarks or branding",
              },
              {
                icon: "M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z",
                title: "Future Updates Free",
                desc: "Any new templates or features we add will be available to you at no extra cost",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white rounded-xl border border-gray-200 p-5 flex gap-4"
              >
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center shrink-0">
                  <svg
                    className="w-5 h-5 text-amber-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d={item.icon}
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
