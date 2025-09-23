from pydantic import BaseModel, Field
from typing import List, Dict, Optional
from datetime import datetime

# Input schemas
class TextRequest(BaseModel):
    text: str = Field(..., description="Text to process")

class DocumentAnalysisRequest(BaseModel):
    text: str = Field(..., description="Document text to analyze")
    document_type: Optional[str] = Field(
        default="general", 
        description="Type of document (employment, lease, service, etc.)"
    )

class ChatRequest(BaseModel):
    text: str = Field(..., description="Text to pass to Ollama")

# Output schemas
class Risk(BaseModel):
    level: str = Field(..., description="Risk level: high, medium, low")
    title: str = Field(..., description="Risk title")
    description: str = Field(..., description="Risk description")
    confidence: float = Field(..., ge=0.0, le=1.0, description="Confidence score")
    category: Optional[str] = Field(None, description="Risk category")
    severity_score: Optional[int] = Field(None, description="Severity score 1-10")

class Clause(BaseModel):
    type: str = Field(..., description="Clause type")
    title: str = Field(..., description="Clause title")
    content: str = Field(..., description="Clause content")
    significance: str = Field(..., description="Clause significance level")
    location: Optional[int] = Field(None, description="Position in document")
    key_points: Optional[List[str]] = Field(None, description="Key points in clause")

class KeyTerm(BaseModel):
    term: str = Field(..., description="Legal term")
    definition: str = Field(..., description="Term definition")
    category: str = Field(..., description="Term category")
    context: Optional[str] = Field(None, description="Context where term appears")
    importance: Optional[str] = Field(None, description="Importance level")

class ActionItem(BaseModel):
    id: str = Field(..., description="Unique identifier")
    task: str = Field(..., description="Task description")
    deadline: Optional[str] = Field(None, description="Deadline date")
    priority: str = Field(..., description="Priority level")
    status: str = Field(..., description="Current status")
    description: Optional[str] = Field(None, description="Detailed description")
    assigned_to: Optional[str] = Field(None, description="Who should complete this")

class FinancialItem(BaseModel):
    type: str = Field(..., description="Financial item type")
    description: str = Field(..., description="Item description")
    amount: Optional[str] = Field(None, description="Amount")
    frequency: Optional[str] = Field(None, description="Payment frequency")
    due_date: Optional[str] = Field(None, description="Due date")
    currency: Optional[str] = Field(default="USD", description="Currency")
    is_recurring: Optional[bool] = Field(None, description="Whether payment is recurring")

class ComplianceItem(BaseModel):
    requirement: str = Field(..., description="Compliance requirement")
    status: str = Field(..., description="Compliance status")
    deadline: Optional[str] = Field(None, description="Compliance deadline")
    responsible_party: Optional[str] = Field(None, description="Who is responsible")
    consequences: Optional[str] = Field(None, description="Consequences of non-compliance")

class ComprehensiveAnalysis(BaseModel):
    summary: str = Field(..., description="Document summary")
    risks: List[Risk] = Field(default_factory=list, description="Identified risks")
    clauses: List[Clause] = Field(default_factory=list, description="Important clauses")
    key_terms: List[KeyTerm] = Field(default_factory=list, description="Key legal terms")
    action_items: List[ActionItem] = Field(default_factory=list, description="Required actions")
    financial_impact: List[FinancialItem] = Field(default_factory=list, description="Financial items")
    compliance_items: List[ComplianceItem] = Field(default_factory=list, description="Compliance requirements")
    recommendations: List[str] = Field(default_factory=list, description="Recommendations")
    confidence_score: float = Field(..., ge=0.0, le=1.0, description="Overall confidence")
    analysis_metadata: Optional[Dict] = Field(None, description="Analysis metadata")
    table_count: int = Field(0)
    has_tables: bool = Field(False)
    invoice_tables_detected: int = Field(0)
    has_invoice_tables: bool = Field(False)
    table_summaries: List[str] = []

class EmbedResponse(BaseModel):
    embedding: List[float] = Field(..., description="Text embedding vector")
    model_used: Optional[str] = Field(None, description="Model used for embedding")

class SummaryResponse(BaseModel):
    summary: str = Field(..., description="Generated summary")
    original_length: Optional[int] = Field(None, description="Original text length")
    summary_length: Optional[int] = Field(None, description="Summary length")
    compression_ratio: Optional[float] = Field(None, description="Compression ratio")

class DocumentMetadata(BaseModel):
    document_type: str
    length: int
    estimated_reading_time: Optional[int] = None
    language: Optional[str] = "en"
    complexity_score: Optional[float] = None
    processing_time: Optional[float] = None
    created_at: datetime = Field(default_factory=datetime.now)