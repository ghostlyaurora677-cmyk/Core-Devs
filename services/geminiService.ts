
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function explainCode(code: string) {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Explain this code snippet briefly and highlight potential security risks or best practices:\n\n${code}`,
      config: {
        temperature: 0.7,
        maxOutputTokens: 500,
      }
    });
    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return "Failed to get an explanation for this code.";
  }
}

export async function getAssistantResponse(prompt: string) {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: "You are Nexus AI, a helpful assistant for the Nexus Discord community. You help developers find API keys and explain code snippets. Be friendly and direct.",
      }
    });
    return response.text;
  } catch (error) {
    return "I'm having trouble connecting to my brain right now.";
  }
}
