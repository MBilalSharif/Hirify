"use client";

import React, { useState } from "react";

const SKILL_SUGGESTIONS: Record<string, string[]> = {
  "Programming": [
    "JavaScript", "TypeScript", "Python", "Java", "C++", "C#", "Go",
    "Rust", "Ruby", "PHP", "Swift", "Kotlin",
  ],
  "Frontend": [
    "React", "Next.js", "Vue.js", "Angular", "HTML", "CSS",
    "Tailwind CSS", "Bootstrap", "SASS", "Redux", "jQuery",
  ],
  "Backend": [
    "Node.js", "Express.js", "Django", "Flask", "Spring Boot",
    "ASP.NET", "Ruby on Rails", "FastAPI", "GraphQL", "REST API",
  ],
  "Database": [
    "MySQL", "PostgreSQL", "MongoDB", "Redis", "Firebase",
    "Supabase", "SQLite", "Oracle", "DynamoDB",
  ],
  "DevOps & Cloud": [
    "AWS", "Azure", "Google Cloud", "Docker", "Kubernetes",
    "CI/CD", "Git", "GitHub Actions", "Linux", "Nginx",
  ],
  "Design & Other": [
    "Figma", "Adobe XD", "Photoshop", "UI/UX Design",
    "Agile/Scrum", "Jira", "Machine Learning", "Data Analysis",
    "Power BI", "Tableau", "Excel",
  ],
};

interface SkillsData {
  skills: string[];
  languages: string[];
  certifications: string[];
  bio: string;
}

interface Step4SkillsProps {
  data: SkillsData;
  onChange: (data: SkillsData) => void;
  errors?: Record<string, string>;
}

function TagInput({
  label,
  tags,
  onAdd,
  onRemove,
  placeholder,
  error,
}: {
  label: string;
  tags: string[];
  onAdd: (tag: string) => void;
  onRemove: (index: number) => void;
  placeholder: string;
  error?: string;
}) {
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const tag = inputValue.trim();
      if (tag && !tags.includes(tag)) {
        onAdd(tag);
        setInputValue("");
      }
    }
    if (e.key === "Backspace" && !inputValue && tags.length > 0) {
      onRemove(tags.length - 1);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div
        className={`flex flex-wrap gap-2 p-3 border rounded-lg focus-within:ring-2 focus-within:ring-black focus-within:border-transparent min-h-[44px] ${
          error ? "border-red-500" : "border-gray-300"
        }`}
      >
        {tags.map((tag, index) => (
          <span
            key={index}
            className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded-full"
          >
            {tag}
            <button
              type="button"
              onClick={() => onRemove(index)}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </span>
        ))}
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={tags.length === 0 ? placeholder : "Add more..."}
          className="flex-1 min-w-[120px] outline-none text-sm text-gray-900 placeholder-gray-400 bg-transparent"
        />
      </div>
      <p className="text-xs text-gray-400">Press Enter or comma to add</p>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}

export default function Step4Skills({ data, onChange, errors = {} }: Step4SkillsProps) {
  const [customSkill, setCustomSkill] = useState("");
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const toggleSkill = (skill: string) => {
    if (data.skills.includes(skill)) {
      onChange({ ...data, skills: data.skills.filter((s) => s !== skill) });
    } else {
      onChange({ ...data, skills: [...data.skills, skill] });
    }
  };

  const addCustomSkill = () => {
    const skill = customSkill.trim();
    if (skill && !data.skills.includes(skill)) {
      onChange({ ...data, skills: [...data.skills, skill] });
      setCustomSkill("");
    }
  };

  const handleCustomSkillKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addCustomSkill();
    }
  };

  const removeSkill = (index: number) => {
    onChange({ ...data, skills: data.skills.filter((_, i) => i !== index) });
  };

  const handleAddTag = (field: "languages" | "certifications", tag: string) => {
    onChange({ ...data, [field]: [...data[field], tag] });
  };

  const handleRemoveTag = (field: "languages" | "certifications", index: number) => {
    onChange({ ...data, [field]: data[field].filter((_, i) => i !== index) });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Skills & Extras</h2>
        <p className="mt-1 text-sm text-gray-500">
          Select relevant skills or type your own. Add languages and certifications.
        </p>
      </div>

      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">Skills *</label>

        {data.skills.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {data.skills.map((skill, index) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-black text-white text-sm rounded-full"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => removeSkill(index)}
                  className="text-gray-300 hover:text-white"
                >
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            ))}
          </div>
        )}

        <div className="space-y-2">
          {Object.entries(SKILL_SUGGESTIONS).map(([category, skills]) => (
            <div key={category} className="border border-gray-200 rounded-lg overflow-hidden">
              <button
                type="button"
                onClick={() =>
                  setExpandedCategory(expandedCategory === category ? null : category)
                }
                className="w-full flex items-center justify-between px-4 py-2.5 bg-gray-50 hover:bg-gray-100 transition-colors text-sm font-medium text-gray-700"
              >
                {category}
                <svg
                  className={`w-4 h-4 transition-transform ${
                    expandedCategory === category ? "rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {expandedCategory === category && (
                <div className="flex flex-wrap gap-2 p-3">
                  {skills.map((skill) => {
                    const isSelected = data.skills.includes(skill);
                    return (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => toggleSkill(skill)}
                        className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
                          isSelected
                            ? "bg-black text-white border-black"
                            : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                        }`}
                      >
                        {isSelected ? "\u2713 " : "+ "}{skill}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={customSkill}
            onChange={(e) => setCustomSkill(e.target.value)}
            onKeyDown={handleCustomSkillKeyDown}
            placeholder="Add a custom skill..."
            className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900
              placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
          />
          <button
            type="button"
            onClick={addCustomSkill}
            className="px-4 py-2.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
          >
            Add
          </button>
        </div>
        {errors.skills && <p className="text-sm text-red-600">{errors.skills}</p>}
      </div>

      <TagInput
        label="Languages *"
        tags={data.languages}
        onAdd={(tag) => handleAddTag("languages", tag)}
        onRemove={(index) => handleRemoveTag("languages", index)}
        placeholder="e.g., English, Spanish, French..."
        error={errors.languages}
      />

      <TagInput
        label="Certifications"
        tags={data.certifications}
        onAdd={(tag) => handleAddTag("certifications", tag)}
        onRemove={(index) => handleRemoveTag("certifications", index)}
        placeholder="e.g., AWS Certified, PMP..."
      />

      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">
          Short Bio / Professional Summary *
        </label>
        <textarea
          className={`w-full px-4 py-2.5 border rounded-lg text-gray-900
            placeholder-gray-400 transition-colors duration-200 resize-none
            focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent ${
              errors.bio ? "border-red-500" : "border-gray-300"
            }`}
          rows={4}
          placeholder="A brief summary about yourself and your career goals..."
          value={data.bio}
          onChange={(e) => onChange({ ...data, bio: e.target.value })}
        />
        {errors.bio && <p className="text-sm text-red-600">{errors.bio}</p>}
      </div>
    </div>
  );
}

export function validateStep4(data: SkillsData): Record<string, string> {
  const errors: Record<string, string> = {};
  if (data.skills.length === 0) errors.skills = "Add at least one skill";
  if (data.languages.length === 0) errors.languages = "Add at least one language";
  if (!data.bio.trim()) errors.bio = "Professional summary is required";
  return errors;
}
