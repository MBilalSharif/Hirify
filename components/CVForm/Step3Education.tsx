"use client";

import React from "react";
import Input from "../ui/Input";
import Button from "../ui/Button";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const currentYear = new Date().getFullYear();

const YEARS = Array.from({ length: currentYear - 1969 }, (_, i) =>
  String(currentYear - i)
);

interface Education {
  degree: string;
  institution: string;
  startMonth: string;
  startYear: string;
  endMonth: string;
  endYear: string;
  grade: string;
}

interface Step3EducationProps {
  data: Education[];
  onChange: (data: Education[]) => void;
  errors?: Record<string, string>;
}

function MonthYearSelect({
  monthValue,
  yearValue,
  onChangeMonth,
  onChangeYear,
  monthError,
  yearError,
  label,
}: {
  monthValue: string;
  yearValue: string;
  onChangeMonth: (v: string) => void;
  onChangeYear: (v: string) => void;
  monthError?: string;
  yearError?: string;
  label: string;
}) {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">
        {label} *
      </label>
      <div className="flex gap-2">
        <select
          value={monthValue}
          onChange={(e) => onChangeMonth(e.target.value)}
          className={`flex-1 px-3 py-2.5 border rounded-lg text-sm text-gray-900
            focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent
            ${monthError ? "border-red-500" : "border-gray-300"}`}
        >
          <option value="">Month</option>
          {MONTHS.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
        <select
          value={yearValue}
          onChange={(e) => onChangeYear(e.target.value)}
          className={`w-28 px-3 py-2.5 border rounded-lg text-sm text-gray-900
            focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent
            ${yearError ? "border-red-500" : "border-gray-300"}`}
        >
          <option value="">Year</option>
          {YEARS.map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>
      {(monthError || yearError) && (
        <p className="text-sm text-red-600">{monthError || yearError}</p>
      )}
    </div>
  );
}

export default function Step3Education({
  data,
  onChange,
  errors = {},
}: Step3EducationProps) {
  const addEducation = () => {
    onChange([
      ...data,
      { degree: "", institution: "", startMonth: "", startYear: "", endMonth: "", endYear: "", grade: "" },
    ]);
  };

  const removeEducation = (index: number) => {
    if (data.length <= 1) return;
    onChange(data.filter((_, i) => i !== index));
  };

  const updateEducation = (
    index: number,
    field: keyof Education,
    value: string
  ) => {
    const updated = data.map((edu, i) =>
      i === index ? { ...edu, [field]: value } : edu
    );
    onChange(updated);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Education</h2>
        <p className="mt-1 text-sm text-gray-500">
          Add your educational background. Most recent first. All fields are required.
        </p>
        {errors._global && (
          <p className="mt-2 text-sm text-red-600 font-medium">{errors._global}</p>
        )}
      </div>

      {data.map((edu, index) => (
        <div
          key={index}
          className="p-5 bg-gray-50 rounded-xl border border-gray-200 space-y-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-700">
              Education {index + 1}
            </h3>
            {data.length > 1 && (
              <button
                type="button"
                onClick={() => removeEducation(index)}
                className="text-sm text-red-500 hover:text-red-700 transition-colors"
              >
                Remove
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Degree *"
              placeholder="Bachelor of Science in Computer Science"
              value={edu.degree}
              onChange={(e) => updateEducation(index, "degree", e.target.value)}
              error={errors[`${index}.degree`]}
              required
            />
            <Input
              label="Institution *"
              placeholder="MIT"
              value={edu.institution}
              onChange={(e) =>
                updateEducation(index, "institution", e.target.value)
              }
              error={errors[`${index}.institution`]}
              required
            />
            <MonthYearSelect
              label="Start Date"
              monthValue={edu.startMonth}
              yearValue={edu.startYear}
              onChangeMonth={(v) => updateEducation(index, "startMonth", v)}
              onChangeYear={(v) => updateEducation(index, "startYear", v)}
              monthError={errors[`${index}.startMonth`]}
              yearError={errors[`${index}.startYear`]}
            />
            <MonthYearSelect
              label="End Date"
              monthValue={edu.endMonth}
              yearValue={edu.endYear}
              onChangeMonth={(v) => updateEducation(index, "endMonth", v)}
              onChangeYear={(v) => updateEducation(index, "endYear", v)}
              monthError={errors[`${index}.endMonth`]}
              yearError={errors[`${index}.endYear`]}
            />
            <Input
              label="Grade / GPA *"
              placeholder="3.8 / 4.0"
              value={edu.grade}
              onChange={(e) => updateEducation(index, "grade", e.target.value)}
              error={errors[`${index}.grade`]}
              required
            />
          </div>
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        onClick={addEducation}
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
        Add Another Education
      </Button>
    </div>
  );
}

export function validateStep3(
  data: Education[]
): Record<string, string> {
  const errors: Record<string, string> = {};

  if (data.length === 0) {
    errors._global = "At least one education entry is required";
    return errors;
  }

  data.forEach((edu, i) => {
    if (!edu.degree.trim()) errors[`${i}.degree`] = "Degree is required";
    if (!edu.institution.trim()) errors[`${i}.institution`] = "Institution is required";
    if (!edu.startMonth) errors[`${i}.startMonth`] = "Start month is required";
    if (!edu.startYear) errors[`${i}.startYear`] = "Start year is required";
    if (!edu.endMonth) errors[`${i}.endMonth`] = "End month is required";
    if (!edu.endYear) errors[`${i}.endYear`] = "End year is required";
    if (!edu.grade.trim()) errors[`${i}.grade`] = "Grade / GPA is required";
  });

  return errors;
}
