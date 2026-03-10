"use client";

import React, { useEffect, useState, useRef, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase, CVRecord } from "../../lib/supabase";
import Button from "../../components/ui/Button";
import { useToast } from "../../components/ui/Toast";
import TemplateClassic from "../../components/CVTemplate/TemplateClassic";

function PreviewContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const cvId = searchParams.get("id");
  const { showToast, ToastContainer } = useToast();

  const [cvRecord, setCvRecord] = useState<CVRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const cvRef = useRef<HTMLDivElement>(null);

  const loadCV = useCallback(async () => {
    if (!cvId) {
      router.push("/dashboard");
      return;
    }

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        router.push("/");
        return;
      }

      const { data, error } = await supabase
        .from("cvs")
        .select("*")
        .eq("id", cvId)
        .eq("user_id", session.user.id)
        .single();

      if (error || !data) {
        showToast("CV not found", "error");
        router.push("/dashboard");
        return;
      }

      setCvRecord(data as CVRecord);
    } catch (err) {
      console.error("Error loading CV:", err);
      showToast("Failed to load CV", "error");
    } finally {
      setLoading(false);
    }
  }, [cvId, router, showToast]);

  useEffect(() => {
    loadCV();
  }, [loadCV]);

  const handleDownload = async () => {
    if (!cvRecord) return;

    setDownloading(true);
    try {
      const { default: generatePdf } = await import("react-to-pdf");
      await generatePdf(() => cvRef.current, {
        filename: `${cvRecord.form_data.personal.fullName || "CV"}_Resume.pdf`,
        page: {
          margin: 0,
          format: "A4",
        },
      });
      showToast("PDF downloaded successfully!", "success");
    } catch (err) {
      console.error("PDF generation error:", err);
      showToast("Failed to generate PDF. Please try again.", "error");
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-black rounded-full animate-spin" />
          <p className="text-sm text-gray-500">Loading your CV...</p>
        </div>
      </div>
    );
  }

  if (!cvRecord) return null;

  return (
    <div className="min-h-screen bg-gray-100">
      <ToastContainer />

      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Dashboard
          </button>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push(`/builder?edit=${cvRecord.id}`)}
            >
              <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit
            </Button>

            <Button size="sm" onClick={handleDownload} loading={downloading}>
              <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download PDF
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <div ref={cvRef}>
          <TemplateClassic
            cv={cvRecord.generated_cv}
            personal={cvRecord.form_data.personal}
          />
        </div>
      </div>
    </div>
  );
}

export default function PreviewPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-black rounded-full animate-spin" />
        </div>
      }
    >
      <PreviewContent />
    </Suspense>
  );
}
