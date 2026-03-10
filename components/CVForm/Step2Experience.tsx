"use client";

import React from "react";
import Input from "../ui/Input";
import Button from "../ui/Button";

interface Experience {
  company: string;
  role: string;
  duration: string;
  description: string;
}

interface Step2ExperienceProps {
  experience: Experience[];
  internships: Experience[];
  isFreshGraduate: boolean;
  onChangeExperience: (data: Experience[]) => void;
  onChangeInternships: (data: Experience[]) => void;
  onChangeFreshGraduate: (value: boolean) => void;
  error?: string; // top-level "pick at least one" error
}

function EntryCard({
  entry,
  index,
  label,
  canRemove,
  onUpdate,
  onRemove,
}: {
  entry: Experience;
  index: number;
  label: string;
  canRemove: boolean;
  onUpdate: (index: number, field: keyof Experience, value: string) => void;
  onRemove: (index: number) => void;
}) {
  return (
    <div className="p-5 bg-gray-50 rounded-xl border border-gray-200 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-700">
          {label} {index + 1}
        </h3>
        {canRemove && (
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="text-sm text-red-500 hover:text-red-700 transition-colors"
          >
            Remove
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Company / Organisation"
          placeholder="Google"
          value={entry.company}
          onChange={(e) => onUpdate(index, "company", e.target.value)}
        />
        <Input
          label="Role / Title"
          placeholder={label === "Internship" ? "Software Engineering Intern" : "Senior Software Engineer"}
          value={entry.role}
          onChange={(e) => onUpdate(index, "role", e.target.value)}
        />
        <Input
          label="Duration"
          placeholder="Jan 2022 - Present"
          value={entry.duration}
          onChange={(e) => onUpdate(index, "duration", e.target.value)}
        />
      </div>

      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900
            placeholder-gray-400 transition-colors duration-200 resize-none
            focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
          rows={3}
          placeholder="Describe your key responsibilities and achievements..."
          value={entry.description}
          onChange={(e) => onUpdate(index, "description", e.target.value)}
        />
      </div>
    </div>
  );
}

export default function Step2Experience({
  experience,
  internships,
  isFreshGraduate,
  onChangeExperience,
  onChangeInternships,
  onChangeFreshGraduate,
  error,
}: Step2ExperienceProps) {
  const addJob = () => {
    onChangeExperience([
      ...experience,
      { company: "", role: "", duration: "", description: "" },
    ]);
  };
  const removeJob = (index: number) => {
    onChangeExperience(experience.filter((_, i) => i !== index));
  };
  const updateJob = (index: number, field: keyof Experience, value: string) => {
    onChangeExperience(
      experience.map((job, i) =>
        i === index ? { ...job, [field]: value } : job
      )
    );
  };

  const addInternship = () => {
    onChangeInternships([
      ...internships,
      { company: "", role: "", duration: "", description: "" },
    ]);
  };
  const removeInternship = (index: number) => {
    onChangeInternships(internships.filter((_, i) => i !== index));
  };
  const updateInternship = (index: number, field: keyof Experience, value: string) => {
    onChangeInternships(
      internships.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    );
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Experience</h2>
        <p className="mt-1 text-sm text-gray-500">
          Add work experience, internships, or mark yourself as a fresh graduate.
          At least one option is required.
        </p>
        {error && (
          <p className="mt-2 text-sm text-red-600 font-medium">{error}</p>
        )}
      </div>

      <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200 cursor-pointer select-none hover:bg-gray-100 transition-colors">
        <input
          type="checkbox"
          checked={isFreshGraduate}
          onChange={(e) => onChangeFreshGraduate(e.target.checked)}
          className="w-5 h-5 rounded border-gray-300 text-black focus:ring-black accent-black"
        />
        <div>
          <span className="text-sm font-semibold text-gray-800">
            I am a Fresh Graduate
          </span>
          <p className="text-xs text-gray-500 mt-0.5">
            No prior full-time work experience
          </p>
        </div>
      </label>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800">
            Work Experience{" "}
            <span className="text-sm font-normal text-gray-400">(optional)</span>
          </h3>
        </div>

        {experience.map((job, index) => (
          <EntryCard
            key={`job-${index}`}
            entry={job}
            index={index}
            label="Job"
            canRemove={true}
            onUpdate={updateJob}
            onRemove={removeJob}
          />
        ))}

        <Button type="button" variant="outline" onClick={addJob} className="w-full">
          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Work Experience
        </Button>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800">
            Internships{" "}
            <span className="text-sm font-normal text-gray-400">(optional)</span>
          </h3>
        </div>

        {internships.map((item, index) => (
          <EntryCard
            key={`intern-${index}`}
            entry={item}
            index={index}
            label="Internship"
            canRemove={true}
            onUpdate={updateInternship}
            onRemove={removeInternship}
          />
        ))}

        <Button type="button" variant="outline" onClick={addInternship} className="w-full">
          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Internship
        </Button>
      </div>
    </div>
  );
}

export function validateStep2(
  experience: Experience[],
  internships: Experience[],
  isFreshGraduate: boolean
): string | null {
  const hasFilledExperience = experience.some(
    (e) => e.company.trim() && e.role.trim()
  );
  const hasFilledInternship = internships.some(
    (e) => e.company.trim() && e.role.trim()
  );

  if (!hasFilledExperience && !hasFilledInternship && !isFreshGraduate) {
    return "Please add at least one work experience, one internship, or select Fresh Graduate.";
  }

  return null;
}
