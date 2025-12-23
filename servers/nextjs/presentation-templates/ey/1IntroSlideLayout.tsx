import React from "react";
import * as z from "zod";
import { ImageSchema } from "@/presentation-templates/defaultSchemes";

export const layoutId = "intro-pitchdeck-slide";
export const layoutName = "Intro Pitch Deck Slide";
export const layoutDescription =
  "A professional introduction slide for EY style presentations, featuring a bold yellow accent, clear typography, and a clean layout.";

const introPitchDeckSchema = z.object({
  title: z.string().min(2).max(60).default("Building a better working world").meta({
    description: "Main title of the slide, concise and impactful.",
  }),
  description: z.string().min(5).max(100).default("Presentation Subtitle").meta({
    description: "Subtitle or description of the presentation.",
  }),
  contactNumber: z.string().default("+123-456-7890").meta({
    description: "Contact phone number displayed in footer",
  }),
  contactAddress: z
    .string()
    .default("123 Anywhere St., Any City, ST 123")
    .meta({
      description: "Contact address displayed in footer",
    }),
  contactWebsite: z.string().default("ey.com").meta({
    description: "Contact website URL displayed in footer",
  }),
  companyName: z.string().default("EY").meta({
    description: "Company name displayed in header",
  }),
  date: z.string().default("June 13, 2038").meta({
    description: "Date of the presentation",
  }),
  backgroundImage: ImageSchema.optional().meta({
    description: "Optional background image for the slide",
  }),
});

export const Schema = introPitchDeckSchema;
export type IntroPitchDeckData = z.infer<typeof introPitchDeckSchema>;

interface IntroSlideLayoutProps {
  data: Partial<IntroPitchDeckData>;
}

const IntroPitchDeckSlide: React.FC<IntroSlideLayoutProps> = ({
  data: slideData,
}) => {
  const {
    title,
    description,
    contactNumber,
    contactAddress,
    contactWebsite,
    companyName,
    date,
    backgroundImage,
  } = slideData;
  return (
    <>
      {/* Inter Font as a safe professional choice */}
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap"
        rel="stylesheet"
      />
      <div
        className="w-full max-w-[1280px] bg-white aspect-video mx-auto relative overflow-hidden rounded-md"
        style={{
          fontFamily: "Inter, sans-serif",
          backgroundImage: backgroundImage?.__image_url__ ? `url(${backgroundImage.__image_url__})` : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Overlay if background image exists */}
        {backgroundImage?.__image_url__ && (
          <div className="absolute inset-0 bg-white/90" />
        )}

        {/* EY Yellow Beam/Accent */}
        <div className="absolute top-0 left-0 w-full h-2 bg-[#FFE600]" />

        {/* Top Header */}
        <div className="absolute top-12 left-12 right-12 flex justify-between items-start text-[#2E2E38] z-10">
          {/* Logo Placeholder / Company Name */}
          <div className="font-bold text-2xl tracking-tight">
            {companyName}
            <span className="text-[#FFE600] text-3xl leading-none ml-1">.</span>
          </div>
          <div className="text-sm font-medium text-[#747480]">
            {date}
          </div>
        </div>

        {/* Main Content */}
        <div
          className="absolute left-12 right-12 flex flex-col justify-center z-10"
          style={{
            top: "50%",
            transform: "translateY(-50%)",
          }}
        >
          {/* Title */}
          {title && (
            <h1
              className="text-6xl font-bold text-[#2E2E38] leading-tight max-w-4xl mb-6"
              id="pitchdeck-title"
            >
              {title}
            </h1>
          )}
          
          {/* Description/Subtitle */}
          {description && (
            <p className="text-2xl text-[#747480] font-light max-w-3xl">
              {description}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="absolute bottom-12 left-12 right-12 border-t border-gray-200 pt-6 flex justify-between items-center text-sm text-[#747480]">
            <div className="flex gap-8">
                {contactWebsite && <span>{contactWebsite}</span>}
                {contactNumber && <span>{contactNumber}</span>}
            </div>
            <div>
                {contactAddress && <span>{contactAddress}</span>}
            </div>
        </div>
        
        {/* Bottom Right Accent */}
        <div className="absolute bottom-0 right-0 w-16 h-16 bg-[#F6F6FA] -z-10 rounded-tl-full" />
        
        {/* EY Logo Medium */}
        <img 
          src="/readme_assets/images/ey-logo-medium.jpeg" 
          alt="EY Logo" 
          className="absolute bottom-12 right-12 h-12 object-contain"
        />
      </div>
    </>
  );
};

export default IntroPitchDeckSlide;
