// export interface CaseDocument {
//   id: number;
//   name: string;
//   size: string;
//   uploadDate: string;
//   status: "uploading" | "analyzing" | "analyzed";
//   analysisProgress: number;
// }

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


export interface ChatMessage {
  id: number;
  type: "user" | "ai";
  message: string;
  timestamp: string;
}

export interface AnalysisData {
  summary: string;
  risks: Array<{
    level: "high" | "medium" | "low";
    title: string;
    description: string;
  }>;
  clauses: Array<{
    type: string;
    title: string;
    content: string;
    significance: string;
  }>;
  recommendations: string[];
}

// Updated Document interface
export interface CaseDocument {
  id: number;
  serverId?: number; // Add this to store the server-side document ID
  name: string;
  size: string;
  uploadDate: string;
  status: "uploading" | "analyzing" | "analyzed" | "failed";
  analysisProgress: number;
  filePath?: string; // Add this to store the file path for downloads
}

// DTOs to match your Spring Boot backend
export interface DocumentUploadDTO {
  file: File;
  caseId: string | number;
}

export interface DocumentResponseDTO {
  id: number;
  caseId: number;
  fileName: string;
  filePath: string;
  fileSize: number;
  fileType: string;
  downloadUrl: string;
  createdAt: string;
  updatedAt?: string;
}