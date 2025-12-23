import React from "react";
import * as z from "zod";
import { ImageSchema } from "@/presentation-templates/defaultSchemes";

export const layoutId = "toc-ey-slide";
export const layoutName = "Table of Contents Slide";
export const layoutDescription = "A versatile numbered list slide for displaying structured information such as agenda items, process steps, service offerings, product features, project phases, or timeline milestones.";

const tocSchema = z.object({
  title: z.string().min(2).max(50).default("Agenda").meta({
    description: "Title of the slide, usually 'Agenda' or 'Table of Contents'",
  }),
  items: z.array(z.object({
    title: z.string().min(2).max(60).meta({ description: "Section title" }),
    page: z.string().optional().meta({ description: "Page number (optional)" }),
  }))
  .min(3)
  .max(6)
  .default([
    { title: "Executive Summary", page: "03" },
    { title: "Market Analysis", page: "05" },
    { title: "Strategic Plan", page: "12" },
    { title: "Financial Projections", page: "18" },
  ]).meta({
    description: "List of agenda items to display",
  }),
  companyName: z.string().default("EY").meta({
    description: "Company name displayed in header",
  }),
});

export const Schema = tocSchema;
export type TocData = z.infer<typeof tocSchema>;

interface TocSlideProps {
  data: Partial<TocData>;
}

const TocSlide: React.FC<TocSlideProps> = ({ data }) => {
  const { title, items, companyName } = data;

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap"
        rel="stylesheet"
      />
      <div
        className="w-full max-w-[1280px] aspect-video bg-white relative overflow-hidden font-sans mx-auto"
        style={{ fontFamily: "Inter, sans-serif" }}
      >
        {/* Header */}
        <div className="absolute top-0 left-0 w-full h-2 bg-[#FFE600]" />
        <div className="absolute top-12 left-12 text-[#2E2E38] font-bold text-xl">
          {companyName}<span className="text-[#FFE600]">.</span>
        </div>

        {/* Title */}
        <div className="absolute top-32 left-12">
          <h2 className="text-5xl font-bold text-[#2E2E38] mb-2">{title}</h2>
          <div className="w-20 h-1 bg-[#FFE600]" />
        </div>

        {/* Content List */}
        <div className="absolute top-64 left-12 right-12 grid grid-cols-2 gap-x-16 gap-y-8">
          {items?.map((item, index) => (
            <div key={index} className="flex items-baseline border-b border-gray-200 pb-4">
              <span className="text-[#FFE600] font-bold text-2xl mr-4">
                {(index + 1).toString().padStart(2, '0')}
              </span>
              <span className="text-[#2E2E38] text-xl font-medium flex-grow">
                {item.title}
              </span>
              {item.page && (
                <span className="text-[#747480] text-sm ml-4">
                  Page {item.page}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* EY Logo Small - Fixed Position */}
        <img 
          src="/readme_assets/images/ey-logo-small.jpeg" 
          alt="EY Logo" 
          className="absolute bottom-8 right-8 h-8 object-contain"
        />
      </div>
    </>
  );
};

export default TocSlide;
