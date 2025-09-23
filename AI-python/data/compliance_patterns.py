"""
Compliance data module for document analysis service.
Contains patterns and templates for identifying compliance requirements.
"""



# Compliance patterns by category
COMPLIANCE_PATTERNS = {
    "regulatory": [
        {
            "pattern": r"(?:must comply|compliance|regulatory|regulation).*?(?:law|statute|code|rule)",
            "description": "Regulatory compliance requirement",
            "requirement_level": "mandatory",
            "category": "regulatory"
        },
        {
            "pattern": r"(?:federal|state|local).*?(?:requirement|regulation|law)",
            "description": "Government regulation compliance",
            "requirement_level": "mandatory",
            "category": "regulatory"
        },
        {
            "pattern": r"(?:SEC|FDA|EPA|OSHA|FTC).*?(?:compliance|requirement|regulation)",
            "description": "Federal agency compliance requirement",
            "requirement_level": "mandatory",
            "category": "regulatory"
        },
        {
            "pattern": r"(?:GDPR|CCPA|HIPAA|SOX).*?(?:compliance|requirement)",
            "description": "Data protection and privacy compliance",
            "requirement_level": "mandatory",
            "category": "regulatory"
        }
    ],
    "reporting": [
        {
            "pattern": r"(?:report|notify|disclosure).*?(?:required|mandatory|must)",
            "description": "Reporting requirement",
            "requirement_level": "mandatory",
            "category": "reporting"
        },
        {
            "pattern": r"(?:annual|monthly|quarterly).*?(?:report|filing|submission)",
            "description": "Periodic reporting requirement",
            "requirement_level": "mandatory",
            "category": "reporting"
        },
        {
            "pattern": r"(?:tax|financial).*?(?:report|filing|return)",
            "description": "Tax and financial reporting",
            "requirement_level": "mandatory",
            "category": "reporting"
        },
        {
            "pattern": r"(?:audit|examination).*?(?:required|mandatory|annual)",
            "description": "Audit requirement",
            "requirement_level": "mandatory",
            "category": "reporting"
        }
    ],
    "certification": [
        {
            "pattern": r"(?:certify|certification|certificate).*?(?:required|needed|must)",
            "description": "Certification requirement",
            "requirement_level": "mandatory",
            "category": "certification"
        },
        {
            "pattern": r"(?:license|permit|authorization).*?(?:required|valid|current)",
            "description": "Licensing requirement",
            "requirement_level": "mandatory",
            "category": "certification"
        },
        {
            "pattern": r"(?:professional|industry).*?(?:certification|license)",
            "description": "Professional certification requirement",
            "requirement_level": "recommended",
            "category": "certification"
        },
        {
            "pattern": r"(?:ISO|SOC|PCI).*?(?:certification|compliance|certified)",
            "description": "Industry standard certification",
            "requirement_level": "recommended",
            "category": "certification"
        }
    ],
    "training": [
        {
            "pattern": r"(?:training|education).*?(?:required|mandatory|must)",
            "description": "Training requirement",
            "requirement_level": "mandatory",
            "category": "training"
        },
        {
            "pattern": r"(?:continuing education|professional development).*?(?:required|hours)",
            "description": "Continuing education requirement",
            "requirement_level": "mandatory",
            "category": "training"
        },
        {
            "pattern": r"(?:safety|security).*?(?:training|certification).*?(?:required|annual)",
            "description": "Safety or security training requirement",
            "requirement_level": "mandatory",
            "category": "training"
        }
    ],
    "documentation": [
        {
            "pattern": r"(?:document|record|maintain).*?(?:required|must|shall)",
            "description": "Documentation requirement",
            "requirement_level": "mandatory",
            "category": "documentation"
        },
        {
            "pattern": r"(?:retain|preserve).*?(?:records|documents).*?(?:\d+)\s*(?:years?|months?)",
            "description": "Record retention requirement",
            "requirement_level": "mandatory",
            "category": "documentation"
        },
        {
            "pattern": r"(?:written|documented).*?(?:policy|procedure).*?(?:required|must)",
            "description": "Written policy requirement",
            "requirement_level": "mandatory",
            "category": "documentation"
        }
    ],
    "insurance": [
        {
            "pattern": r"(?:insurance|coverage).*?(?:required|mandatory|must)",
            "description": "Insurance requirement",
            "requirement_level": "mandatory",
            "category": "insurance"
        },
        {
            "pattern": r"(?:liability|professional).*?(?:insurance|coverage)",
            "description": "Liability insurance requirement",
            "requirement_level": "mandatory",
            "category": "insurance"
        },
        {
            "pattern": r"(?:minimum|coverage).*?(?:\$[\d,]+|\d+\s*(?:million|thousand))",
            "description": "Minimum insurance coverage requirement",
            "requirement_level": "mandatory",
            "category": "insurance"
        }
    ],
    "security": [
        {
            "pattern": r"(?:security|cybersecurity).*?(?:requirement|standard|compliance)",
            "description": "Security requirement",
            "requirement_level": "mandatory",
            "category": "security"
        },
        {
            "pattern": r"(?:background check|security clearance).*?(?:required|must)",
            "description": "Security clearance requirement",
            "requirement_level": "mandatory",
            "category": "security"
        },
        {
            "pattern": r"(?:encryption|secure).*?(?:required|must|shall)",
            "description": "Data security requirement",
            "requirement_level": "mandatory",
            "category": "security"
        }
    ]
}

# Document type specific compliance requirements
DOCUMENT_TYPE_COMPLIANCE = {
    "employment": [
        "regulatory", "training", "documentation", "insurance"
    ],
    "lease": [
        "regulatory", "insurance", "documentation"
    ],
    "loan": [
        "regulatory", "reporting", "documentation"
    ],
    "contract": [
        "regulatory", "certification", "documentation", "insurance"
    ],
    "healthcare": [
        "regulatory", "certification", "training", "documentation", "security"
    ],
    "financial": [
        "regulatory", "reporting", "certification", "documentation", "security"
    ],
    "general": [
        "regulatory", "documentation"
    ]
}

# Compliance severity levels
COMPLIANCE_SEVERITY = {
    "mandatory": {
        "priority": "high",
        "description": "Legal requirement that must be met",
        "color": "red"
    },
    "recommended": {
        "priority": "medium",
        "description": "Best practice recommendation",
        "color": "yellow"
    },
    "optional": {
        "priority": "low",
        "description": "Optional compliance consideration",
        "color": "green"
    }
}