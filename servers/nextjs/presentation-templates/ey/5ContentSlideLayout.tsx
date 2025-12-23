import React from "react";
import * as z from "zod";
import { ImageSchema } from "@/presentation-templates/defaultSchemes";

export const layoutId = "content-ey-slide";
export const layoutName = "Content & Points Slide";
export const layoutDescription = "Standard content slide with bullet points.";

const contentSchema = z.object({
  title: z.string().min(2).max(60).default("Strategic Priorities").meta({ description: "Slide title" }),
  points: z.array(z.string().min(10).max(150).meta({ description: "A single bullet point" }))
  .min(3)
  .max(6)
  .default([
    "Focus on long-term value creation for all stakeholders",
    "Accelerate technology transformation and digitalization",
    "Empower our people through continuous learning and development",
    "Drive sustainable growth through innovation"
  ]).meta({ description: "List of bullet points to discuss" }),
});

export const Schema = contentSchema;
export type ContentData = z.infer<typeof contentSchema>;

interface ContentSlideProps {
  data: Partial<ContentData>;
}

const ContentSlide: React.FC<ContentSlideProps> = ({ data }) => {
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
        <div className="absolute top-0 left-0 w-full h-2 bg-[#FFE600]" />
        
        <div className="px-16 py-12 h-full flex flex-col">
          <h2 className="text-4xl font-bold text-[#2E2E38] mb-12 border-b border-gray-200 pb-6">
            {data.title}
          </h2>

          <div className="flex-grow">
            <ul className="space-y-6">
              {data.points?.map((point, index) => (
                <li key={index} className="flex items-start">
                  <div className="w-2 h-2 bg-[#FFE600] mt-3 mr-4 flex-shrink-0" />
                  <span className="text-[#2E2E38] text-2xl leading-relaxed">
                    {point}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Bottom watermark */}
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-gray-50 opacity-50 rounded-tl-full -z-10" />

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

export default ContentSlide;
