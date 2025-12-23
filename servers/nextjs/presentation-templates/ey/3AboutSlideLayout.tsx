import React from "react";
import * as z from "zod";
import { ImageSchema } from "@/presentation-templates/defaultSchemes";

export const layoutId = "about-ey-slide";
export const layoutName = "About Us Slide";
export const layoutDescription = "A split-layout slide with image and text, ideal for company introductions, case studies, project overviews, vision statements, service descriptions, or any content that benefits from visual storytelling.";

const aboutSchema = z.object({
  title: z.string().min(2).max(50).default("Who We Are").meta({
    description: "Slide title",
  }),
  subtitle: z.string().min(5).max(100).default("Building a better working world").meta({
    description: "Subtitle or tagline",
  }),
  content: z.string().min(20).max(300).default("We are a global leader in assurance, tax, transaction and advisory services. The insights and quality services we deliver help build trust and confidence in the capital markets and in economies the world over.").meta({
    description: "Main body text describing the company or team.",
  }),
  image: ImageSchema.optional().meta({
    description: "A relevant image representing the company or team.",
  }),
});

export const Schema = aboutSchema;
export type AboutData = z.infer<typeof aboutSchema>;

interface AboutSlideProps {
  data: Partial<AboutData>;
}

const AboutSlide: React.FC<AboutSlideProps> = ({ data }) => {
  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap"
        rel="stylesheet"
      />
      <div 
        className="w-full max-w-[1280px] aspect-video bg-white relative overflow-hidden font-sans flex mx-auto"
        style={{ fontFamily: "Inter, sans-serif" }}
      >
        {/* Left Content */}
        <div className="w-1/2 h-full p-12 flex flex-col justify-center relative z-10">
          <div className="absolute top-0 left-0 w-full h-2 bg-[#FFE600]" />
          
          <h2 className="text-5xl font-bold text-[#2E2E38] mb-6 leading-tight">
            {data.title}
          </h2>
          <h3 className="text-xl text-[#FFE600] font-bold mb-8 uppercase tracking-wider">
            {data.subtitle}
          </h3>
          <p className="text-[#747480] text-lg leading-relaxed">
            {data.content}
          </p>
        </div>

        {/* Right Image */}
        <div className="w-1/2 h-full relative">
          {/* Yellow overlay effect */}
          <div className="absolute inset-0 bg-[#FFE600] opacity-10 z-10 mix-blend-multiply" />
          {data.image?.__image_url__ && (
            <img 
              src={data.image.__image_url__} 
              alt={data.image.__image_prompt__ || "About Us"} 
              className="w-full h-full object-cover"
            />
          )}
          {/* Geometric accent */}
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white transform -translate-x-1/2 translate-y-1/2 rotate-45" />
        </div>

        {/* EY Logo Small - Fixed Position */}
        <img 
          src="/readme_assets/images/ey-logo-small.jpeg" 
          alt="EY Logo" 
          className="absolute bottom-8 right-8 h-8 object-contain z-20"
        />
      </div>
    </>
  );
};

export default AboutSlide;
