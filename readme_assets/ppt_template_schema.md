# Presentation Template Schema Specification

This document outlines the required structure and schema standards for creating presentation templates in the `presenton` project. Following these standards ensures compatibility with the AI generation engine, correct rendering, and successful export to PDF/PPTX.

## 1. File Structure & Metadata

Each slide layout file (e.g., `MySlideLayout.tsx`) must export specific metadata constants used by the system to identify and select the layout.

```typescript
// Required Metadata Exports
export const layoutId = "unique-layout-id"; // Kebab-case unique identifier
export const layoutName = "Human Readable Name"; // Title case name
export const layoutDescription = "A detailed description of what this slide is for. The AI uses this to select the appropriate layout for the user's content.";
```

## 2. Zod Schema Definition

The core of the template is the Zod schema, which defines the data structure the AI needs to generate.

### Requirements:
1.  **Import Zod**: `import * as z from "zod";`
2.  **Export Schema**: Must export a constant named `Schema`.
3.  **Standard Schemas**: Use `ImageSchema` and `IconSchema` from `@/presentation-templates/defaultSchemes` for all media.
4.  **Meta Descriptions**: Every field **must** have a `.meta({ description: "..." })`. This is the prompt for the AI.
5.  **Default Values**: Every field **must** have a `.default(...)` value. This ensures the preview works without AI generation.
6.  **Constraints**: Use `.min()` and `.max()` for strings and arrays to guide the AI on length and quantity.

### Example Schema:

```typescript
import * as z from "zod";
import { ImageSchema, IconSchema } from "@/presentation-templates/defaultSchemes";

const mySlideSchema = z.object({
  // Text Field
  title: z.string()
    .min(5)
    .max(50)
    .default("Default Title")
    .meta({
      description: "The main headline of the slide, concise and impactful.",
    }),

  // Array of Objects
  features: z.array(
    z.object({
      title: z.string().min(2).max(30).meta({ description: "Feature name" }),
      description: z.string().min(10).max(100).meta({ description: "Feature details" }),
      icon: IconSchema.optional().meta({ description: "Visual icon for the feature" }),
    })
  )
  .min(2) // AI must generate at least 2 items
  .max(4) // AI must generate at most 4 items
  .default([
    // Provide a full default object for preview
    { 
      title: "Feature 1", 
      description: "Description 1", 
      icon: { __icon_url__: "/static/icons/placeholder.svg", __icon_query__: "star" } 
    },
    { 
      title: "Feature 2", 
      description: "Description 2", 
      icon: { __icon_url__: "/static/icons/placeholder.svg", __icon_query__: "circle" } 
    }
  ])
  .meta({
    description: "List of key features to display.",
  }),

  // Image Field
  heroImage: ImageSchema.optional().meta({
    description: "A relevant background or hero image for the slide.",
  }),
  
  // Common Fields (Recommended)
  companyName: z.string().default("Company Name").meta({ description: "Company name" }),
  date: z.string().default("Date").meta({ description: "Presentation date" }),
});

export const Schema = mySlideSchema;
export type MySlideData = z.infer<typeof mySlideSchema>;
```

## 3. Component Implementation

The React component renders the data. It must handle the data structure defined in the Schema.

### Requirements:
1.  **Props Interface**: Accept `data` as a partial of the inferred schema type.
2.  **Root Container**:
    *   `w-full`
    *   `max-w-[1280px]`
    *   `aspect-video` (Crucial for 16:9 ratio)
    *   `overflow-hidden`
    *   `relative`
3.  **Fonts**: Import fonts using a `<link>` tag inside the component or use a global font loader.
4.  **Media Rendering**:
    *   **Images**: Access via `data.image.__image_url__`. Use `__image_prompt__` for alt text.
    *   **Icons**: Access via `data.icon.__icon_url__`. Use `__icon_query__` for alt text.
5.  **Safety**: Always check if data exists (e.g., `data?.title`) or rely on Zod defaults if guaranteed.

### Example Component:

```tsx
interface MySlideProps {
  data: Partial<MySlideData>;
}

const MySlideLayout: React.FC<MySlideProps> = ({ data }) => {
  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap"
        rel="stylesheet"
      />
      
      <div
        className="w-full max-w-[1280px] aspect-video bg-white relative overflow-hidden mx-auto"
        style={{ fontFamily: "Inter, sans-serif" }}
      >
        {/* Header */}
        <div className="absolute top-8 left-8">
            {data?.companyName}
        </div>

        {/* Content */}
        <h1 className="text-4xl font-bold mt-20 ml-8">{data?.title}</h1>
        
        {/* Image Handling */}
        {data?.heroImage?.__image_url__ && (
            <img 
                src={data.heroImage.__image_url__} 
                alt={data.heroImage.__image_prompt__}
                className="w-full h-64 object-cover mt-8"
            />
        )}
        
        {/* Icon Handling */}
        <div className="flex gap-4 ml-8 mt-8">
            {data?.features?.map((feature, idx) => (
                <div key={idx}>
                    {feature.icon?.__icon_url__ && (
                        <img src={feature.icon.__icon_url__} className="w-8 h-8" />
                    )}
                    <p>{feature.title}</p>
                </div>
            ))}
        </div>
      </div>
    </>
  );
};

export default MySlideLayout;
```

## 4. Key Differences Checklist (vs. Non-Compliant Templates)

| Feature | Compliant (Standard) | Non-Compliant (e.g., old EY) |
| :--- | :--- | :--- |
| **Image Schema** | Uses `ImageSchema` from `defaultSchemes` | Uses `z.string()` for URLs |
| **Icon Schema** | Uses `IconSchema` from `defaultSchemes` | Uses `z.string()` or missing |
| **Meta Descriptions** | Present on **every** field | Missing or incomplete |
| **Default Values** | Rich, realistic default objects | Empty strings or simple defaults |
| **Constraints** | `.min()` / `.max()` on strings/arrays | Missing constraints |
| **Layout** | Flexible (Flex/Grid) + Absolute where needed | Over-reliance on hardcoded Absolute |

## 5. Export Compatibility Notes

*   **PPTX Export**: The export engine relies on parsing the DOM.
    *   Use standard HTML tags (`h1`, `p`, `img`, `div`).
    *   Avoid complex CSS transformations if possible.
    *   Ensure text contrast is high.
    *   Images must be `<img>` tags, not background images (unless necessary), for better extraction.
