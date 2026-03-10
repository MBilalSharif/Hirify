"use client";

import React, { useState, useRef } from "react";
import Button from "./ui/Button";

interface BreakdownItem {
  score: number;
  feedback: string;
}

interface ATSResult {
  score: number;
  breakdown: {
    contactInfo?: BreakdownItem;
    summary?: BreakdownItem;
    experience?: BreakdownItem;
    education?: BreakdownItem;
    skills?: BreakdownItem;
    formatting?: BreakdownItem;
    keywords?: BreakdownItem;
    completeness?: BreakdownItem;
  };
  strengths: string[];
  improvements: string[];
  missingKeywords: string[];
}

function getScoreLabel(score: number) {
  if (score >= 80) return { text: "Excellent", color: "text-green-600", bg: "bg-green-100", ring: "ring-green-500" };
  if (score >= 70) return { text: "Average", color: "text-yellow-600", bg: "bg-yellow-100", ring: "ring-yellow-500" };
  if (score >= 60) return { text: "Action Needed", color: "text-orange-600", bg: "bg-orange-100", ring: "ring-orange-500" };
  if (score >= 50) return { text: "Urgent Action Needed", color: "text-red-500", bg: "bg-red-100", ring: "ring-red-500" };
  return { text: "Poor", color: "text-red-700", bg: "bg-red-200", ring: "ring-red-700" };
}

function getBarColor(score: number, max: number) {
  const pct = (score / max) * 100;
  if (pct >= 80) return "bg-green-500";
  if (pct >= 60) return "bg-yellow-500";
  if (pct >= 40) return "bg-orange-500";
  return "bg-red-500";
}

const BREAKDOWN_LABELS: { key: string; label: string; max: number }[] = [
  { key: "contactInfo", label: "Contact Information", max: 10 },
  { key: "summary", label: "Professional Summary", max: 10 },
  { key: "experience", label: "Work Experience", max: 20 },
  { key: "education", label: "Education", max: 10 },
  { key: "skills", label: "Skills", max: 15 },
  { key: "formatting", label: "Formatting & Structure", max: 15 },
  { key: "keywords", label: "Industry Keywords", max: 10 },
  { key: "completeness", label: "Completeness", max: 10 },
];

interface ATSCheckerProps {
  onBuildWithUs: () => void;
}

export default function ATSChecker({ onBuildWithUs }: ATSCheckerProps) {
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<ATSResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setError(null);
    setResult(null);
    setAnalyzing(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/ats-check", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Analysis failed");
      }

      const data: ATSResult = await res.json();
      setResult(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to read the file."
      );
    } finally {
      setAnalyzing(false);
    }
  };

  const handlePasteAnalyze = async () => {
    const textarea = document.getElementById(
      "ats-paste-area"
    ) as HTMLTextAreaElement;
    if (!textarea || textarea.value.trim().length < 50) {
      setError("Please paste at least a few lines of your CV text.");
      return;
    }

    setError(null);
    setResult(null);
    setFileName(null);
    setAnalyzing(true);
    await analyzeText(textarea.value);
  };

  const analyzeText = async (text: string) => {
    try {
      const res = await fetch("/api/ats-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Analysis failed");
      }

      const data: ATSResult = await res.json();
      setResult(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to analyze CV."
      );
    } finally {
      setAnalyzing(false);
    }
  };

  const reset = () => {
    setResult(null);
    setError(null);
    setFileName(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const scoreLabel = result ? getScoreLabel(result.score) : null;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-1">
        <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
          <svg
            className="w-5 h-5 text-indigo-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900">ATS Compatibility Check</h3>
          <p className="text-xs text-gray-500">
            Upload your CV to see how well it passes ATS scanners
          </p>
        </div>
      </div>

      {!result && (
        <div className="mt-5 space-y-4">
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-400 transition-colors cursor-pointer"
            onClick={() => fileRef.current?.click()}
          >
            <input
              ref={fileRef}
              type="file"
              accept=".pdf,.txt"
              className="hidden"
              onChange={handleFileUpload}
            />
            <svg
              className="w-10 h-10 text-gray-300 mx-auto mb-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            {fileName ? (
              <p className="text-sm text-indigo-600 font-medium">{fileName}</p>
            ) : (
              <>
                <p className="text-sm font-medium text-gray-700">
                  Click to upload your CV
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Supports PDF and TXT files
                </p>
              </>
            )}
          </div>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400 uppercase font-medium">
              or paste text
            </span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <textarea
            id="ats-paste-area"
            rows={5}
            placeholder="Paste your CV / resume text here..."
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
          />

          <Button
            onClick={handlePasteAnalyze}
            loading={analyzing}
            className="w-full"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Analyze My CV
          </Button>

          {analyzing && (
            <div className="flex items-center justify-center gap-2 text-sm text-indigo-600">
              <div className="w-4 h-4 border-2 border-indigo-300 border-t-indigo-600 rounded-full animate-spin" />
              Analyzing your CV with AI...
            </div>
          )}

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
              {error}
            </p>
          )}
        </div>
      )}

      {result && scoreLabel && (
        <div className="mt-5 space-y-6">
          <div className="flex flex-col items-center">
            <div
              className={`w-28 h-28 rounded-full ring-4 ${scoreLabel.ring} ${scoreLabel.bg} flex flex-col items-center justify-center`}
            >
              <span className={`text-3xl font-bold ${scoreLabel.color}`}>
                {result.score}
              </span>
              <span className="text-xs text-gray-500">/ 100</span>
            </div>
            <span
              className={`mt-3 px-4 py-1 rounded-full text-sm font-bold ${scoreLabel.bg} ${scoreLabel.color}`}
            >
              {scoreLabel.text}
            </span>
          </div>

          <div>
            <h4 className="text-sm font-bold text-gray-900 mb-3">
              Score Breakdown
            </h4>
            <div className="space-y-3">
              {BREAKDOWN_LABELS.map(({ key, label, max }) => {
                const item = result.breakdown[
                  key as keyof typeof result.breakdown
                ] as BreakdownItem | undefined;
                const score = item?.score ?? 0;
                const pct = Math.round((score / max) * 100);
                return (
                  <div key={key}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-gray-700">
                        {label}
                      </span>
                      <span className="text-xs text-gray-500">
                        {score}/{max}
                      </span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${getBarColor(score, max)}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    {item?.feedback && (
                      <p className="text-[11px] text-gray-500 mt-0.5 leading-snug">
                        {item.feedback}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Strengths */}
          {result.strengths.length > 0 && (
            <div>
              <h4 className="text-sm font-bold text-green-700 mb-2 flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Strengths
              </h4>
              <ul className="space-y-1">
                {result.strengths.map((s, i) => (
                  <li
                    key={i}
                    className="text-xs text-gray-700 pl-4 relative before:content-['✓'] before:absolute before:left-0 before:text-green-500 before:font-bold"
                  >
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Improvements */}
          {result.improvements.length > 0 && (
            <div>
              <h4 className="text-sm font-bold text-orange-600 mb-2 flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                Areas for Improvement
              </h4>
              <ul className="space-y-1">
                {result.improvements.map((s, i) => (
                  <li
                    key={i}
                    className="text-xs text-gray-700 pl-4 relative before:content-['!'] before:absolute before:left-0.5 before:text-orange-500 before:font-bold"
                  >
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Missing Keywords */}
          {result.missingKeywords.length > 0 && (
            <div>
              <h4 className="text-sm font-bold text-gray-900 mb-2">
                Missing Keywords
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {result.missingKeywords.map((kw, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 bg-red-50 text-red-600 text-[11px] rounded border border-red-200"
                  >
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* CTA: Build with Us */}
          {result.score < 80 && (
            <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-lg p-4 text-center">
              <p className="text-sm font-semibold text-amber-800 mb-1">
                Want a higher ATS score?
              </p>
              <p className="text-xs text-amber-600 mb-3">
                Build your CV with our premium ATS-optimized templates — designed to score 90+
              </p>
              <Button
                size="sm"
                onClick={onBuildWithUs}
                className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white border-0"
              >
                <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                Build CV with Our Premium Templates →
              </Button>
            </div>
          )}

          {/* Reset */}
          <div className="text-center">
            <button
              onClick={reset}
              className="text-sm text-indigo-600 hover:text-indigo-800 underline transition-colors"
            >
              Check another CV
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
