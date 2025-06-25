from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from transformers import pipeline, AutoTokenizer, AutoModelForSequenceClassification
from sentence_transformers import SentenceTransformer
import torch
import re
import spacy
from datetime import datetime, timedelta
from typing import List, Dict, Optional
import json
from collections import defaultdict

app = FastAPI()

# Load models once at startup
print("Loading models...")
embedder = SentenceTransformer('sentence-transformers/all-mpnet-base-v2')
summarizer = pipeline("summarization", model="facebook/bart-large-cnn")

# Load NER model for extracting entities
nlp = spacy.load("en_core_web_sm")

# Load classification model for risk assessment
risk_classifier = pipeline(
    "text-classification",
    model="microsoft/DialoGPT-medium",  # You can replace with a legal-specific model
    return_all_scores=True
)

# Legal terms dictionary (you can expand this)
LEGAL_TERMS = {
    "at-will employment": "Employment that can be terminated by either party at any time without cause",
    "non-disclosure agreement": "Agreement to keep confidential information secret",
    "force majeure": "Unforeseeable circumstances that prevent fulfillment of contract",
    "indemnification": "Security or protection against legal responsibility for damages",
    "liquidated damages": "Predetermined amount of damages specified in contract",
    "intellectual property": "Creations of the mind such as inventions, designs, and artistic works",
    "non-compete clause": "Agreement not to work for competitors for specified period",
    "severability": "If one part of contract is invalid, the rest remains enforceable",
    "governing law": "Which state or country's laws will be used to interpret the contract",
    "arbitration": "Alternative dispute resolution outside of court system"
}

# Input schemas
class TextRequest(BaseModel):
    text: str

class DocumentAnalysisRequest(BaseModel):
    text: str
    document_type: Optional[str] = "general"  # employment, lease, service, etc.

# Output schemas
class Risk(BaseModel):
    level: str
    title: str
    description: str
    confidence: float

class Clause(BaseModel):
    type: str
    title: str
    content: str
    significance: str
    location: Optional[int] = None

class KeyTerm(BaseModel):
    term: str
    definition: str
    category: str
    context: Optional[str] = None

class ActionItem(BaseModel):
    id: str
    task: str
    deadline: Optional[str] = None
    priority: str
    status: str
    description: Optional[str] = None

class FinancialItem(BaseModel):
    type: str
    description: str
    amount: Optional[str] = None
    frequency: Optional[str] = None
    due_date: Optional[str] = None

class ComprehensiveAnalysis(BaseModel):
    summary: str
    risks: List[Risk]
    clauses: List[Clause]
    key_terms: List[KeyTerm]
    action_items: List[ActionItem]
    financial_impact: List[FinancialItem]
    recommendations: List[str]
    confidence_score: float

class EmbedResponse(BaseModel):
    embedding: List[float]

class SummaryResponse(BaseModel):
    summary: str

# Helper functions
def extract_financial_information(text: str) -> List[FinancialItem]:
    """Extract financial information using regex patterns"""
    financial_items = []
    
    # Patterns for different financial elements
    salary_pattern = r'\$[\d,]+(?:\.\d{2})?\s*(?:per|/)\s*(?:year|month|hour|annum)'
    fee_pattern = r'(?:fee|cost|charge|penalty).*?\$[\d,]+(?:\.\d{2})?'
    percentage_pattern = r'\d+(?:\.\d+)?%'
    
    # Extract salary information
    salary_matches = re.finditer(salary_pattern, text, re.IGNORECASE)
    for match in salary_matches:
        amount = re.search(r'\$[\d,]+(?:\.\d{2})?', match.group())
        frequency = "annually" if "year" in match.group().lower() or "annum" in match.group().lower() else "monthly"
        
        financial_items.append(FinancialItem(
            type="salary",
            description="Base compensation",
            amount=amount.group() if amount else None,
            frequency=frequency
        ))
    
    # Extract fees and costs
    fee_matches = re.finditer(fee_pattern, text, re.IGNORECASE)
    for match in fee_matches:
        amount = re.search(r'\$[\d,]+(?:\.\d{2})?', match.group())
        fee_type = "fee" if "fee" in match.group().lower() else "cost"
        
        financial_items.append(FinancialItem(
            type=fee_type,
            description=match.group().strip(),
            amount=amount.group() if amount else None,
            frequency="one-time"
        ))
    
    return financial_items

def extract_dates(text: str) -> List[str]:
    """Extract dates from text"""
    # Pattern for various date formats
    date_patterns = [
        r'\d{1,2}/\d{1,2}/\d{4}',
        r'\d{1,2}-\d{1,2}-\d{4}',
        r'(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},?\s+\d{4}',
        r'\d{1,2}\s+(?:days?|weeks?|months?|years?)',
        r'within\s+\d+\s+(?:days?|weeks?|months?)'
    ]
    
    dates = []
    for pattern in date_patterns:
        matches = re.finditer(pattern, text, re.IGNORECASE)
        for match in matches:
            dates.append(match.group())
    
    return dates

def identify_risks(text: str) -> List[Risk]:
    """Identify potential risks in the document"""
    risks = []
    
    # Define risk patterns and their severity
    risk_patterns = {
        "high": [
            (r"non-compete.*?(?:\d+)\s*(?:months?|years?)", "Broad non-compete clause may limit future employment"),
            (r"liquidated damages.*?\$[\d,]+", "High penalty amounts specified for contract breach"),
            (r"personal guarantee", "Personal assets may be at risk"),
            (r"unlimited liability", "No cap on potential financial responsibility"),
        ],
        "medium": [
            (r"intellectual property.*?assign", "Broad intellectual property assignment"),
            (r"automatic renewal", "Contract may auto-renew without notice"),
            (r"indemnif", "Indemnification clauses may create liability"),
            (r"confidential.*?perpetual", "Perpetual confidentiality obligations"),
        ],
        "low": [
            (r"governing law", "Contract governed by specific jurisdiction"),
            (r"dispute.*?arbitration", "Disputes must be resolved through arbitration"),
            (r"notice.*?\d+\s*days", "Notice period required for termination"),
        ]
    }
    
    for level, patterns in risk_patterns.items():
        for pattern, description in patterns:
            matches = re.finditer(pattern, text, re.IGNORECASE)
            for match in matches:
                risks.append(Risk(
                    level=level,
                    title=f"Risk: {match.group()[:50]}...",
                    description=description,
                    confidence=0.8 if level == "high" else 0.6
                ))
    
    return risks

def extract_clauses(text: str) -> List[Clause]:
    """Extract and categorize important clauses"""
    clauses = []
    
    # Define clause patterns
    clause_patterns = {
        "compensation": [
            r"salary.*?\$[\d,]+",
            r"compensation.*?\$[\d,]+",
            r"wage.*?\$[\d,]+"
        ],
        "termination": [
            r"termination.*?(?:notice|days|weeks)",
            r"end.*?(?:employment|agreement|contract)"
        ],
        "confidentiality": [
            r"confidential.*?information",
            r"non-disclosure",
            r"proprietary.*?information"
        ],
        "intellectual-property": [
            r"intellectual property",
            r"inventions.*?assign",
            r"work product.*?belong"
        ],
        "non-compete": [
            r"non-compete",
            r"restraint.*?trade",
            r"competition.*?prohibit"
        ]
    }
    
    for clause_type, patterns in clause_patterns.items():
        for pattern in patterns:
            matches = re.finditer(pattern, text, re.IGNORECASE)
            for match in matches:
                # Extract surrounding context (±100 characters)
                start = max(0, match.start() - 100)
                end = min(len(text), match.end() + 100)
                context = text[start:end].strip()
                
                clauses.append(Clause(
                    type=clause_type,
                    title=f"{clause_type.replace('-', ' ').title()} Clause",
                    content=context,
                    significance="Standard clause" if clause_type in ["compensation", "termination"] else "Important clause",
                    location=match.start()
                ))
    
    return clauses

def extract_key_terms(text: str) -> List[KeyTerm]:
    """Extract and define key legal terms"""
    key_terms = []
    
    for term, definition in LEGAL_TERMS.items():
        if term.lower() in text.lower():
            # Find context around the term
            pattern = re.escape(term)
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                start = max(0, match.start() - 50)
                end = min(len(text), match.end() + 50)
                context = text[start:end].strip()
                
                # Categorize terms
                category = "legal"
                if any(word in term.lower() for word in ["salary", "compensation", "fee", "cost", "payment"]):
                    category = "financial"
                elif any(word in term.lower() for word in ["employment", "work", "job", "position"]):
                    category = "operational"
                
                key_terms.append(KeyTerm(
                    term=term.title(),
                    definition=definition,
                    category=category,
                    context=context
                ))
    
    return key_terms

def generate_action_items(text: str, document_type: str = "general") -> List[ActionItem]:
    """Generate action items based on document content"""
    action_items = []
    
    # Common action items based on document type
    if document_type.lower() == "employment":
        action_items.extend([
            ActionItem(
                id="emp_1",
                task="Review and sign employment contract",
                deadline=(datetime.now() + timedelta(days=7)).isoformat(),
                priority="high",
                status="pending",
                description="Carefully review all terms before signing"
            ),
            ActionItem(
                id="emp_2",
                task="Set up direct deposit",
                deadline=(datetime.now() + timedelta(days=14)).isoformat(),
                priority="medium",
                status="pending",
                description="Provide banking information to HR"
            )
        ])
    
    # Extract deadline-related action items from text
    deadline_patterns = [
        r"(?:must|shall|required).*?(?:within|by)\s*(\d+)\s*(days?|weeks?|months?)",
        r"deadline.*?(\d+)\s*(days?|weeks?|months?)",
        r"(?:submit|provide|deliver).*?(?:within|by)\s*(\d+)\s*(days?|weeks?|months?)"
    ]
    
    for pattern in deadline_patterns:
        matches = re.finditer(pattern, text, re.IGNORECASE)
        for i, match in enumerate(matches):
            days = int(match.group(1))
            unit = match.group(2).lower()
            
            if "week" in unit:
                days *= 7
            elif "month" in unit:
                days *= 30
            
            deadline = (datetime.now() + timedelta(days=days)).isoformat()
            
            action_items.append(ActionItem(
                id=f"auto_{i+1}",
                task=f"Complete requirement: {match.group()[:50]}...",
                deadline=deadline,
                priority="medium",
                status="pending",
                description=f"Action item extracted from document: {match.group()}"
            ))
    
    return action_items

def generate_recommendations(risks: List[Risk], clauses: List[Clause]) -> List[str]:
    """Generate recommendations based on identified risks and clauses"""
    recommendations = []
    
    # Risk-based recommendations
    high_risks = [r for r in risks if r.level == "high"]
    if high_risks:
        recommendations.append("Consider consulting with a legal professional due to high-risk clauses identified")
    
    # Clause-based recommendations
    clause_types = {c.type for c in clauses}
    
    if "non-compete" in clause_types:
        recommendations.append("Negotiate non-compete terms to reduce scope or duration")
    
    if "intellectual-property" in clause_types:
        recommendations.append("Clarify intellectual property rights for personal projects")
    
    if "compensation" in clause_types:
        recommendations.append("Verify all compensation details including benefits and bonuses")
    
    # General recommendations
    recommendations.extend([
        "Keep copies of all signed documents",
        "Note all important deadlines in your calendar",
        "Ask questions about any unclear terms before signing"
    ])
    
    return recommendations

def debug_text_analysis(text: str, document_type: str = "general"):
    """Debug function to understand why analysis is returning empty results"""
    print(f"=== DEBUG ANALYSIS ===")
    print(f"Document type: {document_type}")
    print(f"Text length: {len(text)}")
    print(f"Text preview: {text[:200]}...")
    
    # Check for basic patterns
    import re
    
    # Financial patterns
    dollar_matches = re.findall(r'\$[\d,]+(?:\.\d{2})?', text)
    print(f"Dollar amounts found: {dollar_matches}")
    
    # Date patterns
    date_matches = re.findall(r'\d{1,2}/\d{1,2}/\d{4}', text)
    print(f"Dates found: {date_matches}")
    
    # Common legal terms
    legal_terms_found = []
    for term in LEGAL_TERMS.keys():
        if term.lower() in text.lower():
            legal_terms_found.append(term)
    print(f"Legal terms found: {legal_terms_found}")
    
    # Risk patterns
    risk_indicators = ['penalty', 'fine', 'breach', 'default', 'liability', 'damages']
    found_risks = [term for term in risk_indicators if term in text.lower()]
    print(f"Risk indicators found: {found_risks}")
    
    print(f"=== END DEBUG ===")

def improved_identify_risks(text: str) -> List[Risk]:
    """Improved risk identification with more patterns"""
    risks = []
    
    # More comprehensive risk patterns
    risk_patterns = {
        "high": [
            (r"penalty.*?\$[\d,]+", "Monetary penalty specified"),
            (r"default.*?interest", "Default interest charges"),
            (r"personal.*?guarantee", "Personal guarantee required"), 
            (r"unlimited.*?liability", "Unlimited liability exposure"),
            (r"termination.*?cause", "At-will termination clause"),
            (r"breach.*?damages", "Breach of contract damages"),
        ],
        "medium": [
            (r"late.*?fee", "Late payment fees apply"),
            (r"interest.*?rate", "Interest rate specified"),
            (r"notice.*?period", "Notice period requirements"),
            (r"renewal.*?automatic", "Automatic renewal clause"),
            (r"confidential", "Confidentiality obligations"),
            (r"non-compete", "Non-compete restrictions"),
        ],
        "low": [
            (r"payment.*?due", "Payment terms specified"),
            (r"delivery.*?date", "Delivery deadlines"),
            (r"contact.*?information", "Contact requirements"),
            (r"jurisdiction", "Legal jurisdiction specified"),
        ]
    }
    
    for level, patterns in risk_patterns.items():
        for pattern, description in patterns:
            matches = re.finditer(pattern, text, re.IGNORECASE)
            for match in matches:
                # Get surrounding context
                start = max(0, match.start() - 50)
                end = min(len(text), match.end() + 50)
                context = text[start:end].strip()
                
                risks.append(Risk(
                    level=level,
                    title=f"{description}",
                    description=f"Found: {match.group()} - Context: {context}",
                    confidence=0.9 if level == "high" else 0.7 if level == "medium" else 0.5
                ))
    
    return risks

def improved_extract_financial_information(text: str) -> List[FinancialItem]:
    """Improved financial extraction with more patterns"""
    financial_items = []
    
    # Enhanced patterns
    patterns = [
        # Dollar amounts with context
        (r'(?:amount due|balance|total|fee|cost|charge|payment).*?\$?([\d,]+\.?\d*)', 'fee'),
        (r'\$?([\d,]+\.?\d*).*?(?:due|owed|balance|outstanding)', 'balance'),
        (r'(?:late|penalty|fine).*?\$?([\d,]+\.?\d*)', 'penalty'),
        (r'(?:interest|rate).*?(\d+\.?\d*)%', 'interest'),
        # Date-based amounts
        (r'\$?([\d,]+\.?\d*).*?(?:monthly|per month)', 'monthly_payment'),
        (r'\$?([\d,]+\.?\d*).*?(?:annually|per year)', 'annual_payment'),
    ]
    
    for pattern, item_type in patterns:
        matches = re.finditer(pattern, text, re.IGNORECASE)
        for match in matches:
            amount_str = match.group(1) if match.groups() else match.group()
            
            # Clean amount string
            amount_clean = re.sub(r'[^\d.]', '', amount_str)
            if amount_clean:
                financial_items.append(FinancialItem(
                    type=item_type,
                    description=match.group(),
                    amount=f"${amount_clean}",
                    frequency="one-time" if "monthly" not in item_type and "annual" not in item_type else item_type.split('_')[0]
                ))
    
    return financial_items

def improved_extract_clauses(text: str) -> List[Clause]:
    """Improved clause extraction"""
    clauses = []
    
    # Enhanced clause patterns with better context extraction
    clause_patterns = {
        "payment": [
            r"payment.*?(?:due|required|shall)",
            r"amount.*?due.*?\$[\d,]+",
            r"fee.*?\$[\d,]+",
        ],
        "penalty": [
            r"late.*?(?:fee|charge|penalty)",
            r"penalty.*?(?:amount|fee)",
            r"default.*?interest",
        ],
        "termination": [
            r"termination.*?(?:notice|period|cause)",
            r"end.*?(?:agreement|contract)",
            r"cancel.*?(?:contract|agreement)",
        ],
        "financial": [
            r"interest.*?rate.*?\d+",
            r"balance.*?\$[\d,]+",
            r"total.*?amount.*?\$[\d,]+",
        ]
    }
    
    for clause_type, patterns in clause_patterns.items():
        for pattern in patterns:
            matches = re.finditer(pattern, text, re.IGNORECASE)
            for match in matches:
                # Extract larger context (±200 characters)
                start = max(0, match.start() - 200)
                end = min(len(text), match.end() + 200)
                context = text[start:end].strip()
                
                clauses.append(Clause(
                    type=clause_type,
                    title=f"{clause_type.title()} Clause",
                    content=context,
                    significance="Important" if clause_type in ["penalty", "termination"] else "Standard",
                    location=match.start()
                ))
    
    return clauses

# API Endpoints
@app.post("/embed", response_model=EmbedResponse)
async def embed_text(request: TextRequest):
    text = request.text.strip()
    if not text:
        raise HTTPException(status_code=400, detail="Text is empty.")

    embedding = embedder.encode(text).tolist()
    return EmbedResponse(embedding=embedding)

@app.post("/summarize", response_model=SummaryResponse)
async def summarize_text(request: TextRequest):
    text = request.text.strip()
    if not text:
        raise HTTPException(status_code=400, detail="Text is empty.")

    try:
        # Handle long documents by chunking
        max_length = min(len(text.split()), 1000)  # Limit input length
        if max_length < 50:
            raise HTTPException(status_code=400, detail="Text too short for summarization.")
        
        summary_list = summarizer(text, max_length=300, min_length=50, do_sample=False)
        summary_text = summary_list[0]['summary_text']
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Summarization failed: {str(e)}")

    return SummaryResponse(summary=summary_text)

@app.post("/analyze", response_model=ComprehensiveAnalysis)
async def analyze_document(request: DocumentAnalysisRequest):
    text = request.text.strip()
    if not text:
        raise HTTPException(status_code=400, detail="Text is empty.")
    
    try:
        # Add debugging
        debug_text_analysis(text, request.document_type)
        
        # Generate summary
        summary_result = summarizer(text, max_length=300, min_length=50, do_sample=False)
        summary = summary_result[0]['summary_text']
        
        # Use improved extraction functions
        risks = improved_identify_risks(text)
        clauses = improved_extract_clauses(text)
        key_terms = extract_key_terms(text)
        action_items = generate_action_items(text, request.document_type)
        financial_impact = improved_extract_financial_information(text)
        recommendations = generate_recommendations(risks, clauses)
        
        # Improved confidence calculation
        feature_count = len(risks) + len(clauses) + len(key_terms) + len(financial_impact)
        confidence_score = min(1.0, max(0.1, feature_count / 15))  # More realistic confidence
        
        print(f"Analysis results: {feature_count} total features found")
        print(f"Risks: {len(risks)}, Clauses: {len(clauses)}, Terms: {len(key_terms)}, Financial: {len(financial_impact)}")
        
        return ComprehensiveAnalysis(
            summary=summary,
            risks=risks,
            clauses=clauses,
            key_terms=key_terms,
            action_items=action_items,
            financial_impact=financial_impact,
            recommendations=recommendations,
            confidence_score=confidence_score
        )
        
    except Exception as e:
        print(f"Analysis error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

@app.post("/debug-analyze")
async def debug_analyze(request: DocumentAnalysisRequest):
    """Debug endpoint to test analysis on specific text"""
    text = request.text.strip()
    debug_text_analysis(text, request.document_type or "general")
    
    # Test each component separately
    risks = improved_identify_risks(text)
    clauses = improved_extract_clauses(text)
    financial = improved_extract_financial_information(text)
    
    return {
        "text_length": len(text),
        "text_preview": text[:200],
        "risks_found": len(risks),
        "clauses_found": len(clauses),
        "financial_items_found": len(financial),
        "sample_risks": [r.dict() for r in risks[:3]],
        "sample_clauses": [c.dict() for c in clauses[:3]],
        "sample_financial": [f.dict() for f in financial[:3]]
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy", "models_loaded": True}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)