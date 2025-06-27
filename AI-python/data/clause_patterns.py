import re
from typing import Dict, List, Tuple

# Clause patterns organized by type
CLAUSE_PATTERNS = {
    "compensation": {
        "patterns": [
            r"salary.*?\$[\d,]+(?:\.\d{2})?",
            r"compensation.*?\$[\d,]+(?:\.\d{2})?",
            r"wage.*?\$[\d,]+(?:\.\d{2})?",
            r"pay.*?\$[\d,]+(?:\.\d{2})?",
            r"base.*?(?:salary|pay|compensation).*?\$[\d,]+",
            r"annual.*?(?:salary|compensation).*?\$[\d,]+",
            r"hourly.*?(?:rate|wage).*?\$[\d,]+",
            r"bonus.*?\$[\d,]+",
            r"commission.*?(?:\d+%|\$[\d,]+)"
        ],
        "significance": "high",
        "description": "Compensation and payment terms",
        "key_points": [
            "Base salary amount",
            "Payment frequency", 
            "Bonus structure",
            "Commission rates",
            "Overtime rates"
        ]
    },
    
    "benefits": {
        "patterns": [
            r"health.*?insurance",
            r"dental.*?insurance",
            r"vision.*?insurance",
            r"life.*?insurance",
            r"retirement.*?(?:plan|401k|pension)",
            r"vacation.*?(?:days|time|leave)",
            r"sick.*?(?:days|time|leave)",
            r"paid.*?time.*?off",
            r"holiday.*?pay",
            r"medical.*?coverage"
        ],
        "significance": "medium",
        "description": "Employee benefits and perks",
        "key_points": [
            "Health insurance coverage",
            "Retirement benefits",
            "Vacation time",
            "Sick leave",
            "Other perks"
        ]
    },
    
    "termination": {
        "patterns": [
            r"termination.*?(?:without\s+cause|for\s+cause|at\s+will)",
            r"end.*?(?:employment|agreement|contract)",
            r"resignation.*?(?:notice|period)",
            r"severance.*?(?:pay|package)",
            r"notice.*?(?:period|requirement).*?(?:\d+\s*(?:days?|weeks?|months?))",
            r"last.*?day.*?(?:employment|work)",
            r"final.*?(?:paycheck|compensation)",
            r"return.*?(?:property|equipment|materials)"
        ],
        "significance": "high",
        "description": "Employment termination conditions",
        "key_points": [
            "Termination reasons",
            "Notice requirements",
            "Severance terms",
            "Final pay procedures",
            "Return of company property"
        ]
    },
    
    "confidentiality": {
        "patterns": [
            r"confidential.*?information",
            r"proprietary.*?information",
            r"trade.*?secret",
            r"non-disclosure",
            r"confidentiality.*?(?:agreement|obligation)",
            r"proprietary.*?(?:data|technology|process)",
            r"confidential.*?(?:period|duration|term)",
            r"return.*?confidential.*?(?:information|materials)",
            r"protect.*?confidential"
        ],
        "significance": "high",
        "description": "Confidentiality and non-disclosure obligations",
        "key_points": [
            "Definition of confidential information",
            "Confidentiality period",
            "Permitted disclosures",
            "Return of materials",
            "Penalties for breach"
        ]
    },
    
    "intellectual_property": {
        "patterns": [
            r"intellectual.*?property",
            r"inventions.*?(?:assign|belong|ownership)",
            r"work.*?product.*?(?:assign|belong|ownership)",
            r"patent.*?(?:assign|rights|ownership)",
            r"copyright.*?(?:assign|rights|ownership)",
            r"trademark.*?(?:assign|rights|ownership)",
            r"trade.*?secret.*?(?:assign|rights|ownership)",
            r"derivative.*?works?",
            r"work.*?for.*?hire",
            r"assign.*?(?:all|any).*?(?:rights|title|interest)"
        ],
        "significance": "high",
        "description": "Intellectual property rights and assignments",
        "key_points": [
            "What IP is covered",
            "Assignment vs. licensing",
            "Employee vs. company ownership",
            "Pre-existing IP exceptions",
            "Future inventions"
        ]
    },
    
    "non_compete": {
        "patterns": [
            r"non-compete",
            r"restraint.*?(?:of\s+)?trade",
            r"competition.*?(?:prohibit|restrict|prevent)",
            r"compete.*?(?:with|against).*?(?:company|employer)",
            r"solicitation.*?(?:customer|client|employee)",
            r"non-solicitation",
            r"geographic.*?(?:restriction|limitation|scope)",
            r"time.*?(?:restriction|limitation|period).*?(?:\d+\s*(?:months?|years?))",
            r"covenant.*?not.*?compete"
        ],
        "significance": "critical",
        "description": "Non-compete and non-solicitation restrictions",
        "key_points": [
            "Duration of restriction",
            "Geographic scope",
            "Prohibited activities",
            "Customer/employee solicitation",
            "Penalties for violation"
        ]
    },
    
    "payment_terms": {
        "patterns": [
            r"payment.*?(?:due|terms|schedule)",
            r"invoice.*?(?:due|payment|terms)",
            r"net.*?\d+.*?days?",
            r"payment.*?(?:within|by).*?\d+.*?days?",
            r"late.*?(?:fee|charge|penalty)",
            r"interest.*?(?:rate|charge)",
            r"advance.*?payment",
            r"deposit.*?(?:required|amount)",
            r"milestone.*?payment",
            r"final.*?payment"
        ],
        "significance": "high",
        "description": "Payment schedules and terms",
        "key_points": [
            "Payment due dates",
            "Late payment penalties",
            "Interest charges",
            "Payment methods",
            "Advance payments"
        ]
    },
    
    "liability": {
        "patterns": [
            r"liability.*?(?:limit|limitation|cap)",
            r"indemnif.*?(?:hold\s+harmless|defend)",
            r"damages.*?(?:limit|limitation|exclude)",
            r"consequential.*?damages",
            r"indirect.*?damages",
            r"punitive.*?damages",
            r"limitation.*?(?:of\s+)?liability",
            r"maximum.*?liability",
            r"exclude.*?(?:warranty|liability)",
            r"as\s+is.*?(?:basis|condition)"
        ],
        "significance": "high",
        "description": "Liability limitations and indemnification",
        "key_points": [
            "Liability caps",
            "Excluded damages",
            "Indemnification scope",
            "Insurance requirements",
            "Limitation periods"
        ]
    },
    
    "dispute_resolution": {
        "patterns": [
            r"dispute.*?(?:resolution|arbitration|mediation)",
            r"arbitration.*?(?:binding|final|exclusive)",
            r"mediation.*?(?:first|required|mandatory)",
            r"governing.*?law",
            r"jurisdiction.*?(?:court|venue)",
            r"choice.*?of.*?law",
            r"venue.*?(?:court|jurisdiction)",
            r"attorney.*?(?:fees|costs)",
            r"litigation.*?(?:costs|expenses)",
            r"class.*?action.*?waiver"
        ],
        "significance": "medium",
        "description": "Dispute resolution procedures",
        "key_points": [
            "Arbitration requirements",
            "Governing law",
            "Court jurisdiction",
            "Attorney fee allocation",
            "Class action waivers"
        ]
    },
    
    "renewal_termination": {
        "patterns": [
            r"renewal.*?(?:automatic|auto|term)",
            r"terminate.*?(?:without\s+cause|for\s+convenience)",
            r"expir.*?(?:term|date|period)",
            r"notice.*?(?:termination|cancellation)",
            r"cancellation.*?(?:right|notice|period)",
            r"early.*?termination",
            r"breach.*?(?:material|cure|notice)",
            r"default.*?(?:notice|cure|period)",
            r"survival.*?(?:clause|provision|term)"
        ],
        "significance": "medium",
        "description": "Contract renewal and termination provisions",
        "key_points": [
            "Renewal terms",
            "Termination rights",
            "Notice requirements",
            "Cure periods",
            "Surviving obligations"
        ]
    }
}

# Document-specific clause patterns
DOCUMENT_SPECIFIC_CLAUSES = {
    "employment": {
        "probation": {
            "patterns": [
                r"probation.*?period.*?(?:\d+\s*(?:days?|months?))",
                r"trial.*?period.*?(?:\d+\s*(?:days?|months?))",
                r"introductory.*?period"
            ],
            "significance": "medium",
            "description": "Probationary employment period"
        },
        "overtime": {
            "patterns": [
                r"overtime.*?(?:exempt|non-exempt|eligible)",
                r"hours.*?(?:per\s+week|weekly|standard)",
                r"time.*?and.*?half",
                r"compensatory.*?time"
            ],
            "significance": "medium",
            "description": "Overtime and working hours"
        }
    },
    
    "lease": {
        "rent": {
            "patterns": [
                r"rent.*?\$[\d,]+(?:\.\d{2})?",
                r"monthly.*?rent.*?\$[\d,]+",
                r"base.*?rent.*?\$[\d,]+",
                r"additional.*?rent",
                r"rent.*?increase",
                r"escalation.*?clause"
            ],
            "significance": "critical",
            "description": "Rent amount and payment terms"
        },
        "security_deposit": {
            "patterns": [
                r"security.*?deposit.*?\$[\d,]+",
                r"damage.*?deposit",
                r"last.*?month.*?rent",
                r"refund.*?deposit",
                r"return.*?deposit"
            ],
            "significance": "high",
            "description": "Security deposit requirements"
        },
        "maintenance": {
            "patterns": [
                r"maintenance.*?(?:responsibility|obligation)",
                r"repair.*?(?:responsibility|obligation)",
                r"tenant.*?responsible.*?(?:maintenance|repair)",
                r"landlord.*?responsible.*?(?:maintenance|repair)",
                r"common.*?area.*?maintenance"
            ],
            "significance": "medium",
            "description": "Maintenance responsibilities"
        }
    },
    
    "service": {
        "scope_of_work": {
            "patterns": [
                r"scope.*?of.*?work",
                r"services.*?(?:include|consist|comprise)",
                r"deliverable",
                r"statement.*?of.*?work",
                r"work.*?product",
                r"milestone",
                r"project.*?description"
            ],
            "significance": "critical",
            "description": "Scope of work and deliverables"
        },
        "performance_standards": {
            "patterns": [
                r"performance.*?(?:standard|criteria|metric)",
                r"service.*?level.*?agreement",
                r"quality.*?(?:standard|assurance)",
                r"acceptance.*?criteria",
                r"specification",
                r"compliance.*?requirement"
            ],
            "significance": "high",
            "description": "Performance standards and metrics"
        }
    }
}

# Clause significance levels
SIGNIFICANCE_LEVELS = {
    "critical": {
        "priority": 1,
        "color": "#FF0000",
        "description": "Must be carefully reviewed and understood"
    },
    "high": {
        "priority": 2,
        "color": "#FF8C00",
        "description": "Important terms that require attention"
    },
    "medium": {
        "priority": 3,
        "color": "#FFD700",
        "description": "Standard terms that should be noted"
    },
    "low": {
        "priority": 4,
        "color": "#90EE90",
        "description": "Routine clauses for general awareness"
    }
}

def get_clause_patterns_by_type(clause_type: str) -> Dict:
    """Get patterns for a specific clause type"""
    return CLAUSE_PATTERNS.get(clause_type, {})

def get_all_clause_types() -> List[str]:
    """Get list of all clause types"""
    return list(CLAUSE_PATTERNS.keys())

def get_high_significance_clauses() -> Dict:
    """Get all high and critical significance clauses"""
    return {
        clause_type: data 
        for clause_type, data in CLAUSE_PATTERNS.items()
        if data["significance"] in ["high", "critical"]
    }

def get_document_specific_clauses(doc_type: str) -> Dict:
    """Get clauses specific to document type"""
    return DOCUMENT_SPECIFIC_CLAUSES.get(doc_type, {})