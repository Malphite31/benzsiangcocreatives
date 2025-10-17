import { GoogleGenAI } from "@google/genai";

// FIX: Per coding guidelines, the API key must be obtained from process.env.API_KEY.
// The execution environment is assumed to have this variable pre-configured.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export const generateProjectDescription = async (keywords: string): Promise<string> => {
  // FIX: Per coding guidelines, we assume the API key is valid, so no runtime check is needed.
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Based on the following keywords, write a concise and professional project description for a freelance project tracker. The description should be suitable for a textarea in a project management app. Keywords: "${keywords}"`,
    });
    return response.text ?? '';
  } catch (error) {
    console.error("Error generating project description:", error);
    throw new Error("Failed to generate description from AI. Check your API key and network connection.");
  }
};