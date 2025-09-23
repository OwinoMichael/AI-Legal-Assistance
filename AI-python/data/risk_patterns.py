"""
Comprehensive risk patterns and configuration data for legal and financial document analysis.
This file contains extensive risk patterns covering contracts, leases, employment, loans, and financial documents.
"""

from typing import Dict, List

# Comprehensive risk patterns organized by severity level
RISK_PATTERNS = {
    "critical": [
        # Financial risks - Critical
        {
            "pattern": r"unlimited\s+liability",
            "title": "Unlimited Liability Exposure",
            "description": "No cap on potential financial responsibility - could result in catastrophic financial loss",
            "category": "financial",
            "severity_score": 10,
            "mitigation": "Negotiate liability caps or limitation clauses",
            "applicable_docs": ["all"]
        },
        {
            "pattern": r"personal\s+guarantee",
            "title": "Personal Guarantee Required",
            "description": "Personal assets may be at risk if business defaults",
            "category": "financial",
            "severity_score": 9,
            "mitigation": "Consider corporate guarantees or liability limitations",
            "applicable_docs": ["loan", "lease", "service", "credit"]
        },
        {
            "pattern": r"cross[\s-]default",
            "title": "Cross-Default Clause",
            "description": "Default on one obligation triggers default on all related obligations",
            "category": "financial",
            "severity_score": 10,
            "mitigation": "Negotiate removal or narrowing of cross-default provisions",
            "applicable_docs": ["loan", "credit", "bond"]
        },
        {
            "pattern": r"acceleration\s+clause",
            "title": "Acceleration Clause",
            "description": "Entire debt becomes due immediately upon default",
            "category": "financial",
            "severity_score": 9,
            "mitigation": "Negotiate grace periods and cure rights",
            "applicable_docs": ["loan", "mortgage", "credit"]
        },
        {
            "pattern": r"liquidated\s+damages.*?\$[\d,]+(?:\.\d{2})?",
            "title": "High Liquidated Damages",
            "description": "Predetermined penalties that could be substantial",
            "category": "financial",
            "severity_score": 8,
            "mitigation": "Negotiate reasonable damage amounts and triggers",
            "applicable_docs": ["service", "construction", "employment"]
        },
        {
            "pattern": r"penalties.*?(?:triple|treble)\s+damages",
            "title": "Treble Damages",
            "description": "Damages multiplied by three for violations",
            "category": "financial",
            "severity_score": 9,
            "mitigation": "Negotiate standard damages only",
            "applicable_docs": ["all"]
        },
        
        # Employment risks - Critical
        {
            "pattern": r"non-compete.*?(?:\d+)\s*(?:years?)",
            "title": "Long-term Non-Compete",
            "description": "Extended non-compete period may severely limit future employment",
            "category": "employment",
            "severity_score": 9,
            "mitigation": "Negotiate shorter duration and narrower scope",
            "applicable_docs": ["employment", "consulting"]
        },
        {
            "pattern": r"all\s+intellectual\s+property.*?assign",
            "title": "Broad IP Assignment",
            "description": "All intellectual property rights assigned to employer",
            "category": "employment",
            "severity_score": 8,
            "mitigation": "Negotiate exceptions for personal projects",
            "applicable_docs": ["employment", "consulting", "development"]
        },
        {
            "pattern": r"work\s+for\s+hire.*?(?:all|any)\s+work",
            "title": "Broad Work for Hire",
            "description": "All work product belongs to employer, including personal time",
            "category": "employment",
            "severity_score": 8,
            "mitigation": "Limit scope to work-related activities only",
            "applicable_docs": ["employment", "consulting", "freelance"]
        },
        
        # Legal risks - Critical
        {
            "pattern": r"waiver\s+of\s+jury\s+trial",
            "title": "Jury Trial Waiver",
            "description": "Waives constitutional right to jury trial",
            "category": "legal",
            "severity_score": 8,
            "mitigation": "Consider retaining jury trial rights",
            "applicable_docs": ["all"]
        },
        {
            "pattern": r"irrevocable.*?power\s+of\s+attorney",
            "title": "Irrevocable Power of Attorney",
            "description": "Grants permanent legal authority that cannot be revoked",
            "category": "legal",
            "severity_score": 10,
            "mitigation": "Avoid or limit scope and duration",
            "applicable_docs": ["all"]
        },
        {
            "pattern": r"confession\s+of\s+judgment",
            "title": "Confession of Judgment",
            "description": "Pre-authorized court judgment without trial",
            "category": "legal",
            "severity_score": 10,
            "mitigation": "Remove this clause entirely",
            "applicable_docs": ["loan", "credit", "commercial"]
        }
    ],
    
    "high": [
        # Financial risks - High
        {
            "pattern": r"penalty.*?\$[\d,]+",
            "title": "Monetary Penalties",
            "description": "Financial penalties specified for various violations",
            "category": "financial",
            "severity_score": 7,
            "mitigation": "Review penalty triggers and negotiate amounts",
            "applicable_docs": ["all"]
        },
        {
            "pattern": r"interest.*?rate.*?(\d+(?:\.\d+)?)%",
            "title": "High Interest Rate",
            "description": "Interest charges that may be above market rates",
            "category": "financial",
            "severity_score": 6,
            "mitigation": "Compare rates and negotiate if necessary",
            "applicable_docs": ["loan", "credit", "financing"]
        },
        {
            "pattern": r"variable\s+(?:interest\s+)?rate",
            "title": "Variable Interest Rate",
            "description": "Interest rate can change, potentially increasing costs",
            "category": "financial",
            "severity_score": 6,
            "mitigation": "Negotiate rate caps or conversion options",
            "applicable_docs": ["loan", "credit", "mortgage"]
        },
        {
            "pattern": r"prepayment\s+penalty",
            "title": "Prepayment Penalty",
            "description": "Penalty for paying off debt early",
            "category": "financial",
            "severity_score": 6,
            "mitigation": "Negotiate removal or step-down provisions",
            "applicable_docs": ["loan", "mortgage", "credit"]
        },
        {
            "pattern": r"joint\s+and\s+several\s+liability",
            "title": "Joint and Several Liability",
            "description": "Each party responsible for full obligation amount",
            "category": "financial",
            "severity_score": 7,
            "mitigation": "Negotiate several liability only",
            "applicable_docs": ["lease", "partnership", "loan"]
        },
        {
            "pattern": r"(?:security\s+interest|collateral).*?(?:all|substantially\s+all)",
            "title": "Blanket Security Interest",
            "description": "Creditor has claim on all or substantially all assets",
            "category": "financial",
            "severity_score": 7,
            "mitigation": "Limit collateral to specific assets",
            "applicable_docs": ["loan", "credit", "financing"]
        },
        
        # Employment risks - High
        {
            "pattern": r"terminate.*?(?:without\s+cause|at\s+will)",
            "title": "At-Will Termination",
            "description": "Employment or contract can be terminated without cause",
            "category": "employment",
            "severity_score": 7,
            "mitigation": "Negotiate severance packages or notice periods",
            "applicable_docs": ["employment", "consulting"]
        },
        {
            "pattern": r"no\s+severance|without\s+severance",
            "title": "No Severance Pay",
            "description": "No compensation upon termination",
            "category": "employment",
            "severity_score": 6,
            "mitigation": "Negotiate severance package",
            "applicable_docs": ["employment"]
        },
        {
            "pattern": r"(?:overtime|comp\s+time).*?exempt",
            "title": "Overtime Exemption",
            "description": "Position may be exempt from overtime pay requirements",
            "category": "employment",
            "severity_score": 6,
            "mitigation": "Verify exemption status and negotiate base salary accordingly",
            "applicable_docs": ["employment"]
        },
        {
            "pattern": r"non-solicitation.*?(?:customers?|clients?|employees?)",
            "title": "Non-Solicitation Clause",
            "description": "Restrictions on soliciting customers, clients, or employees",
            "category": "employment",
            "severity_score": 6,
            "mitigation": "Negotiate reasonable scope and duration",
            "applicable_docs": ["employment", "consulting", "partnership"]
        },
        
        # Legal risks - High
        {
            "pattern": r"indemnif.*?(?:all|any).*?(?:claims|damages)",
            "title": "Broad Indemnification",
            "description": "Requirement to indemnify against broad range of claims",
            "category": "legal",
            "severity_score": 7,
            "mitigation": "Limit indemnification scope and add carve-outs",
            "applicable_docs": ["all"]
        },
        {
            "pattern": r"hold\s+harmless",
            "title": "Hold Harmless Clause",
            "description": "Agreement to absorb liability for other party's actions",
            "category": "legal",
            "severity_score": 7,
            "mitigation": "Negotiate mutual hold harmless or limitations",
            "applicable_docs": ["all"]
        },
        {
            "pattern": r"waiver.*?(?:claims|rights|defenses)",
            "title": "Rights Waiver",
            "description": "Waiver of legal rights or defenses",
            "category": "legal",
            "severity_score": 7,
            "mitigation": "Retain important legal rights and defenses",
            "applicable_docs": ["all"]
        },
        {
            "pattern": r"attorneys?[\s']fees.*?(?:prevailing|successful)\s+party",
            "title": "Attorney Fees - Prevailing Party",
            "description": "Winner of legal dispute gets attorney fees paid",
            "category": "legal",
            "severity_score": 6,
            "mitigation": "Ensure reciprocal fee shifting or removal",
            "applicable_docs": ["all"]
        },
        
        # Contract risks - High
        {
            "pattern": r"automatic\s+renewal",
            "title": "Automatic Renewal Clause",
            "description": "Contract automatically renews without explicit consent",
            "category": "contractual",
            "severity_score": 6,
            "mitigation": "Set calendar reminders for renewal dates",
            "applicable_docs": ["service", "lease", "subscription"]
        },
        {
            "pattern": r"confidential.*?perpetual",
            "title": "Perpetual Confidentiality",
            "description": "Confidentiality obligations last indefinitely",
            "category": "confidentiality",
            "severity_score": 6,
            "mitigation": "Negotiate time limits on confidentiality",
            "applicable_docs": ["all"]
        },
        {
            "pattern": r"exclusive\s+(?:dealing|relationship|agreement)",
            "title": "Exclusivity Clause",
            "description": "Restricts ability to work with competitors or alternatives",
            "category": "contractual",
            "severity_score": 6,
            "mitigation": "Negotiate exceptions or shorter exclusivity periods",
            "applicable_docs": ["service", "distribution", "partnership"]
        }
    ],
    
    "medium": [
        # Financial risks - Medium
        {
            "pattern": r"late\s+(?:fee|charge|penalty)",
            "title": "Late Payment Fees",
            "description": "Additional charges apply for late payments",
            "category": "financial",
            "severity_score": 4,
            "mitigation": "Understand fee structure and payment deadlines",
            "applicable_docs": ["all"]
        },
        {
            "pattern": r"security\s+deposit.*?\$[\d,]+",
            "title": "Security Deposit Required",
            "description": "Upfront deposit required, may be forfeited",
            "category": "financial",
            "severity_score": 4,
            "mitigation": "Understand conditions for deposit return",
            "applicable_docs": ["lease", "service", "rental"]
        },
        {
            "pattern": r"minimum\s+payment.*?\$[\d,]+",
            "title": "Minimum Payment Requirements",
            "description": "Required minimum payments regardless of usage",
            "category": "financial",
            "severity_score": 4,
            "mitigation": "Negotiate usage-based or lower minimums",
            "applicable_docs": ["service", "credit", "subscription"]
        },
        {
            "pattern": r"credit\s+check|credit\s+report",
            "title": "Credit Check Required",
            "description": "Authorization for credit checks may impact credit score",
            "category": "financial",
            "severity_score": 3,
            "mitigation": "Understand when and how credit will be checked",
            "applicable_docs": ["lease", "credit", "financing"]
        },
        {
            "pattern": r"guarantor|co-signer",
            "title": "Guarantor Required",
            "description": "Third party must guarantee obligations",
            "category": "financial",
            "severity_score": 5,
            "mitigation": "Consider alternatives or limit guarantor exposure",
            "applicable_docs": ["lease", "loan", "credit"]
        },
        
        # Legal risks - Medium
        {
            "pattern": r"dispute.*?arbitration",
            "title": "Mandatory Arbitration",
            "description": "Disputes must be resolved through arbitration, not courts",
            "category": "legal",
            "severity_score": 5,
            "mitigation": "Understand arbitration process and costs",
            "applicable_docs": ["all"]
        },
        {
            "pattern": r"governing\s+law.*?(?:state|jurisdiction)",
            "title": "Governing Law Clause",
            "description": "Contract governed by laws of specific jurisdiction",
            "category": "legal",
            "severity_score": 3,
            "mitigation": "Understand implications of governing law",
            "applicable_docs": ["all"]
        },
        {
            "pattern": r"venue.*?(?:jurisdiction|court)",
            "title": "Venue Selection",
            "description": "Legal disputes must be filed in specific location",
            "category": "legal",
            "severity_score": 4,
            "mitigation": "Consider convenience and cost of specified venue",
            "applicable_docs": ["all"]
        },
        {
            "pattern": r"statute\s+of\s+limitations.*?(?:waive|extend)",
            "title": "Statute of Limitations Modification",
            "description": "Changes to time limits for legal claims",
            "category": "legal",
            "severity_score": 4,
            "mitigation": "Understand impact on legal remedy timeframes",
            "applicable_docs": ["all"]
        },
        
        # Contract risks - Medium
        {
            "pattern": r"notice.*?(\d+)\s*days?",
            "title": "Notice Period Required",
            "description": "Advance notice required for termination or changes",
            "category": "contractual",
            "severity_score": 3,
            "mitigation": "Calendar notice deadlines",
            "applicable_docs": ["all"]
        },
        {
            "pattern": r"assignment.*?(?:consent|approval)",
            "title": "Assignment Restrictions",
            "description": "Limitations on transferring contract rights",
            "category": "contractual",
            "severity_score": 4,
            "mitigation": "Understand when consent is required",
            "applicable_docs": ["all"]
        },
        {
            "pattern": r"modification.*?(?:writing|written)",
            "title": "Written Modification Required",
            "description": "Changes must be documented in writing",
            "category": "contractual",
            "severity_score": 3,
            "mitigation": "Ensure all changes are properly documented",
            "applicable_docs": ["all"]
        },
        {
            "pattern": r"time\s+is\s+of\s+the\s+essence",
            "title": "Time is of the Essence",
            "description": "Strict adherence to deadlines is required",
            "category": "contractual",
            "severity_score": 4,
            "mitigation": "Carefully manage all deadlines and deliverables",
            "applicable_docs": ["all"]
        },
        {
            "pattern": r"material\s+adverse\s+(?:change|effect)",
            "title": "Material Adverse Change",
            "description": "Contract may be affected by significant negative changes",
            "category": "contractual",
            "severity_score": 5,
            "mitigation": "Understand what constitutes material adverse change",
            "applicable_docs": ["all"]
        },
        
        # Performance risks - Medium
        {
            "pattern": r"performance\s+bond",
            "title": "Performance Bond Required",
            "description": "Bond required to guarantee performance",
            "category": "performance",
            "severity_score": 4,
            "mitigation": "Factor bond costs into pricing",
            "applicable_docs": ["construction", "service", "government"]
        },
        {
            "pattern": r"(?:service\s+level|performance)\s+(?:agreement|standards)",
            "title": "Service Level Requirements",
            "description": "Specific performance standards must be met",
            "category": "performance",
            "severity_score": 4,
            "mitigation": "Ensure SLA targets are achievable",
            "applicable_docs": ["service", "technology", "outsourcing"]
        },
        {
            "pattern": r"key\s+(?:man|person)\s+(?:insurance|clause)",
            "title": "Key Person Requirements",
            "description": "Specific individuals must remain involved",
            "category": "performance",
            "severity_score": 4,
            "mitigation": "Plan for key person transitions",
            "applicable_docs": ["service", "consulting", "partnership"]
        }
    ],
    
    "low": [
        # Standard clauses - Low risk but should be noted
        {
            "pattern": r"entire\s+agreement",
            "title": "Entire Agreement Clause",
            "description": "Contract represents complete agreement between parties",
            "category": "contractual",
            "severity_score": 2,
            "mitigation": "Ensure all important terms are in writing",
            "applicable_docs": ["all"]
        },
        {
            "pattern": r"severability",
            "title": "Severability Clause",
            "description": "Invalid provisions don't void entire contract",
            "category": "contractual",
            "severity_score": 1,
            "mitigation": "Generally favorable provision",
            "applicable_docs": ["all"]
        },
        {
            "pattern": r"force\s+majeure",
            "title": "Force Majeure Clause",
            "description": "Protection for unforeseeable circumstances",
            "category": "legal",
            "severity_score": 1,
            "mitigation": "Understand what events qualify",
            "applicable_docs": ["all"]
        },
        {
            "pattern": r"counterparts",
            "title": "Counterpart Execution",
            "description": "Contract can be signed in separate copies",
            "category": "contractual",
            "severity_score": 1,
            "mitigation": "Standard provision, no action needed",
            "applicable_docs": ["all"]
        },
        {
            "pattern": r"headings.*?(?:convenience|reference)",
            "title": "Headings Clause",
            "description": "Contract headings are for reference only",
            "category": "contractual",
            "severity_score": 1,
            "mitigation": "Standard provision, no action needed",
            "applicable_docs": ["all"]
        },
        {
            "pattern": r"successors\s+and\s+assigns",
            "title": "Successors and Assigns",
            "description": "Contract binds future owners/successors",
            "category": "contractual",
            "severity_score": 2,
            "mitigation": "Understand binding nature on successors",
            "applicable_docs": ["all"]
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
            "severity_score": 3,
            "mitigation": "Understand probationary terms and timeline"
        },
        {
            "pattern": r"(?:bonus|commission).*?discretionary",
            "title": "Discretionary Compensation",
            "description": "Bonus or commission payments at employer's discretion",
            "category": "employment",
            "severity_score": 5,
            "mitigation": "Negotiate objective criteria for discretionary pay"
        },
        {
            "pattern": r"background\s+check",
            "title": "Background Check Required",
            "description": "Employment contingent on background verification",
            "category": "employment",
            "severity_score": 3,
            "mitigation": "Understand scope and timing of background checks"
        },
        {
            "pattern": r"drug\s+(?:test|screening)",
            "title": "Drug Testing Required",
            "description": "Pre-employment or ongoing drug testing",
            "category": "employment",
            "severity_score": 3,
            "mitigation": "Understand testing policy and procedures"
        }
    ],
    
    "lease": [
        {
            "pattern": r"triple\s+net\s+lease|NNN",
            "title": "Triple Net Lease",
            "description": "Tenant pays taxes, insurance, and maintenance",
            "category": "real_estate",
            "severity_score": 6,
            "mitigation": "Budget for additional expenses beyond rent"
        },
        {
            "pattern": r"percentage\s+rent",
            "title": "Percentage Rent",
            "description": "Rent based on percentage of gross sales",
            "category": "real_estate",
            "severity_score": 5,
            "mitigation": "Negotiate reasonable percentage and breakpoints"
        },
        {
            "pattern": r"right\s+of\s+first\s+refusal",
            "title": "Right of First Refusal",
            "description": "Landlord has right to match competing offers",
            "category": "real_estate",
            "severity_score": 4,
            "mitigation": "Understand process and timing requirements"
        },
        {
            "pattern": r"(?:use|occupancy)\s+clause",
            "title": "Use Restrictions",
            "description": "Limitations on how property can be used",
            "category": "real_estate",
            "severity_score": 4,
            "mitigation": "Ensure use clause matches business needs"
        },
        {
            "pattern": r"co-tenancy\s+clause",
            "title": "Co-Tenancy Requirements",
            "description": "Lease terms depend on other tenants",
            "category": "real_estate",
            "severity_score": 5,
            "mitigation": "Understand impact of other tenant departures"
        }
    ],
    
    "loan": [
        {
            "pattern": r"balloon\s+payment",
            "title": "Balloon Payment",
            "description": "Large final payment at end of loan term",
            "category": "financial",
            "severity_score": 7,
            "mitigation": "Plan for balloon payment or refinancing"
        },
        {
            "pattern": r"call\s+provision",
            "title": "Call Provision",
            "description": "Lender can demand immediate repayment",
            "category": "financial",
            "severity_score": 8,
            "mitigation": "Understand call triggers and negotiate protections"
        },
        {
            "pattern": r"debt[\s-]to[\s-]income\s+ratio",
            "title": "Debt-to-Income Covenant",
            "description": "Must maintain specified debt-to-income ratio",
            "category": "financial",
            "severity_score": 6,
            "mitigation": "Monitor ratio and plan for compliance"
        },
        {
            "pattern": r"negative\s+covenant",
            "title": "Negative Covenants",
            "description": "Restrictions on business activities",
            "category": "financial",
            "severity_score": 5,
            "mitigation": "Understand all prohibited activities"
        },
        {
            "pattern": r"material\s+adverse\s+(?:change|effect)",
            "title": "Material Adverse Change",
            "description": "Lender can act on significant negative changes",
            "category": "financial",
            "severity_score": 6,
            "mitigation": "Understand MAC definition and implications"
        }
    ],
    
    "insurance": [
        {
            "pattern": r"exclusion.*?(?:act\s+of\s+god|war|nuclear)",
            "title": "Major Exclusions",
            "description": "Significant events excluded from coverage",
            "category": "insurance",
            "severity_score": 6,
            "mitigation": "Understand all policy exclusions"
        },
        {
            "pattern": r"deductible.*?\$[\d,]+",
            "title": "High Deductible",
            "description": "Significant out-of-pocket expense before coverage",
            "category": "insurance",
            "severity_score": 4,
            "mitigation": "Budget for deductible amounts"
        },
        {
            "pattern": r"co-insurance.*?(\d+)%",
            "title": "Co-Insurance Requirement",
            "description": "Insured must pay percentage of covered losses",
            "category": "insurance",
            "severity_score": 4,
            "mitigation": "Understand co-insurance percentages"
        },
        {
            "pattern": r"claims\s+made\s+basis",
            "title": "Claims-Made Coverage",
            "description": "Coverage only for claims made during policy period",
            "category": "insurance",
            "severity_score": 5,
            "mitigation": "Consider extended reporting period"
        }
    ],
    
    "credit": [
        {
            "pattern": r"universal\s+default",
            "title": "Universal Default",
            "description": "Default on other obligations affects this credit",
            "category": "financial",
            "severity_score": 8,
            "mitigation": "Manage all credit obligations carefully"
        },
        {
            "pattern": r"credit\s+limit\s+decrease",
            "title": "Credit Limit Reduction",
            "description": "Lender can reduce available credit",
            "category": "financial",
            "severity_score": 6,
            "mitigation": "Understand conditions for limit changes"
        },
        {
            "pattern": r"cash\s+advance\s+fee",
            "title": "Cash Advance Fees",
            "description": "Additional fees for cash advances",
            "category": "financial",
            "severity_score": 4,
            "mitigation": "Avoid cash advances when possible"
        },
        {
            "pattern": r"over[\s-]limit\s+fee",
            "title": "Over-Limit Fees",
            "description": "Penalties for exceeding credit limit",
            "category": "financial",
            "severity_score": 4,
            "mitigation": "Monitor credit usage carefully"
        }
    ],
    
    "construction": [
        {
            "pattern": r"mechanic[s']?\s+lien",
            "title": "Mechanic's Lien Rights",
            "description": "Contractors can place liens on property",
            "category": "construction",
            "severity_score": 7,
            "mitigation": "Ensure proper lien waivers and payments"
        },
        {
            "pattern": r"change\s+order",
            "title": "Change Order Process",
            "description": "Procedures for modifying construction scope",
            "category": "construction",
            "severity_score": 4,
            "mitigation": "Understand change order approval process"
        },
        {
            "pattern": r"substantial\s+completion",
            "title": "Substantial Completion",
            "description": "Definition of project completion may be subjective",
            "category": "construction",
            "severity_score": 4,
            "mitigation": "Define completion criteria clearly"
        },
        {
            "pattern": r"warranty.*?(?:one|1)\s+year",
            "title": "Limited Warranty Period",
            "description": "Construction warranty may be limited",
            "category": "construction",
            "severity_score": 4,
            "mitigation": "Understand warranty scope and duration"
        }
    ]
}

# Expanded risk categories with descriptions
RISK_CATEGORIES = {
    "financial": {
        "name": "Financial Risk",
        "description": "Risks involving money, payments, financial obligations, or economic losses",
        "color": "#FF4444",
        "icon": "💰"
    },
    "employment": {
        "name": "Employment Risk", 
        "description": "Risks related to employment terms, conditions, and workplace obligations",
        "color": "#FF8C00",
        "icon": "👔"
    },
    "legal": {
        "name": "Legal Risk",
        "description": "Risks involving legal obligations, compliance, and judicial procedures",
        "color": "#8B0000",
        "icon": "⚖️"
    },
    "contractual": {
        "name": "Contractual Risk",
        "description": "Risks related to contract terms, performance, and enforcement",
        "color": "#4169E1",
        "icon": "📋"
    },
    "confidentiality": {
        "name": "Confidentiality Risk",
        "description": "Risks involving confidential information, trade secrets, and proprietary data",
        "color": "#9932CC",
        "icon": "🔒"
    },
    "real_estate": {
        "name": "Real Estate Risk",
        "description": "Risks specific to property transactions, leases, and real estate operations",
        "color": "#228B22",
        "icon": "🏢"
    },
    "insurance": {
        "name": "Insurance Risk",
        "description": "Risks related to insurance coverage, claims, and policy limitations",
        "color": "#FF6347",
        "icon": "🛡️"
    },
    "construction": {
        "name": "Construction Risk",
        "description": "Risks specific to construction projects, building contracts, and development",
        "color": "#DAA520",
        "icon": "🏗️"
    },
    "performance": {
        "name": "Performance Risk",
        "description": "Risks related to performance standards, service levels, and delivery obligations",
        "color": "#20B2AA",
        "icon": "📊"
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