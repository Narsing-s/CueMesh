export type Evidence = { documentId: string; quote: string; page?: number };
export type SituationAnalysis = {
  summary: string;
  confidence: number;
  insights: Array<{ type: string; title: string; detail: string; confidence: number; evidence: Evidence[] }>;
  missingItems: Array<{ label: string; reason: string }>;
  proposedActions: Array<{ title: string; description?: string; evidence: Evidence[] }>;
};
export interface AIProvider {
  analyze(input: { situationTitle: string; documents: Array<{ id: string; name: string; text: string }> }): Promise<SituationAnalysis>;
}
