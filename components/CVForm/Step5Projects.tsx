"use client";

import React from "react";
import Input from "../ui/Input";
import Button from "../ui/Button";

interface Project {
  title: string;
  description: string;
  techUsed: string;
}

interface Step5ProjectsProps {
  data: Project[];
  onChange: (data: Project[]) => void;
  errors?: Record<string, string>;
}

export default function Step5Projects({
  data,
  onChange,
  errors = {},
}: Step5ProjectsProps) {
  const addProject = () => {
    onChange([...data, { title: "", description: "", techUsed: "" }]);
  };

  const removeProject = (index: number) => {
    if (data.length <= 1) return;
    onChange(data.filter((_, i) => i !== index));
  };

  const updateProject = (
    index: number,
    field: keyof Project,
    value: string
  ) => {
    const updated = data.map((proj, i) =>
      i === index ? { ...proj, [field]: value } : proj
    );
    onChange(updated);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Projects</h2>
        <p className="mt-1 text-sm text-gray-500">
          Showcase your best projects. Add the title, a brief description, and
          the technologies you used.
        </p>
        {errors._global && (
          <p className="mt-2 text-sm text-red-600 font-medium">
            {errors._global}
          </p>
        )}
      </div>

      {data.map((proj, index) => (
        <div
          key={index}
          className="p-5 bg-gray-50 rounded-xl border border-gray-200 space-y-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-700">
              Project {index + 1}
            </h3>
            {data.length > 1 && (
              <button
                type="button"
                onClick={() => removeProject(index)}
                className="text-sm text-red-500 hover:text-red-700 transition-colors"
              >
                Remove
              </button>
            )}
          </div>

          <Input
            label="Project Title *"
            placeholder="e.g., AI CV Builder"
            value={proj.title}
            onChange={(e) => updateProject(index, "title", e.target.value)}
            error={errors[`${index}.title`]}
            required
          />

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Description *
            </label>
            <textarea
              className={`w-full px-4 py-2.5 border rounded-lg text-gray-900
                placeholder-gray-400 transition-colors duration-200 resize-none
                focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent ${
                  errors[`${index}.description`]
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              rows={3}
              placeholder="Briefly describe what the project does and your role..."
              value={proj.description}
              onChange={(e) =>
                updateProject(index, "description", e.target.value)
              }
            />
            {errors[`${index}.description`] && (
              <p className="text-sm text-red-600">
                {errors[`${index}.description`]}
              </p>
            )}
          </div>

          <Input
            label="Technologies Used *"
            placeholder="e.g., React, Node.js, PostgreSQL, Docker"
            value={proj.techUsed}
            onChange={(e) => updateProject(index, "techUsed", e.target.value)}
            error={errors[`${index}.techUsed`]}
            required
          />
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        onClick={addProject}
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
            d="M12 4v16m8-8H4"
          />
        </svg>
        Add Another Project
      </Button>
    </div>
  );
}

export function validateStep5(
  data: Project[]
): Record<string, string> {
  const errors: Record<string, string> = {};

  if (data.length === 0) {
    errors._global = "At least one project is required";
    return errors;
  }

  data.forEach((proj, i) => {
    if (!proj.title.trim())
      errors[`${i}.title`] = "Project title is required";
    if (!proj.description.trim())
      errors[`${i}.description`] = "Project description is required";
    if (!proj.techUsed.trim())
      errors[`${i}.techUsed`] = "Technologies used is required";
  });

  return errors;
}
