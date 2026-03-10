"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase, CVRecord } from "../../lib/supabase";
import Button from "../../components/ui/Button";
import { useToast } from "../../components/ui/Toast";
import { demoTemplates } from "../../lib/demoTemplates";
import ATSChecker from "../../components/ATSChecker";

export default function DashboardPage() {
  const router = useRouter();
  const { showToast, ToastContainer } = useToast();
  const [cvs, setCvs] = useState<CVRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("");
  const hasLoaded = useRef(false);
  const showToastRef = useRef(showToast);
  showToastRef.current = showToast;

  const loadData = useCallback(async () => {
    if (hasLoaded.current) return;
    hasLoaded.current = true;

    try {
      // Check auth
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        router.push("/");
        return;
      }

      setUserName(
        session.user.user_metadata?.full_name ||
          session.user.email ||
          "User"
      );

      // Fetch CVs
      const { data, error } = await supabase
        .from("cvs")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });

      if (error) {
        if (error.code === "42P01" || error.message?.includes("does not exist")) {
          setCvs([]);
        } else {
          throw error;
        }
      } else {
        setCvs((data as CVRecord[]) || []);
      }
    } catch (err) {
      console.error("Error loading dashboard:", err);
      showToastRef.current("Failed to load your CVs", "error");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const handleDeleteCV = async (id: string) => {
    try {
      const { error } = await supabase.from("cvs").delete().eq("id", id);
      if (error) throw error;
      setCvs((prev) => prev.filter((cv) => cv.id !== id));
      showToast("CV deleted successfully", "success");
    } catch {
      showToast("Failed to delete CV", "error");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-black rounded-full animate-spin" />
          <p className="text-sm text-gray-500">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer />

      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight">AI CV Builder</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 hidden sm:block">
              Welcome, {userName}
            </span>
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <p className="text-sm text-gray-500">Total CVs Created</p>
            <p className="text-3xl font-bold mt-1">{cvs.length}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <p className="text-sm text-gray-500">Paid Downloads</p>
            <p className="text-3xl font-bold mt-1">
              {cvs.filter((cv) => cv.is_paid).length}
            </p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <p className="text-sm text-gray-500">Quick Action</p>
            <Button
              onClick={() => router.push("/builder")}
              size="sm"
              className="mt-2"
            >
              + Create New CV
            </Button>
          </div>
        </div>

        <div className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Your CVs</h2>
            <Button onClick={() => router.push("/builder")} size="sm">
              + New CV
            </Button>
          </div>

          {cvs.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
              <svg
                className="w-12 h-12 text-gray-300 mx-auto mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h3 className="text-lg font-semibold text-gray-600">
                No CVs yet
              </h3>
              <p className="text-sm text-gray-400 mt-1 mb-6">
                Create your first AI-powered CV in minutes.
              </p>
              <Button onClick={() => router.push("/builder")}>
                Create Your First CV
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {cvs.map((cv) => (
                <div
                  key={cv.id}
                  className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {cv.form_data.personal.fullName || "Untitled CV"}
                      </h3>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(cv.created_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                    {cv.is_paid && (
                      <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                        Paid
                      </span>
                    )}
                  </div>

                  <div className="mt-4 flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        router.push(`/preview?id=${cv.id}`)
                      }
                    >
                      View
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        router.push(`/builder?edit=${cv.id}`)
                      }
                    >
                      Edit
                    </Button>
                    <button
                      onClick={() => handleDeleteCV(cv.id)}
                      className="ml-auto text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-xl font-bold text-gray-900">ATS Score Checker</h2>
            <span className="px-2.5 py-0.5 bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-full">
              Free
            </span>
          </div>
          <ATSChecker
            onBuildWithUs={() => {
              const el = document.getElementById("premium-templates");
              if (el) {
                el.scrollIntoView({ behavior: "smooth" });
              } else {
                router.push("/premium");
              }
            }}
          />
        </div>

        <div id="premium-templates" className="mb-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-2">
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-xl font-bold text-gray-900">Select from ATS Friendly CV</h2>
              <span className="px-2.5 py-0.5 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                ATS Optimized
              </span>
              <span className="px-2.5 py-0.5 bg-amber-100 text-amber-700 text-xs font-semibold rounded-full flex items-center gap-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                Premium
              </span>
            </div>
            <Button
              size="sm"
              onClick={() => router.push("/premium")}
              className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white border-0 shrink-0"
            >
              <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              Become Premium User
            </Button>
          </div>
          <p className="text-sm text-gray-500 mb-6">
            Pick a professionally structured template, customize it with your own details, and generate a polished CV.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {demoTemplates.map((tpl) => (
              <div
                key={tpl.id}
                className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg hover:border-gray-300 transition-all flex flex-col"
              >
                {/* Template Header */}
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-bold text-gray-900">{tpl.label}</h3>
                  <span className="shrink-0 ml-2 px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-bold rounded uppercase tracking-wide">
                    ATS Ready
                  </span>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-600 leading-relaxed mb-4">
                  {tpl.description}
                </p>

                {/* Pricing */}
                <div className="mb-3 bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-lg p-3">
                  <p className="text-xs font-semibold text-amber-800 uppercase tracking-wider mb-1.5">
                    Premium Pricing
                  </p>
                  <div className="flex items-baseline gap-3">
                    <div>
                      <span className="text-lg font-bold text-gray-900">$5</span>
                      <span className="text-xs text-gray-500 ml-1">USD</span>
                    </div>
                    <span className="text-gray-300">|</span>
                    <div>
                      <span className="text-lg font-bold text-gray-900">600</span>
                      <span className="text-xs text-gray-500 ml-1">PKR</span>
                    </div>
                  </div>
                </div>

                {/* Sections included */}
                <div className="mb-3">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                    Sections Included
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {tpl.sections.map((section) => (
                      <span
                        key={section}
                        className="px-2 py-0.5 bg-gray-100 text-gray-700 text-[11px] rounded border border-gray-200"
                      >
                        {section}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Tips */}
                <div className="mb-4 flex-1">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                    Tips for Best Results
                  </p>
                  <ul className="space-y-1">
                    {tpl.tips.map((tip, i) => (
                      <li key={i} className="text-xs text-gray-500 pl-3 relative">
                        <span className="absolute left-0 text-green-500">✓</span>
                        {tip.includes("recommended for better results") ? (
                          <span>
                            {tip.split("recommended for better results")[0]}
                            <span className="text-amber-600 font-semibold">recommended for better results</span>
                            {tip.split("recommended for better results")[1]}
                          </span>
                        ) : (
                          tip
                        )}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA Button */}
                <Button
                  size="sm"
                  className="w-full mt-auto"
                  onClick={() => router.push(`/builder?template=${tpl.id}`)}
                >
                  Use This Template →
                </Button>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
