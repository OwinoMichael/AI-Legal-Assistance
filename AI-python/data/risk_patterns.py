import re
from typing import Dict, List, Tuple

# Risk patterns organized by severity level
RISK_PATTERNS = {
    "critical": [
        # Financial risks
        {
            "pattern": r"unlimited\s+liability",
            "title": "Unlimited Liability Exposure",
            "description": "No cap on potential financial responsibility - could result in significant financial loss",
            "category": "financial",
            "severity_score": 10,
            "mitigation": "Negotiate liability caps or limitation clauses"
        },
        {
            "pattern": r"personal\s+guarantee",
            "title": "Personal Guarantee Required",
            "description": "Personal assets may be at risk if business defaults",
            "category": "financial",
            "severity_score": 9,
            "mitigation": "Consider corporate guarantees or liability limitations"
        },
        {
            "pattern": r"liquidated\s+damages.*?\$[\d,]+(?:\.\d{2})?",
            "title": "High Liquidated Damages",
            "description": "Predetermined penalties that could be substantial",
            "category": "financial",
            "severity_score": 8,
            "mitigation": "Negotiate reasonable damage amounts and triggers"
        },
        
        # Employment risks
        {
            "pattern": r"non-compete.*?(?:\d+)\s*(?:years?)",
            "title": "Long-term Non-Compete",
            "description": "Extended non-compete period may severely limit future employment",
            "category": "employment",
            "severity_score": 9,
            "mitigation": "Negotiate shorter duration and narrower scope"
        },
        {
            "pattern": r"all\s+intellectual\s+property.*?assign",
            "title": "Broad IP Assignment",
            "description": "All intellectual property rights assigned to employer",
            "category": "employment",
            "severity_score": 8,
            "mitigation": "Negotiate exceptions for personal projects"
        }
    ],
    
    "high": [
        # Contract termination risks
        {
            "pattern": r"terminate.*?(?:without\s+cause|at\s+will)",
            "title": "At-Will Termination",
            "description": "Employment or contract can be terminated without cause",
            "category": "employment",
            "severity_score": 7,
            "mitigation": "Negotiate severance packages or notice periods"
        },
        {
            "pattern": r"penalty.*?\$[\d,]+",
            "title": "Monetary Penalties",
            "description": "Financial penalties specified for various violations",
            "category": "financial",
            "severity_score": 7,
            "mitigation": "Review penalty triggers and negotiate amounts"
        },
        {
            "pattern": r"automatic\s+renewal",
            "title": "Automatic Renewal Clause",
            "description": "Contract automatically renews without explicit consent",
            "category": "contractual",
            "severity_score": 6,
            "mitigation": "Set calendar reminders for renewal dates"
        },
        {
            "pattern": r"confidential.*?perpetual",
            "title": "Perpetual Confidentiality",
            "description": "Confidentiality obligations last indefinitely",
            "category": "confidentiality",
            "severity_score": 6,
            "mitigation": "Negotiate time limits on confidentiality"
        },
        {
            "pattern": r"indemnif.*?(?:all|any).*?(?:claims|damages)",
            "title": "Broad Indemnification",
            "description": "Requirement to indemnify against broad range of claims",
            "category": "legal",
            "severity_score": 7,
            "mitigation": "Limit indemnification scope and add carve-outs"
        }
    ],
    
    "medium": [
        # Payment and financial terms
        {
            "pattern": r"late\s+(?:fee|charge|penalty)",
            "title": "Late Payment Fees",
            "description": "Additional charges apply for late payments",
            "category": "financial",
            "severity_score": 4,
            "mitigation": "Understand fee structure and payment deadlines"
        },
        {
            "pattern": r"interest.*?rate.*?(\d+(?:\.\d+)?)%",
            "title": "Interest Rate Specified",
            "description": "Interest charges on outstanding balances",
            "category": "financial",
            "severity_score": 4,
            "mitigation": "Compare rates and negotiate if necessary"
        },
        {
            "pattern": r"dispute.*?arbitration",
            "title": "Mandatory Arbitration",
            "description": "Disputes must be resolved through arbitration, not courts",
            "category": "legal",
            "severity_score": 5,
            "mitigation": "Understand arbitration process and costs"
        },
        {
            "pattern": r"notice.*?(\d+)\s*days?",
            "title": "Notice Period Required",
            "description": "Advance notice required for termination or changes",
            "category": "contractual",
            "severity_score": 3,
            "mitigation": "Calendar notice deadlines"
        },
        {
            "pattern": r"governing\s+law.*?(?:state|jurisdiction)",
            "title": "Governing Law Clause",
            "description": "Contract governed by laws of specific jurisdiction",
            "category": "legal",
            "severity_score": 3,
            "mitigation": "Understand implications of governing law"
        }
    ],
    
    "low": [
        # Standard clauses that should be noted
        {
            "pattern": r"entire\s+agreement",
            "title": "Entire Agreement Clause",
            "description": "Contract represents complete agreement between parties",
            "category": "contractual",
            "severity_score": 2,
            "mitigation": "Ensure all important terms are in writing"
        },
        {
            "pattern": r"amendment.*?writing",
            "title": "Written Amendment Required",
            "description": "Changes must be made in writing",
            "category": "contractual",
            "severity_score": 2,
            "mitigation": "Document all changes formally"
        },
        {
            "pattern": r"force\s+majeure",
            "title": "Force Majeure Clause",
            "description": "Protection for unforeseeable circumstances",
            "category": "legal",
            "severity_score": 1,
            "mitigation": "Understand what events qualify"
        }
    ]
}

# Document-specific risk patterns
DOCUMENT_SPECIFIC_RISKS = {
    "employment": [
        {
            "pattern": r"probation.*?period.*?(\d+)\s*(?:months?|days?)",
            "title": "Probationary Period",
            "description": "Initial employment period with different terms",
            "category": "employment",
            "severity_score": 3
        },
        {
            "pattern": r"overtime.*?exempt",
            "title": "Overtime Exemption",
            "description": "Position may be exempt from overtime pay",
            "category": "employment",
            "severity_score": 4
        }
    ],
    
    "lease": [
        {
            "pattern": r"joint.*?several.*?liability",
            "title": "Joint and Several Liability",
            "description": "All tenants responsible for full rent amount",
            "category": "real_estate",
            "severity_score": 6
        },
        {
            "pattern": r"security\s+deposit.*?\$[\d,]+",
            "title": "Security Deposit Required",
            "description": "Upfront deposit required, may be forfeited",
            "category": "financial",
            "severity_score": 3
        }
    ],
    
    "service": [
        {
            "pattern": r"scope.*?(?:creep|change)",
            "title": "Scope Change Risk",
            "description": "Risk of work expanding beyond original agreement",
            "category": "contractual",
            "severity_score": 5
        },
        {
            "pattern": r"deliverable.*?acceptance",
            "title": "Acceptance Criteria",
            "description": "Client must formally accept deliverables",
            "category": "contractual",
            "severity_score": 4
        }
    ]
}

# Risk categories with descriptions
RISK_CATEGORIES = {
    "financial": {
        "name": "Financial Risk",
        "description": "Risks involving money, payments, or financial obligations",
        "color": "#FF4444"
    },
    "employment": {
        "name": "Employment Risk", 
        "description": "Risks related to employment terms and conditions",
        "color": "#FF8C00"
    },
    "legal": {
        "name": "Legal Risk",
        "description": "Risks involving legal obligations and compliance",
        "color": "#8B0000"
    },
    "contractual": {
        "name": "Contractual Risk",
        "description": "Risks related to contract terms and performance",
        "color": "#4169E1"
    },
    "confidentiality": {
        "name": "Confidentiality Risk",
        "description": "Risks involving confidential information and trade secrets",
        "color": "#9932CC"
    },
    "real_estate": {
        "name": "Real Estate Risk",
        "description": "Risks specific to property and real estate transactions",
        "color": "#228B22"
    }
}

# Severity score meanings
SEVERITY_LEVELS = {
    1: {"level": "Very Low", "description": "Minimal impact, standard clause"},
    2: {"level": "Low", "description": "Minor impact, should be noted"},
    3: {"level": "Low-Medium", "description": "Some impact, review recommended"},
    4: {"level": "Medium", "description": "Moderate impact, attention needed"},
    5: {"level": "Medium-High", "description": "Significant impact, careful review"},
    6: {"level": "High", "description": "Major impact, professional advice recommended"},
    7: {"level": "High", "description": "Serious impact, negotiate changes"},
    8: {"level": "Very High", "description": "Severe impact, major concern"},
    9: {"level": "Critical", "description": "Extreme impact, avoid if possible"},
    10: {"level": "Critical", "description": "Maximum impact, unacceptable risk"}
}

def get_risk_level_from_score(score: int) -> str:
    """Convert severity score to risk level"""
    if score >= 8:
        return "critical"
    elif score >= 6:
        return "high"
    elif score >= 3:
        return "medium"
    else:
        return "low"

def get_patterns_by_document_type(doc_type: str) -> List[Dict]:
    """Get risk patterns specific to document type"""
    patterns = []
    
    # Add general patterns
    for level, pattern_list in RISK_PATTERNS.items():
        patterns.extend(pattern_list)
    
    # Add document-specific patterns
    if doc_type in DOCUMENT_SPECIFIC_RISKS:
        patterns.extend(DOCUMENT_SPECIFIC_RISKS[doc_type])
    
    return patterns

def get_patterns_by_category(category: str) -> List[Dict]:
    """Get all risk patterns in a specific category"""
    patterns = []
    
    for level, pattern_list in RISK_PATTERNS.items():
        for pattern in pattern_list:
            if pattern.get("category") == category:
                patterns.append(pattern)
    
    return patterns