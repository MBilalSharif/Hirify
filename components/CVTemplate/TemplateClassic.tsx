"use client";

import React from "react";
import { GeneratedCV } from "../../lib/supabase";

interface TemplateClassicProps {
  cv: GeneratedCV;
  personal: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    linkedinUrl: string;
    portfolioUrl: string;
  };
}

export default function TemplateClassic({ cv, personal }: TemplateClassicProps) {
  return (
    <div
      id="cv-content"
      className="bg-white w-full max-w-[210mm] mx-auto shadow-xl"
      style={{
        fontFamily: "'Georgia', 'Times New Roman', serif",
        color: "#1a1a1a",
        lineHeight: 1.5,
      }}
    >
      <div className="px-10 pt-10 pb-6 border-b-2 border-gray-900">
        <h1
          className="text-3xl font-bold tracking-wide text-center uppercase"
          style={{ letterSpacing: "0.15em" }}
        >
          {personal.fullName}
        </h1>
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 mt-3 text-sm text-gray-600">
          {personal.email && (
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              {personal.email}
            </span>
          )}
          {personal.phone && (
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              {personal.phone}
            </span>
          )}
          {personal.location && (
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {personal.location}
            </span>
          )}
          {personal.linkedinUrl && (
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              LinkedIn
            </span>
          )}
          {personal.portfolioUrl && (
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
              Portfolio
            </span>
          )}
        </div>
      </div>

      <div className="px-10 py-6 space-y-6">
        {cv.summary && (
          <section>
            <h2 className="text-sm font-bold uppercase tracking-widest text-gray-900 border-b border-gray-300 pb-1 mb-3">
              Professional Summary
            </h2>
            <p className="text-sm text-gray-700 leading-relaxed">{cv.summary}</p>
          </section>
        )}

        {cv.experience && cv.experience.length > 0 && (
          <section>
            <h2 className="text-sm font-bold uppercase tracking-widest text-gray-900 border-b border-gray-300 pb-1 mb-3">
              Professional Experience
            </h2>
            <div className="space-y-4">
              {cv.experience.map((exp, index) => (
                <div key={index}>
                  <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-gray-900">
                        {exp.role}
                      </h3>
                      <p className="text-sm text-gray-600 italic">
                        {exp.company}
                      </p>
                    </div>
                    <span className="text-xs text-gray-500 mt-0.5 sm:mt-0 whitespace-nowrap">
                      {exp.duration}
                    </span>
                  </div>
                  {exp.bullets && exp.bullets.length > 0 && (
                    <ul className="mt-1.5 space-y-1">
                      {exp.bullets.map((bullet, bIndex) => (
                        <li
                          key={bIndex}
                          className="text-sm text-gray-700 pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-gray-400"
                        >
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {cv.education && cv.education.length > 0 && (
          <section>
            <h2 className="text-sm font-bold uppercase tracking-widest text-gray-900 border-b border-gray-300 pb-1 mb-3">
              Education
            </h2>
            <div className="space-y-3">
              {cv.education.map((edu, index) => (
                <div
                  key={index}
                  className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between"
                >
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">
                      {edu.degree}
                    </h3>
                    <p className="text-sm text-gray-600 italic">
                      {edu.institution}
                      {edu.grade && ` — ${edu.grade}`}
                    </p>
                  </div>
                  <span className="text-xs text-gray-500 whitespace-nowrap">
                    {edu.year}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {cv.skills && cv.skills.length > 0 && (
          <section>
            <h2 className="text-sm font-bold uppercase tracking-widest text-gray-900 border-b border-gray-300 pb-1 mb-3">
              Skills
            </h2>
            <div className="flex flex-wrap gap-2">
              {cv.skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-2.5 py-0.5 bg-gray-100 text-gray-800 text-xs rounded border border-gray-200"
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>
        )}

        {cv.certifications && cv.certifications.length > 0 && (
          <section>
            <h2 className="text-sm font-bold uppercase tracking-widest text-gray-900 border-b border-gray-300 pb-1 mb-3">
              Certifications
            </h2>
            <ul className="space-y-1">
              {cv.certifications.map((cert, index) => (
                <li
                  key={index}
                  className="text-sm text-gray-700 pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-gray-400"
                >
                  {cert}
                </li>
              ))}
            </ul>
          </section>
        )}

        {cv.projects && cv.projects.length > 0 && (
          <section>
            <h2 className="text-sm font-bold uppercase tracking-widest text-gray-900 border-b border-gray-300 pb-1 mb-3">
              Projects
            </h2>
            <div className="space-y-4">
              {cv.projects.map((project, index) => (
                <div key={index}>
                  <h3 className="text-sm font-bold text-gray-900">
                    {project.title}
                  </h3>
                  <p className="text-sm text-gray-700 mt-1 leading-relaxed">
                    {project.description}
                  </p>
                  {project.techUsed && project.techUsed.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      {project.techUsed.map((tech, tIndex) => (
                        <span
                          key={tIndex}
                          className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded border border-gray-200"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {cv.languages && cv.languages.length > 0 && (
          <section>
            <h2 className="text-sm font-bold uppercase tracking-widest text-gray-900 border-b border-gray-300 pb-1 mb-3">
              Languages
            </h2>
            <p className="text-sm text-gray-700">
              {cv.languages.join(" • ")}
            </p>
          </section>
        )}
      </div>
    </div>
  );
}
