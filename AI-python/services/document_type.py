from enum import Enum
from typing import List, Optional, Dict, Any, Tuple
from pydantic import BaseModel, Field
import re


class DocumentType(str, Enum):
    """Standardized document types for legal analysis"""
    
    # Contract Types
    EMPLOYMENT = "employment"
    SERVICE_AGREEMENT = "service_agreement"
    LEASE = "lease"
    PURCHASE_AGREEMENT = "purchase_agreement"
    LICENSING = "licensing"
    PARTNERSHIP = "partnership"
    VENDOR_AGREEMENT = "vendor_agreement"
    FRANCHISE_AGREEMENT = "franchise_agreement"
    DISTRIBUTION_AGREEMENT = "distribution_agreement"
    NON_COMPETE = "non_compete"
    CONSULTING_AGREEMENT = "consulting_agreement"
    SUBCONTRACTOR_AGREEMENT = "subcontractor_agreement"
    
    # Corporate Documents
    CORPORATE_BYLAWS = "corporate_bylaws"
    OPERATING_AGREEMENT = "operating_agreement"
    SHAREHOLDERS_AGREEMENT = "shareholders_agreement"
    ARTICLES_OF_INCORPORATION = "articles_of_incorporation"
    BOARD_RESOLUTION = "board_resolution"
    PROXY_STATEMENT = "proxy_statement"
    MERGER_AGREEMENT = "merger_agreement"
    ACQUISITION_AGREEMENT = "acquisition_agreement"
    
    # Policy Documents
    PRIVACY_POLICY = "privacy_policy"
    TERMS_OF_SERVICE = "terms_of_service"
    EMPLOYEE_HANDBOOK = "employee_handbook"
    COMPLIANCE_POLICY = "compliance_policy"
    CODE_OF_CONDUCT = "code_of_conduct"
    SAFETY_POLICY = "safety_policy"
    ANTI_HARASSMENT_POLICY = "anti_harassment_policy"
    
    # Financial Documents
    LOAN_AGREEMENT = "loan_agreement"
    PROMISSORY_NOTE = "promissory_note"
    SECURITY_AGREEMENT = "security_agreement"
    CREDIT_AGREEMENT = "credit_agreement"
    INVOICE = "invoice"
    BILLING_STATEMENT = "billing_statement"
    PAYMENT_AGREEMENT = "payment_agreement"
    DEBT_SETTLEMENT = "debt_settlement"
    MORTGAGE_AGREEMENT = "mortgage_agreement"
    
    # Insurance Documents
    INSURANCE_POLICY = "insurance_policy"
    INSURANCE_CLAIM = "insurance_claim"
    INSURANCE_CERTIFICATE = "insurance_certificate"
    
    # Legal Filings & Court Documents
    COURT_FILING = "court_filing"
    REGULATORY_FILING = "regulatory_filing"
    COMPLAINT = "complaint"
    MOTION = "motion"
    BRIEF = "brief"
    JUDGMENT = "judgment"
    COURT_ORDER = "court_order"
    SUBPOENA = "subpoena"
    DEPOSITION = "deposition"
    DISCOVERY_REQUEST = "discovery_request"
    SETTLEMENT_AGREEMENT = "settlement_agreement"
    
    # Family Law Documents
    DIVORCE_DECREE = "divorce_decree"
    CUSTODY_AGREEMENT = "custody_agreement"
    CHILD_SUPPORT_ORDER = "child_support_order"
    PRENUPTIAL_AGREEMENT = "prenuptial_agreement"
    ADOPTION_PAPERS = "adoption_papers"
    GUARDIANSHIP_PAPERS = "guardianship_papers"
    DOMESTIC_VIOLENCE_ORDER = "domestic_violence_order"
    PATERNITY_AGREEMENT = "paternity_agreement"
    
    # Real Estate Documents
    PURCHASE_CONTRACT = "purchase_contract"
    DEED = "deed"
    TITLE_DOCUMENT = "title_document"
    ESCROW_AGREEMENT = "escrow_agreement"
    PROPERTY_DISCLOSURE = "property_disclosure"
    HOMEOWNERS_ASSOCIATION = "homeowners_association"
    EASEMENT_AGREEMENT = "easement_agreement"
    
    # Educational Documents
    STUDENT_ENROLLMENT = "student_enrollment"
    TUITION_AGREEMENT = "tuition_agreement"
    STUDENT_LOAN_AGREEMENT = "student_loan_agreement"
    ACADEMIC_TRANSCRIPT = "academic_transcript"
    DISCIPLINARY_NOTICE = "disciplinary_notice"
    GRADUATION_CERTIFICATE = "graduation_certificate"
    STUDENT_FEES_NOTICE = "student_fees_notice"
    
    # Employment & Labor Documents
    UNION_CONTRACT = "union_contract"
    COLLECTIVE_BARGAINING = "collective_bargaining"
    SEVERANCE_AGREEMENT = "severance_agreement"
    WORKERS_COMPENSATION = "workers_compensation"
    DISCIPLINARY_ACTION = "disciplinary_action"
    PERFORMANCE_REVIEW = "performance_review"
    
    # Intellectual Property Documents
    PATENT_APPLICATION = "patent_application"
    TRADEMARK_APPLICATION = "trademark_application"
    COPYRIGHT_ASSIGNMENT = "copyright_assignment"
    LICENSING_AGREEMENT = "licensing_agreement"
    WORK_FOR_HIRE = "work_for_hire"
    
    # Tax & Government Documents
    TAX_RETURN = "tax_return"
    TAX_NOTICE = "tax_notice"
    BUSINESS_LICENSE = "business_license"
    PERMIT_APPLICATION = "permit_application"
    GOVERNMENT_CONTRACT = "government_contract"
    REGULATORY_NOTICE = "regulatory_notice"
    
    # Healthcare Documents
    MEDICAL_CONSENT = "medical_consent"
    HIPAA_AUTHORIZATION = "hipaa_authorization"
    ADVANCE_DIRECTIVE = "advance_directive"
    POWER_OF_ATTORNEY_HEALTHCARE = "power_of_attorney_healthcare"
    
    # Estate Planning Documents
    WILL = "will"
    TRUST_AGREEMENT = "trust_agreement"
    POWER_OF_ATTORNEY = "power_of_attorney"
    ESTATE_PLANNING = "estate_planning"
    PROBATE_DOCUMENT = "probate_document"
    
    # Legal Notices & Communications
    LEGAL_NOTICE = "legal_notice"
    DEMAND_LETTER = "demand_letter"
    CEASE_AND_DESIST = "cease_and_desist"
    WARNING_LETTER = "warning_letter"
    COMPLIANCE_NOTICE = "compliance_notice"
    DEFAULT_NOTICE = "default_notice"
    EVICTION_NOTICE = "eviction_notice"
    TERMINATION_NOTICE = "termination_notice"
    
    # Other Common Documents
    NDA = "nda"
    WAIVER = "waiver"
    RELEASE_AGREEMENT = "release_agreement"
    INDEMNIFICATION = "indemnification"
    ARBITRATION_AGREEMENT = "arbitration_agreement"
    GENERAL = "general"


class DocumentClassificationRequest(BaseModel):
    """Request for document classification"""
    text: str = Field(..., description="Document text to classify")
    confidence_threshold: float = Field(default=0.7, description="Minimum confidence for classification")
    max_alternatives: int = Field(default=3, description="Maximum number of alternative classifications")


class DocumentClassificationResult(BaseModel):
    """Result of document classification"""
    document_type: DocumentType
    confidence: float = Field(..., description="Confidence score (0-1)")
    reasoning: str = Field(..., description="Explanation of classification")
    alternative_types: List[Tuple[DocumentType, float]] = Field(default_factory=list)
    key_indicators: List[str] = Field(default_factory=list, description="Key phrases that influenced classification")


class DocumentAnalysisRequest(BaseModel):
    """Enhanced request for document analysis"""
    text: str = Field(..., description="Document text to analyze")
    document_type: Optional[DocumentType] = Field(
        default=None,
        description="Type of document (auto-detected if not provided)"
    )
    auto_classify: bool = Field(default=True, description="Auto-classify if document_type not provided")
    analysis_depth: str = Field(default="standard", description="Analysis depth: basic, standard, comprehensive")
    extract_entities: bool = Field(default=True, description="Extract key entities and dates")


class DocumentClassifier:
    """Enhanced classifier for legal document types"""
    
    # Document type indicators with expanded patterns
    CLASSIFICATION_PATTERNS = {
        DocumentType.EMPLOYMENT: {
            "strong_indicators": [
                r"employment\s+(?:agreement|contract)",
                r"job\s+(?:description|duties|responsibilities)",
                r"salary\s+and\s+benefits",
                r"termination\s+of\s+employment",
                r"non-compete\s+(?:agreement|clause)",
                r"employee\s+handbook\s+acknowledgment",
                r"at-will\s+employment"
            ],
            "moderate_indicators": [
                r"position\s+title",
                r"reporting\s+(?:to|structure)",
                r"work\s+schedule",
                r"probationary\s+period",
                r"vacation\s+(?:time|days|policy)",
                r"performance\s+review"
            ],
            "context_words": ["employee", "employer", "job", "position", "work", "salary", "benefits", "compensation"]
        },
        
        DocumentType.INVOICE: {
            "strong_indicators": [
                r"invoice\s+(?:number|#)",
                r"bill\s+to",
                r"amount\s+due",
                r"payment\s+terms",
                r"invoice\s+date",
                r"due\s+date",
                r"subtotal"
            ],
            "moderate_indicators": [
                r"quantity\s+(?:x|×)",
                r"unit\s+price",
                r"tax\s+(?:amount|rate)",
                r"total\s+amount",
                r"remit\s+to",
                r"payment\s+method"
            ],
            "context_words": ["invoice", "bill", "payment", "amount", "due", "total", "tax", "services"]
        },
        
        DocumentType.STUDENT_FEES_NOTICE: {
            "strong_indicators": [
                r"tuition\s+(?:fees|charges)",
                r"student\s+fees",
                r"semester\s+charges",
                r"academic\s+fees",
                r"registration\s+fees",
                r"late\s+payment\s+fee",
                r"student\s+account"
            ],
            "moderate_indicators": [
                r"course\s+fees",
                r"lab\s+fees",
                r"activity\s+fees",
                r"technology\s+fee",
                r"parking\s+permit",
                r"health\s+services\s+fee"
            ],
            "context_words": ["student", "tuition", "fees", "semester", "academic", "registration", "university", "college"]
        },
        
        DocumentType.LEGAL_NOTICE: {
            "strong_indicators": [
                r"legal\s+notice",
                r"notice\s+of\s+(?:default|violation|breach)",
                r"formal\s+notice",
                r"statutory\s+notice",
                r"public\s+notice",
                r"notice\s+to\s+(?:quit|vacate|cure)"
            ],
            "moderate_indicators": [
                r"notice\s+period",
                r"compliance\s+required",
                r"legal\s+action",
                r"cure\s+period",
                r"notice\s+date"
            ],
            "context_words": ["notice", "legal", "compliance", "violation", "default", "remedy", "action"]
        },
        
        DocumentType.WARNING_LETTER: {
            "strong_indicators": [
                r"warning\s+letter",
                r"formal\s+warning",
                r"written\s+warning",
                r"disciplinary\s+warning",
                r"cease\s+and\s+desist",
                r"violation\s+notice"
            ],
            "moderate_indicators": [
                r"corrective\s+action",
                r"immediate\s+attention",
                r"consequences",
                r"further\s+action",
                r"compliance\s+required"
            ],
            "context_words": ["warning", "violation", "cease", "desist", "action", "consequences", "compliance"]
        },
        
        DocumentType.DIVORCE_DECREE: {
            "strong_indicators": [
                r"divorce\s+decree",
                r"dissolution\s+of\s+marriage",
                r"final\s+judgment\s+of\s+divorce",
                r"marital\s+settlement",
                r"custody\s+arrangement",
                r"alimony\s+(?:award|order)"
            ],
            "moderate_indicators": [
                r"property\s+division",
                r"child\s+support",
                r"visitation\s+schedule",
                r"spousal\s+support",
                r"irreconcilable\s+differences"
            ],
            "context_words": ["divorce", "marriage", "spouse", "custody", "alimony", "settlement", "dissolution"]
        },
        
        DocumentType.CUSTODY_AGREEMENT: {
            "strong_indicators": [
                r"custody\s+agreement",
                r"parenting\s+plan",
                r"child\s+custody",
                r"visitation\s+schedule",
                r"joint\s+custody",
                r"sole\s+custody"
            ],
            "moderate_indicators": [
                r"parenting\s+time",
                r"holiday\s+schedule",
                r"decision\s+making",
                r"residential\s+parent",
                r"supervised\s+visitation"
            ],
            "context_words": ["custody", "parenting", "visitation", "child", "parent", "schedule", "residential"]
        },
        
        DocumentType.EVICTION_NOTICE: {
            "strong_indicators": [
                r"eviction\s+notice",
                r"notice\s+to\s+quit",
                r"notice\s+to\s+vacate",
                r"unlawful\s+detainer",
                r"pay\s+or\s+quit",
                r"cure\s+or\s+quit"
            ],
            "moderate_indicators": [
                r"rental\s+violation",
                r"lease\s+breach",
                r"unpaid\s+rent",
                r"possession\s+of\s+premises",
                r"sheriff\s+department"
            ],
            "context_words": ["eviction", "quit", "vacate", "rent", "lease", "tenant", "landlord", "premises"]
        },
        
        DocumentType.DEMAND_LETTER: {
            "strong_indicators": [
                r"demand\s+letter",
                r"formal\s+demand",
                r"payment\s+demand",
                r"demand\s+for\s+payment",
                r"final\s+demand",
                r"demand\s+notice"
            ],
            "moderate_indicators": [
                r"amount\s+owed",
                r"collection\s+action",
                r"legal\s+proceedings",
                r"immediate\s+payment",
                r"default\s+on\s+payment"
            ],
            "context_words": ["demand", "payment", "owed", "collection", "debt", "legal", "proceedings"]
        },
        
        DocumentType.LEASE: {
            "strong_indicators": [
                r"lease\s+(?:agreement|contract)",
                r"rental\s+agreement",
                r"landlord\s+and\s+tenant",
                r"premises\s+(?:located|description)",
                r"monthly\s+rent",
                r"security\s+deposit"
            ],
            "moderate_indicators": [
                r"rent\s+due\s+date",
                r"lease\s+term",
                r"utilities\s+responsibility",
                r"pet\s+policy",
                r"maintenance\s+responsibilities"
            ],
            "context_words": ["rent", "lease", "tenant", "landlord", "premises", "property", "monthly"]
        },
        
        DocumentType.SERVICE_AGREEMENT: {
            "strong_indicators": [
                r"service\s+(?:agreement|contract)",
                r"professional\s+services",
                r"scope\s+of\s+work",
                r"deliverables",
                r"statement\s+of\s+work",
                r"consulting\s+(?:agreement|services)"
            ],
            "moderate_indicators": [
                r"project\s+(?:description|scope)",
                r"milestones",
                r"acceptance\s+criteria",
                r"service\s+level\s+agreement",
                r"performance\s+standards"
            ],
            "context_words": ["services", "deliverables", "project", "consultant", "client", "scope", "work"]
        },
        
        DocumentType.NDA: {
            "strong_indicators": [
                r"non-disclosure\s+agreement",
                r"confidentiality\s+agreement",
                r"mutual\s+non-disclosure",
                r"confidential\s+information",
                r"proprietary\s+information"
            ],
            "moderate_indicators": [
                r"trade\s+secrets",
                r"confidential\s+(?:materials|data)",
                r"disclosing\s+party",
                r"receiving\s+party"
            ],
            "context_words": ["confidential", "proprietary", "disclosure", "secret", "information", "trade"]
        },
        
        DocumentType.PRIVACY_POLICY: {
            "strong_indicators": [
                r"privacy\s+policy",
                r"data\s+protection\s+policy",
                r"personal\s+information\s+collection",
                r"cookies\s+policy",
                r"gdpr\s+compliance"
            ],
            "moderate_indicators": [
                r"data\s+processing",
                r"user\s+information",
                r"third\s+party\s+sharing",
                r"opt-out\s+rights"
            ],
            "context_words": ["privacy", "data", "personal", "information", "cookies", "gdpr", "collection"]
        },
        
        DocumentType.TERMS_OF_SERVICE: {
            "strong_indicators": [
                r"terms\s+of\s+(?:service|use)",
                r"user\s+agreement",
                r"website\s+terms",
                r"acceptable\s+use\s+policy"
            ],
            "moderate_indicators": [
                r"user\s+obligations",
                r"prohibited\s+activities",
                r"account\s+termination",
                r"limitation\s+of\s+liability"
            ],
            "context_words": ["user", "service", "website", "platform", "account", "terms", "use"]
        },
        
        DocumentType.INSURANCE_POLICY: {
            "strong_indicators": [
                r"insurance\s+policy",
                r"coverage\s+(?:limits|details)",
                r"policyholder",
                r"premium\s+(?:amount|payment)",
                r"deductible"
            ],
            "moderate_indicators": [
                r"claims\s+process",
                r"exclusions",
                r"beneficiary",
                r"policy\s+period"
            ],
            "context_words": ["insurance", "policy", "coverage", "claim", "premium", "deductible", "insured"]
        },
        
        DocumentType.LOAN_AGREEMENT: {
            "strong_indicators": [
                r"loan\s+agreement",
                r"promissory\s+note",
                r"principal\s+amount",
                r"interest\s+rate",
                r"repayment\s+schedule"
            ],
            "moderate_indicators": [
                r"borrower\s+and\s+lender",
                r"default\s+provisions",
                r"collateral",
                r"maturity\s+date"
            ],
            "context_words": ["loan", "borrower", "lender", "principal", "interest", "payment", "repayment"]
        },
        
        DocumentType.COURT_ORDER: {
            "strong_indicators": [
                r"court\s+order",
                r"judge\s+orders",
                r"the\s+court\s+(?:finds|orders|rules)",
                r"temporary\s+restraining\s+order",
                r"injunction",
                r"contempt\s+of\s+court"
            ],
            "moderate_indicators": [
                r"case\s+number",
                r"docket\s+number",
                r"plaintiff\s+(?:vs?\.?|versus)",
                r"defendant",
                r"court\s+clerk"
            ],
            "context_words": ["court", "judge", "order", "case", "plaintiff", "defendant", "docket"]
        },
        
        DocumentType.WILL: {
            "strong_indicators": [
                r"last\s+will\s+and\s+testament",
                r"will\s+and\s+testament",
                r"testator",
                r"executor",
                r"bequeath",
                r"devise"
            ],
            "moderate_indicators": [
                r"probate",
                r"estate\s+administration",
                r"beneficiary",
                r"inheritance",
                r"personal\s+representative"
            ],
            "context_words": ["will", "testament", "executor", "beneficiary", "estate", "probate", "inherit"]
        },
        
        DocumentType.POWER_OF_ATTORNEY: {
            "strong_indicators": [
                r"power\s+of\s+attorney",
                r"attorney-in-fact",
                r"agent\s+authority",
                r"durable\s+power",
                r"healthcare\s+power\s+of\s+attorney",
                r"financial\s+power\s+of\s+attorney"
            ],
            "moderate_indicators": [
                r"principal",
                r"agent",
                r"authority\s+to\s+act",
                r"medical\s+decisions",
                r"financial\s+decisions"
            ],
            "context_words": ["power", "attorney", "agent", "principal", "authority", "decisions", "behalf"]
        }
    }
    
    @classmethod
    def classify_document(cls, text: str, confidence_threshold: float = 0.7) -> DocumentClassificationResult:
        """Classify a document based on its content"""
        
        text_lower = text.lower()
        scores = {}
        
        for doc_type, patterns in cls.CLASSIFICATION_PATTERNS.items():
            score = 0
            matched_patterns = []
            
            # Check strong indicators (weight: 3)
            for pattern in patterns["strong_indicators"]:
                matches = len(re.findall(pattern, text_lower, re.IGNORECASE))
                if matches > 0:
                    score += matches * 3
                    matched_patterns.append(f"Strong: {pattern}")
            
            # Check moderate indicators (weight: 2)
            for pattern in patterns["moderate_indicators"]:
                matches = len(re.findall(pattern, text_lower, re.IGNORECASE))
                if matches > 0:
                    score += matches * 2
                    matched_patterns.append(f"Moderate: {pattern}")
            
            # Check context words (weight: 1)
            context_score = 0
            for word in patterns["context_words"]:
                word_count = text_lower.count(word)
                context_score += min(word_count, 5)  # Cap at 5 to prevent overwhelming
            
            score += context_score
            
            # Normalize score based on text length
            normalized_score = min(score / (len(text.split()) * 0.01), 1.0)
            scores[doc_type] = {
                "score": normalized_score,
                "matched_patterns": matched_patterns
            }
        
        # Find best match
        best_type = max(scores.keys(), key=lambda x: scores[x]["score"])
        best_score = scores[best_type]["score"]
        
        # Get alternatives
        alternatives = [(doc_type, data["score"]) for doc_type, data in scores.items() 
                      if doc_type != best_type and data["score"] > 0.1]
        alternatives.sort(key=lambda x: x[1], reverse=True)
        alternatives = alternatives[:3]  # Top 3 alternatives
        
        # Determine final classification
        if best_score >= confidence_threshold:
            final_type = best_type
            reasoning = f"Classified as {best_type.value} with {best_score:.2f} confidence. "
            reasoning += f"Matched patterns: {', '.join(scores[best_type]['matched_patterns'][:3])}"
        else:
            final_type = DocumentType.GENERAL
            reasoning = f"Low confidence ({best_score:.2f}) for {best_type.value}. Using general classification."
        
        return DocumentClassificationResult(
            document_type=final_type,
            confidence=best_score,
            reasoning=reasoning,
            alternative_types=alternatives
        )

