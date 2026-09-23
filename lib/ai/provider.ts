import type { AIProvider, SituationAnalysis } from "./types";

class UnconfiguredAIProvider implements AIProvider {
  async analyze(): Promise<SituationAnalysis> {
    throw new Error("AI provider is not configured");
  }
}
export function getAIProvider(): AIProvider {
  return new UnconfiguredAIProvider();
}
