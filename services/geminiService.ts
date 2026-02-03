
/**
 * Service decommissioned per user request to remove Nexus AI logic.
 */
export async function getAssistantResponse(prompt: string) {
  return "AI disabled.";
}

export async function explainCode(code: string) {
  return "Insights disabled.";
}
