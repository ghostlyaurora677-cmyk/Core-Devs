
import { GoogleGenAI } from "@google/genai";

/**
 * Fix: Added missing getAssistantResponse function to resolve import error in NexusAssistant.tsx.
 * Follows @google/genai guidelines:
 * - Uses process.env.API_KEY directly.
 * - Uses ai.models.generateContent directly.
 * - Uses 'gemini-3-flash-preview' for general text tasks.
 * - Accesses response.text property directly.
 */
export async function getAssistantResponse(prompt: string) {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: "You are Nexus AI, a professional assistant for the CORE DEVS community hub. You provide expert guidance on Discord bot development, help with the CORE DEVS projects (Fynex, RYZER™), and explain assets in the Vault. Keep responses concise and developer-focused.",
      },
    });
    return response.text || "I couldn't generate a response.";
  } catch (error) {
    console.error("Assistant Error:", error);
    return "AI Error occurred.";
  }
}

/**
 * Fix: Updated explainCode to use process.env.API_KEY directly as per guidelines.
 * Removed legacy getSafeApiKey helper to comply with direct environment variable usage requirement.
 */
export async function explainCode(code: string) {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Briefly explain this code for a Discord bot dev:\n\n${code}`,
    });
    return response.text || "No insights found.";
  } catch (error) {
    console.error("Explain Code Error:", error);
    return "AI Error occurred.";
  }
}
