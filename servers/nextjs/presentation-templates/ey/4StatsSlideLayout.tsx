import React from "react";
import * as z from "zod";
import { ImageSchema } from "@/presentation-templates/defaultSchemes";

export const layoutId = "stats-ey-slide";
export const layoutName = "Key Statistics Slide";
export const layoutDescription = "Display key metrics and numbers.";

const statsSchema = z.object({
  title: z.string().min(2).max(50).default("By the Numbers").meta({ description: "Slide title" }),
  stats: z.array(z.object({
    value: z.string().min(1).max(15).meta({ description: "The number or value (e.g., '280K+')" }),
    label: z.string().min(2).max(30).meta({ description: "Label for the statistic" }),
  }))
  .min(2)
  .max(4)
  .default([
    { value: "280K+", label: "People Globally" },
    { value: "$40B", label: "Annual Revenue" },
    { value: "150+", label: "Countries" },
    { value: "#1", label: "In Customer Satisfaction" },
  ]).meta({ description: "List of key statistics to display" }),
});

export const Schema = statsSchema;
export type StatsData = z.infer<typeof statsSchema>;

interface StatsSlideProps {
  data: Partial<StatsData>;
}

const StatsSlide: React.FC<StatsSlideProps> = ({ data }) => {
  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap"
        rel="stylesheet"
      />
      <div 
        className="w-full max-w-[1280px] aspect-video bg-[#2E2E38] relative overflow-hidden font-sans text-white mx-auto"
        style={{ fontFamily: "Inter, sans-serif" }}
      >
        {/* Header */}
        <div className="absolute top-0 right-0 w-1/3 h-2 bg-[#FFE600]" />
        
        <div className="p-16 h-full flex flex-col">
          <h2 className="text-4xl font-bold mb-16">
            {data.title}
            <span className="text-[#FFE600]">.</span>
          </h2>

          <div className="grid grid-cols-4 gap-8 flex-grow items-center">
            {data.stats?.map((stat, index) => (
              <div key={index} className="text-center border-l border-[#FFE600] pl-6 py-4">
                <div className="text-5xl font-bold text-[#FFE600] mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-300 text-lg font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* EY Logo Small - Fixed Position */}
        <img 
          src="/readme_assets/images/ey-logo-small.jpeg" 
          alt="EY Logo" 
          className="absolute bottom-8 right-8 h-8 object-contain bg-white p-1 rounded-sm"
        />
      </div>
    </>
  );
};

export default StatsSlide;
