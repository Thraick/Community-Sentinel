import { GoogleGenAI, Type } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY environment variable not set. Gemini features will be disabled.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export const extractTagsFromText = async (text: string): Promise<string[]> => {
    if (!API_KEY) {
        console.log("Gemini API key not available. Skipping tag extraction.");
        return [];
    }

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Extract up to 5 relevant, single-word or two-word tags from the following issue report. Return the tags as a JSON array of strings, with each tag starting with a '#'. For example: ["#pothole", "#safety", "#mainstreet"]. Text: "${text}"`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.STRING
                    }
                },
                temperature: 0.2
            },
        });

        const jsonString = response.text.trim();
        const tags = JSON.parse(jsonString);
        
        if (Array.isArray(tags) && tags.every(t => typeof t === 'string')) {
            return tags.map(tag => tag.startsWith('#') ? tag : `#${tag}`);
        }
        return [];

    } catch (error) {
        console.error("Error extracting tags with Gemini API:", error);
        return [];
    }
};

export const censorText = async (text: string): Promise<string> => {
    if (!API_KEY || !text) {
        return text;
    }
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Review the following text and replace any curse words, profanity, or adult content with '***'. Return only the modified text. Text: "${text}"`,
            config: {
                temperature: 0.0,
            }
        });
        return response.text.trim();
    } catch (error) {
        console.error("Error censoring text with Gemini API:", error);
        return text; // Return original text on error
    }
};