
import { GoogleGenAI } from "@google/genai";

// Lazy initialization to prevent 'process is not defined' crash on load
function getAIClient() {
  const apiKey = process.env.API_KEY || "";
  if (!apiKey) {
    console.warn("API Key is missing. AI features will be disabled.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
}

export async function explainCode(code: string) {
  try {
    const ai = getAIClient();
    if (!ai) return "AI services are currently unavailable.";

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Explain this code snippet briefly and highlight potential security risks or best practices:\n\n${code}`,
      config: {
        temperature: 0.7,
        maxOutputTokens: 500,
      }
    });
    return response.text || "No explanation generated.";
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return "Failed to get an explanation for this code.";
  }
}

export async function getAssistantResponse(prompt: string) {
  try {
    const ai = getAIClient();
    if (!ai) return "I'm offline right now (API Key missing).";

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: "You are Nexus AI, a helpful assistant for the Core Devs Discord community. You help developers find API keys and explain code. Be friendly, concise, and helpful.",
      }
    });
    return response.text || "I couldn't process that request.";
  } catch (error) {
    console.error("Assistant Error:", error);
    return "I'm having trouble connecting to my brain right now.";
  }
}
