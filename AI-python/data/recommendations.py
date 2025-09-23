
"""
Recommendations data module for document analysis service.
Contains templates and logic for generating recommendations based on analysis results.
"""



# Risk-based recommendation templates
RISK_RECOMMENDATIONS = {
    "high_risk_threshold": {
        "min_count": 1,
        "template": "⚠️ {count} high-risk item{plural} identified. Consider consulting with a legal professional.",
        "priority": "critical"
    },
    "medium_risk_threshold": {
        "min_count": 4,
        "template": "📋 {count} medium-risk item{plural} found. Review each carefully before proceeding.",
        "priority": "high"
    },
    "low_risk_many": {
        "min_count": 10,
        "template": "ℹ️ {count} low-risk item{plural} detected. Consider a general review of terms.",
        "priority": "medium"
    }
}

# Clause-based recommendation templates
CLAUSE_RECOMMENDATIONS = {
    "non-compete": {
        "template": "🚫 Non-compete clause detected. Negotiate scope, duration, and geographic limitations.",
        "priority": "high",
        "category": "restrictive"
    },
    "intellectual-property": {
        "template": "💡 IP assignment clause found. Clarify rights for personal projects and prior work.",
        "priority": "high",
        "category": "intellectual_property"
    },
    "penalty": {
        "template": "💰 Penalty clauses identified. Understand all potential financial consequences.",
        "priority": "high",
        "category": "financial"
    },
    "termination": {
        "template": "📅 Review termination conditions and notice requirements carefully.",
        "priority": "medium",
        "category": "contract_terms"
    },
    "confidentiality": {
        "template": "🤐 Confidentiality clauses present. Understand scope and duration of obligations.",
        "priority": "medium",
        "category": "confidentiality"
    },
    "liability": {
        "template": "⚖️ Liability clauses found. Review limitations and indemnification terms.",
        "priority": "high",
        "category": "liability"
    },
    "arbitration": {
        "template": "🏛️ Arbitration clause detected. Understand dispute resolution procedures.",
        "priority": "medium",
        "category": "dispute_resolution"
    },
    "force-majeure": {
        "template": "🌪️ Force majeure clause present. Review covered events and procedures.",
        "priority": "low",
        "category": "risk_management"
    }
}

# Document type specific recommendations
DOCUMENT_TYPE_RECOMMENDATIONS = {
    "employment": [
        "💼 Verify compensation details including base salary, bonuses, and benefits",
        "📝 Understand probationary period terms and performance expectations",
        "🏠 Check if remote work or flexible arrangements are addressed",
        "📊 Review performance evaluation criteria and advancement opportunities",
        "🎯 Clarify job responsibilities and reporting structure",
        "⏰ Understand overtime policies and work schedule requirements"
    ],
    "lease": [
        "🏠 Inspect property thoroughly before signing",
        "💵 Understand all fees including security deposit, pet fees, and utilities",
        "📋 Review maintenance responsibilities and repair procedures",
        "🚪 Check move-in and move-out procedures and requirements",
        "📞 Verify contact information for property management",
        "🔧 Understand appliance and fixture responsibilities"
    ],
    "loan": [
        "💳 Review interest rates and payment schedules carefully",
        "📊 Understand all fees including origination, processing, and late fees",
        "💰 Clarify prepayment penalties and early payoff options",
        "📈 Review variable vs. fixed rate implications",
        "🏦 Understand default consequences and remedies",
        "📱 Set up payment reminders and automatic payments"
    ],
    "contract": [
        "📋 Review all deliverables and acceptance criteria",
        "💼 Understand change order and scope modification procedures",
        "💰 Clarify payment terms, milestones, and invoicing",
        "📅 Review all deadlines and delivery schedules",
        "🤝 Understand subcontracting and assignment rights",
        "📊 Review performance metrics and quality standards"
    ],
    "insurance": [
        "🛡️ Understand coverage limits and deductibles",
        "📋 Review exclusions and limitations carefully",
        "💸 Understand premium payment schedules and grace periods",
        "📞 Know claims procedures and required documentation",
        "🔄 Review renewal terms and cancellation policies",
        "📊 Compare coverage with other policies to avoid gaps"
    ],
    "healthcare": [
        "🏥 Understand covered services and treatment options",
        "💊 Review prescription drug coverage and formulary",
        "🏥 Check network providers and referral requirements",
        "💰 Understand copayments, deductibles, and out-of-pocket maximums",
        "📋 Review pre-authorization requirements for procedures",
        "📱 Understand telehealth and virtual care options"
    ]
}

# General recommendations (always included)
GENERAL_RECOMMENDATIONS = [
    "📄 Keep copies of all signed documents in a secure location",
    "⏰ Add all important deadlines and dates to your calendar",
    "❓ Ask questions about any unclear terms before signing",
    "👥 Consider having a trusted advisor review important sections",
    "🔍 Read the entire document, not just the summary",
    "📱 Take photos or screenshots of key pages for quick reference"
]

# Priority-based recommendation ordering
RECOMMENDATION_PRIORITY = {
    "critical": 1,
    "high": 2,
    "medium": 3,
    "low": 4
}

# Financial impact recommendations
FINANCIAL_RECOMMENDATIONS = {
    "high_amounts": {
        "min_amount": 10000,
        "template": "💰 Significant financial amounts detected (${amount:,.2f}). Consider professional financial review.",
        "priority": "high"
    },
    "multiple_amounts": {
        "min_count": 5,
        "template": "📊 Multiple financial obligations identified. Create a comprehensive budget plan.",
        "priority": "medium"
    },
    "payment_schedules": {
        "keywords": ["monthly", "quarterly", "annual", "installment"],
        "template": "📅 Payment schedule detected. Set up automated reminders and payments.",
        "priority": "medium"
    }
}