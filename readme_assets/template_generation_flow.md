# Template Generation & Filling Flow

This document explains the technical process of how `presenton` uses the presentation templates to generate content using AI.

## 1. Template Discovery & Schema Extraction

1.  **Definition**: Templates are defined in `servers/nextjs/presentation-templates/{style}/*.tsx`.
2.  **Schema**: Each template exports a Zod schema (`export const Schema = ...`).
3.  **Conversion**: When the Python backend requests available layouts, the Next.js server converts these Zod schemas into **JSON Schemas**.
    *   *Crucial*: The `.meta({ description: "..." })` fields in Zod become `description` fields in the JSON Schema. This is how the LLM knows what each field represents.

## 2. Presentation Structure Generation

Before generating content for individual slides, the system decides **which** template to use for each slide.

*   **Input**: User topic (e.g., "The Future of AI").
*   **Process**: The `generate_presentation_structure` function (in Python) sends a prompt to the LLM.
*   **Context**: The prompt includes a list of available layouts, derived from the `layoutName` and `layoutDescription` exports of each template file.
*   **Output**: The LLM returns a list of slides, assigning a specific `layoutId` to each slide based on its intended content (e.g., assigning a "Stats Slide" layout for a slide about market growth).

## 3. Slide Content Generation

Once the structure is defined, the system generates content for each slide individually.

*   **Function**: `get_slide_content_from_type_and_outline` (in `servers/fastapi/utils/llm_calls/generate_slide_content.py`).
*   **Schema Preparation**:
    1.  The system takes the JSON Schema for the selected layout.
    2.  It **removes** `__image_url__` and `__icon_url__` fields (since the LLM cannot generate actual image URLs).
    3.  It **adds** a `__speaker_note__` field to the schema.
*   **LLM Call**: The system calls the LLM (e.g., OpenAI GPT-4) using **Structured Outputs** (JSON Mode).
    *   The `response_format` is set to the modified JSON Schema.
    *   The system prompt instructs the LLM to:
        *   Follow `min` and `max` length constraints strictly.
        *   Generate `__image_prompt__` for images (descriptions of what the image should look like).
        *   Generate `__icon_query__` for icons (keywords to search for).
*   **Result**: The LLM returns a JSON object that perfectly matches the template's data structure, but with prompts instead of URLs.

## 4. Asset Replacement (Post-Processing)

The raw JSON from the LLM is not ready for rendering yet.

1.  **Images**: The system scans the JSON for `__image_prompt__`.
    *   It calls an image provider (Unsplash, DALL-E, etc.) using the prompt.
    *   It populates the `__image_url__` field with the resulting image URL.
2.  **Icons**: The system scans for `__icon_query__`.
    *   It searches an icon library (e.g., Lucide, Noun Project).
    *   It populates the `__icon_query__` field with the SVG or image URL.

## 5. Rendering

1.  **Data Injection**: The fully populated JSON (now containing text + valid URLs) is sent to the Next.js frontend.
2.  **Component**: The specific React component (e.g., `IntroSlideLayout.tsx`) is mounted.
3.  **Props**: The JSON data is passed as the `data` prop.
4.  **Display**: The component renders the text, images, and icons using standard HTML/CSS (Tailwind).

## Why Schema Quality Matters

*   **Descriptions**: If `.meta({ description })` is missing, the LLM has to guess what the field is for, leading to poor content.
*   **Constraints**: If `.min()` / `.max()` are missing, the LLM might generate 500 words for a small text box, breaking the layout.
*   **Defaults**: If `.default()` is missing, the preview in the editor will crash or look empty before generation.
