export interface Document {
  id: number;
  name: string;
  size: string;
  uploadDate: string;
  status: "uploading" | "analyzing" | "analyzed";
  analysisProgress: number;
}

export interface ChatMessage {
  id: number;
  type: "user" | "ai";
  message: string;
  timestamp: string;
}

export interface Risk {
  level: "high" | "medium" | "low";
  title: string;
  description: string;
}

export interface Clause {
  type: "compensation" | "termination" | "confidentiality" | string;
  title: string;
  content: string;
  significance: string;
}

export interface AnalysisData {
  summary: string;
  risks: Risk[];
  clauses: Clause[];
  recommendations: string[];
}