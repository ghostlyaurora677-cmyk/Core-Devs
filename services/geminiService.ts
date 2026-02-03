
import { GoogleGenAI } from "@google/genai";

// Always initialize the GoogleGenAI client with the API key from environment variables.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Service providing AI assistant responses for the Nexus AI component.
 */
export async function getAssistantResponse(prompt: string) {
  try {
    // Use gemini-3-flash-preview for basic text tasks like general Q&A.
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: "You are Nexus AI, a highly intelligent and professional assistant for the CORE DEVS developer hub. You specialize in Discord infrastructure, bot development (discord.js), and cloud systems. Be concise, technical, and helpful.",
      }
    });
    
    // Use .text property to extract output string.
    return response.text || "I apologize, but I am unable to process that query at the moment.";
  } catch (error) {
    console.error("Nexus AI Error:", error);
    return "Connection to the core AI kernel was interrupted. Please check your network or try again later.";
  }
}

/**
 * Service for providing technical insights and explanations for code snippets.
 */
export async function explainCode(code: string) {
  try {
    // Use gemini-3-pro-preview for complex reasoning tasks like code explanation.
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Please provide a deep-dive technical explanation for the following code snippet:\n\n${code}`,
    });
    
    return response.text || "Insights could not be generated for this specific signature.";
  } catch (error) {
    console.error("Code Analysis Error:", error);
    return "Analyzing infrastructure patterns currently unavailable.";
  }
}
