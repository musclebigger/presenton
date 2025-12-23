import React from "react";
import * as z from "zod";
import { ImageSchema } from "@/presentation-templates/defaultSchemes";

export const layoutId = "thankyou-ey-slide";
export const layoutName = "Thank You Slide";
export const layoutDescription = "Closing slide with contact info.";

const thankYouSchema = z.object({
  title: z.string().min(2).max(30).default("Thank you").meta({ description: "Main closing text" }),
  subtitle: z.string().min(2).max(50).default("Questions?").meta({ description: "Subtitle or call for questions" }),
  email: z.string().email().default("contact@ey.com").meta({ description: "Contact email address" }),
  website: z.string().url().default("ey.com").meta({ description: "Company website URL" }),
});

export const Schema = thankYouSchema;
export type ThankYouData = z.infer<typeof thankYouSchema>;

interface ThankYouSlideProps {
  data: Partial<ThankYouData>;
}

const ThankYouSlide: React.FC<ThankYouSlideProps> = ({ data }) => {
  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap"
        rel="stylesheet"
      />
      <div 
        className="w-full max-w-[1280px] aspect-video bg-[#FFE600] relative overflow-hidden font-sans flex flex-col justify-center items-center text-center mx-auto"
        style={{ fontFamily: "Inter, sans-serif" }}
      >
        
        <div className="max-w-3xl z-10">
          <h1 className="text-7xl font-bold text-[#2E2E38] mb-4">
            {data.title}
          </h1>
          <p className="text-3xl text-[#2E2E38] font-light mb-12">
            {data.subtitle}
          </p>
          
          <div className="flex justify-center gap-8 text-[#2E2E38] font-semibold text-xl border-t border-[#2E2E38] pt-8 inline-block w-full">
            <span>{data.email}</span>
            <span>•</span>
            <span>{data.website}</span>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-white opacity-20 rounded-br-full" />
        <div className="absolute bottom-0 right-0 w-48 h-48 bg-[#2E2E38] opacity-10 rounded-tl-full" />

        {/* EY Logo Small - Fixed Position */}
        <img 
          src="/readme_assets/images/ey-logo-small.jpeg" 
          alt="EY Logo" 
          className="absolute bottom-8 right-8 h-8 object-contain bg-white p-1 rounded-sm z-20"
        />
      </div>
    </>
  );
};

export default ThankYouSlide;
