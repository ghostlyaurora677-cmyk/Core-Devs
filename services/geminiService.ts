import { GoogleGenAI } from "@google/genai";

// Secure helper to fetch API key without crashing
function getSafeApiKey(): string {
  try {
    // Check multiple potential locations
    return (window as any).process?.env?.API_KEY || "";
  } catch (e) {
    return "";
  }
}

export async function explainCode(code: string) {
  const apiKey = getSafeApiKey();
  if (!apiKey) return "AI Insights unavailable (System offline).";

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Briefly explain this code for a Discord bot dev:\n\n${code}`,
    });
    return response.text || "No insights found.";
  } catch (error) {
    return "AI Error occurred.";
  }
}

export async function getAssistantResponse(prompt: string) {
  const apiKey = getSafeApiKey();
  if (!apiKey) return "I am Nexus AI. I'm currently in standalone mode.";

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "I couldn't process that request.";
  } catch (error) {
    return "Nexus AI Connection Error.";
  }
}