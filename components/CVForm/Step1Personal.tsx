"use client";

import React from "react";
import Input from "../ui/Input";

interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedinUrl: string;
  portfolioUrl: string;
}

interface Step1PersonalProps {
  data: PersonalInfo;
  onChange: (data: PersonalInfo) => void;
  errors?: Record<string, string>;
}

export default function Step1Personal({ data, onChange, errors = {} }: Step1PersonalProps) {
  const handleChange = (field: keyof PersonalInfo, value: string) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Personal Information</h2>
        <p className="mt-1 text-sm text-gray-500">
          Let&apos;s start with your basic contact details.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Full Name *"
          placeholder="John Doe"
          value={data.fullName}
          onChange={(e) => handleChange("fullName", e.target.value)}
          error={errors.fullName}
          required
        />
        <Input
          label="Email Address *"
          type="email"
          placeholder="john@example.com"
          value={data.email}
          onChange={(e) => handleChange("email", e.target.value)}
          error={errors.email}
          required
        />
        <Input
          label="Phone Number *"
          type="tel"
          placeholder="+1 (555) 000-0000"
          value={data.phone}
          onChange={(e) => handleChange("phone", e.target.value)}
          error={errors.phone}
          required
        />
        <Input
          label="Location *"
          placeholder="New York, NY"
          value={data.location}
          onChange={(e) => handleChange("location", e.target.value)}
          error={errors.location}
          required
        />
        <Input
          label="LinkedIn URL"
          type="url"
          placeholder="https://linkedin.com/in/johndoe"
          value={data.linkedinUrl}
          onChange={(e) => handleChange("linkedinUrl", e.target.value)}
        />
        <Input
          label="Portfolio URL"
          type="url"
          placeholder="https://johndoe.com"
          value={data.portfolioUrl}
          onChange={(e) => handleChange("portfolioUrl", e.target.value)}
        />
      </div>
    </div>
  );
}

export function validateStep1(data: PersonalInfo): Record<string, string> {
  const errors: Record<string, string> = {};
  if (!data.fullName.trim()) errors.fullName = "Full name is required";
  if (!data.email.trim()) {
    errors.email = "Email address is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
    errors.email = "Enter a valid email address";
  }
  if (!data.phone.trim()) errors.phone = "Phone number is required";
  if (!data.location.trim()) errors.location = "Location is required";
  return errors;
}
