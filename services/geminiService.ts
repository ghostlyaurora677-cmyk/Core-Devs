
import { GoogleGenAI } from "@google/genai";

function safeGetApiKey(): string {
  try {
    return (window as any).process?.env?.API_KEY || "";
  } catch (e) {
    return "";
  }
}

export async function explainCode(code: string) {
  const apiKey = safeGetApiKey();
  if (!apiKey) return "AI services are unavailable (Missing Key).";

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Explain this briefly:\n\n${code}`,
    });
    return response.text || "No explanation.";
  } catch (error) {
    return "AI Error.";
  }
}

export async function getAssistantResponse(prompt: string) {
  const apiKey = safeGetApiKey();
  if (!apiKey) return "I am currently offline.";

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "No response.";
  } catch (error) {
    return "Error connecting.";
  }
}
