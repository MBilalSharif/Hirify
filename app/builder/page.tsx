"use client";

import React, { useEffect, useState, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "../../lib/supabase";
import type { FormData as CVFormData } from "../../lib/supabase";
import StepIndicator from "../../components/ui/StepIndicator";
import Button from "../../components/ui/Button";
import { useToast } from "../../components/ui/Toast";
import Step1Personal, { validateStep1 } from "../../components/CVForm/Step1Personal";
import Step2Experience, { validateStep2 } from "../../components/CVForm/Step2Experience";
import Step3Education, { validateStep3 } from "../../components/CVForm/Step3Education";
import Step4Skills, { validateStep4 } from "../../components/CVForm/Step4Skills";
import Step5Projects, { validateStep5 } from "../../components/CVForm/Step5Projects";
import { demoTemplates } from "../../lib/demoTemplates";

const STEP_LABELS = ["Personal", "Experience", "Education", "Skills", "Projects"];

const defaultFormData: CVFormData = {
  personal: {
    fullName: "",
    email: "",
    phone: "",
    location: "",
    linkedinUrl: "",
    portfolioUrl: "",
  },
  experience: [],
  internships: [],
  isFreshGraduate: false,
  education: [{ degree: "", institution: "", startMonth: "", startYear: "", endMonth: "", endYear: "", grade: "" }],
  skills: [],
  languages: [],
  certifications: [],
  projects: [{ title: "", description: "", techUsed: "" }],
  bio: "",
};

function BuilderContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");
  const templateId = searchParams.get("template");
  const { showToast, ToastContainer } = useToast();

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<CVFormData>(defaultFormData);
  const [isGenerating, setIsGenerating] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  // Per-step validation error maps
  const [step1Errors, setStep1Errors] = useState<Record<string, string>>({});
  const [step2Error, setStep2Error] = useState<string | null>(null);
  const [step3Errors, setStep3Errors] = useState<Record<string, string>>({});
  const [step4Errors, setStep4Errors] = useState<Record<string, string>>({});
  const [step5Errors, setStep5Errors] = useState<Record<string, string>>({});

  const init = useCallback(async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      router.push("/");
      return;
    }
    setUserId(session.user.id);

    if (editId) {
      const { data, error } = await supabase
        .from("cvs")
        .select("form_data")
        .eq("id", editId)
        .eq("user_id", session.user.id)
        .single();

      if (data && !error) {
        setFormData(data.form_data as CVFormData);
      }
    } else if (templateId) {
      const tpl = demoTemplates.find((t) => t.id === templateId);
      if (tpl) {
        setFormData(JSON.parse(JSON.stringify(tpl.data)));
      }
    }
  }, [editId, templateId, router]);

  useEffect(() => {
    init();
  }, [init]);

  const nextStep = () => {
    if (currentStep === 1) {
      const errs = validateStep1(formData.personal);
      setStep1Errors(errs);
      if (Object.keys(errs).length > 0) return;
    }
    if (currentStep === 2) {
      const err = validateStep2(formData.experience, formData.internships, formData.isFreshGraduate);
      setStep2Error(err);
      if (err) return;
    }
    if (currentStep === 3) {
      const errs = validateStep3(formData.education);
      setStep3Errors(errs);
      if (Object.keys(errs).length > 0) return;
    }
    if (currentStep === 4) {
      const errs = validateStep4({
        skills: formData.skills,
        languages: formData.languages,
        certifications: formData.certifications,
        bio: formData.bio,
      });
      setStep4Errors(errs);
      if (Object.keys(errs).length > 0) return;
    }
    if (currentStep < 5) setCurrentStep((s) => s + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep((s) => s - 1);
  };

  const handleSubmit = async () => {
    const s1 = validateStep1(formData.personal);
    setStep1Errors(s1);
    if (Object.keys(s1).length > 0) {
      showToast("Please complete all required personal details", "error");
      setCurrentStep(1);
      return;
    }

    const s2 = validateStep2(formData.experience, formData.internships, formData.isFreshGraduate);
    setStep2Error(s2);
    if (s2) {
      showToast(s2, "error");
      setCurrentStep(2);
      return;
    }

    const s3 = validateStep3(formData.education);
    setStep3Errors(s3);
    if (Object.keys(s3).length > 0) {
      showToast("Please complete all required education fields", "error");
      setCurrentStep(3);
      return;
    }

    const s4 = validateStep4({
      skills: formData.skills,
      languages: formData.languages,
      certifications: formData.certifications,
      bio: formData.bio,
    });
    setStep4Errors(s4);
    if (Object.keys(s4).length > 0) {
      showToast("Please complete all required skills fields", "error");
      setCurrentStep(4);
      return;
    }

    const s5 = validateStep5(formData.projects);
    setStep5Errors(s5);
    if (Object.keys(s5).length > 0) {
      showToast("Please complete all required project fields", "error");
      return;
    }

    setIsGenerating(true);

    try {
      // Call the AI generation API
      const response = await fetch("/api/generate-cv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate CV");
      }

      const generatedCV = await response.json();

      if (editId) {
        const { error } = await supabase
          .from("cvs")
          .update({
            form_data: formData,
            generated_cv: generatedCV,
          })
          .eq("id", editId)
          .eq("user_id", userId);

        if (error) throw error;

        showToast("CV updated successfully!", "success");
        router.push(`/preview?id=${editId}`);
      } else {
        const { data, error } = await supabase
          .from("cvs")
          .insert({
            user_id: userId,
            form_data: formData,
            generated_cv: generatedCV,
            is_paid: false,
          })
          .select("id")
          .single();

        if (error) throw error;

        showToast("CV generated successfully!", "success");
        router.push(`/preview?id=${data.id}`);
      }
    } catch (err) {
      console.error("Generation error:", err);
      showToast(
        err instanceof Error ? err.message : "Failed to generate CV",
        "error"
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1Personal
            data={formData.personal}
            onChange={(personal) => {
              setFormData({ ...formData, personal });
              setStep1Errors({});
            }}
            errors={step1Errors}
          />
        );
      case 2:
        return (
          <Step2Experience
            experience={formData.experience}
            internships={formData.internships}
            isFreshGraduate={formData.isFreshGraduate}
            onChangeExperience={(experience) => {
              setFormData({ ...formData, experience });
              setStep2Error(null);
            }}
            onChangeInternships={(internships) => {
              setFormData({ ...formData, internships });
              setStep2Error(null);
            }}
            onChangeFreshGraduate={(isFreshGraduate) => {
              setFormData({ ...formData, isFreshGraduate });
              setStep2Error(null);
            }}
            error={step2Error ?? undefined}
          />
        );
      case 3:
        return (
          <Step3Education
            data={formData.education}
            onChange={(education) => {
              setFormData({ ...formData, education });
              setStep3Errors({});
            }}
            errors={step3Errors}
          />
        );
      case 4:
        return (
          <Step4Skills
            data={{
              skills: formData.skills,
              languages: formData.languages,
              certifications: formData.certifications,
              bio: formData.bio,
            }}
            onChange={(skillsData) => {
              setFormData({
                ...formData,
                skills: skillsData.skills,
                languages: skillsData.languages,
                certifications: skillsData.certifications,
                bio: skillsData.bio,
              });
              setStep4Errors({});
            }}
            errors={step4Errors}
          />
        );
      case 5:
        return (
          <Step5Projects
            data={formData.projects}
            onChange={(projects) => {
              setFormData({ ...formData, projects });
              setStep5Errors({});
            }}
            errors={step5Errors}
          />
        );
      default:
        return null;
    }
  };

  if (isGenerating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="flex justify-center gap-2 mb-6">
            <div className="w-3 h-3 bg-black rounded-full animate-dot-1" />
            <div className="w-3 h-3 bg-black rounded-full animate-dot-2" />
            <div className="w-3 h-3 bg-black rounded-full animate-dot-3" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">
            Generating your CV...
          </h2>
          <p className="text-sm text-gray-500 mt-2">
            Our AI is crafting a professional resume just for you.
            <br />
            This usually takes 10-15 seconds.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer />

      <header className="bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Dashboard
          </button>
          <h1 className="text-lg font-bold">
            {editId ? "Edit CV" : "Build New CV"}
          </h1>
          <div className="w-20" />
        </div>
      </header>

      {/* Form Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        <StepIndicator
          currentStep={currentStep}
          totalSteps={5}
          labels={STEP_LABELS}
        />

        <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 mt-8">
          {renderStep()}
        </div>

        <div className="flex items-center justify-between mt-6">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
          >
            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Previous
          </Button>

          {currentStep < 5 ? (
            <Button onClick={nextStep}>
              Next
              <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Button>
          ) : (
            <Button onClick={handleSubmit} loading={isGenerating}>
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Generate CV with AI
            </Button>
          )}
        </div>
      </main>
    </div>
  );
}

export default function BuilderPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-black rounded-full animate-spin" />
        </div>
      }
    >
      <BuilderContent />
    </Suspense>
  );
}
