import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { ApiError } from "./ApiError";

dotenv.config();

if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY environment variable is not set");
}

const genAI = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

interface ArticleContent {
    title: string;
    slug: string;
    content: string;
    metaDescription: string;
    headings: string[];
}

export const generateArticleFromTopic = async (
    topic: string
): Promise<ArticleContent | null> => {
    try {
        const prompt = `
Write a detailed, SEO-optimized blog article about "${topic}".
Include:
- A compelling title (H1)
- Meta description (max 160 characters)
- Proper headings (H2, H3)
- Embedded links to relevant resources
- Informative, engaging tone
- Use Markdown formatting
- Start title with '# '
- Include a line like 'Meta description: ...'
    `;
        const result = await genAI.models.generateContent({
            model: 'gemini-1.5-flash',
            contents: prompt
        });

        const rawText = result.text;

        if (!rawText) {
            console.error("Gemini blog generation failed: No text generated");
            throw new ApiError(500, "Gemini blog generation failed: No text generated");
        }

        // Parse title, meta description, headings
        const titleMatch = rawText.match(/^# (.+)$/m);
        const metaMatch = rawText.match(/Meta description:\s*(.*)/i);
        const headings = Array.from(rawText.matchAll(/^#{2,3} (.+)$/gm)).map((h: any) => h[1]);

        return {
            title: titleMatch?.[1] || topic,
            slug: topic.toLowerCase().replace(/\s+/g, "-"),
            content: rawText.trim(),
            metaDescription: metaMatch?.[1]?.trim() || "",
            headings,
        };
    } catch (error) {
        console.error("Gemini blog generation failed:", error);
        throw new ApiError(500, "Gemini blog generation failed");
    }
};
