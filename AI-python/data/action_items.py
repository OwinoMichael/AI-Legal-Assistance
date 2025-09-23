"""
Action items data module for document analysis service.
Contains templates and patterns for generating action items based on document types.
"""



# Action item templates by document type
ACTION_ITEM_TEMPLATES = {
    "employment": [
        {
            "id": "emp_1",
            "task": "Review and sign employment contract",
            "days_offset": 7,
            "priority": "high",
            "status": "pending",
            "description": "Carefully review all terms before signing",
            "category": "legal"
        },
        {
            "id": "emp_2",
            "task": "Set up direct deposit and benefits",
            "days_offset": 14,
            "priority": "medium",
            "status": "pending",
            "description": "Provide banking information and select benefits",
            "category": "administrative"
        },
        {
            "id": "emp_3",
            "task": "Review non-compete and IP assignment clauses",
            "days_offset": 3,
            "priority": "high",
            "status": "pending",
            "description": "Understand restrictions on future employment and intellectual property",
            "category": "legal"
        },
        {
            "id": "emp_4",
            "task": "Confirm probationary period terms",
            "days_offset": 5,
            "priority": "medium",
            "status": "pending",
            "description": "Clarify performance expectations and evaluation criteria",
            "category": "administrative"
        }
    ],
    "lease": [
        {
            "id": "lease_1",
            "task": "Schedule property inspection",
            "days_offset": 3,
            "priority": "high",
            "status": "pending",
            "description": "Document any existing damages before move-in",
            "category": "property"
        },
        {
            "id": "lease_2",
            "task": "Review security deposit terms",
            "days_offset": 5,
            "priority": "medium",
            "status": "pending",
            "description": "Understand conditions for deposit return",
            "category": "financial"
        },
        {
            "id": "lease_3",
            "task": "Confirm utilities and services setup",
            "days_offset": 7,
            "priority": "medium",
            "status": "pending",
            "description": "Arrange for electricity, gas, water, internet services",
            "category": "administrative"
        }
    ],
    "loan": [
        {
            "id": "loan_1",
            "task": "Review loan terms and interest rates",
            "days_offset": 5,
            "priority": "high",
            "status": "pending",
            "description": "Understand all fees, rates, and payment schedules",
            "category": "financial"
        },
        {
            "id": "loan_2",
            "task": "Set up automatic payments",
            "days_offset": 10,
            "priority": "medium",
            "status": "pending",
            "description": "Arrange automatic deductions to avoid late fees",
            "category": "administrative"
        }
    ],
    "contract": [
        {
            "id": "contract_1",
            "task": "Review deliverables and timelines",
            "days_offset": 3,
            "priority": "high",
            "status": "pending",
            "description": "Confirm all project requirements and deadlines",
            "category": "project"
        },
        {
            "id": "contract_2",
            "task": "Clarify payment terms and schedule",
            "days_offset": 5,
            "priority": "high",
            "status": "pending",
            "description": "Understand payment milestones and methods",
            "category": "financial"
        }
    ],
    "general": [
        {
            "id": "general_1",
            "task": "Review key terms and conditions",
            "days_offset": 7,
            "priority": "medium",
            "status": "pending",
            "description": "Ensure understanding of all important clauses",
            "category": "legal"
        },
        {
            "id": "general_2",
            "task": "Identify required signatures and dates",
            "days_offset": 3,
            "priority": "high",
            "status": "pending",
            "description": "Complete all necessary documentation",
            "category": "administrative"
        }
    ]
}

# Deadline extraction patterns
DEADLINE_PATTERNS = [
    {
        "pattern": r"(?:must|shall|required).*?(?:within|by)\s*(\d+)\s*(days?|weeks?|months?)",
        "priority": "high",
        "category": "compliance"
    },
    {
        "pattern": r"deadline.*?(\d+)\s*(days?|weeks?|months?)",
        "priority": "medium",
        "category": "deadline"
    },
    {
        "pattern": r"(?:submit|provide|deliver).*?(?:within|by)\s*(\d+)\s*(days?|weeks?|months?)",
        "priority": "medium",
        "category": "submission"
    },
    {
        "pattern": r"(?:expires?|expiration).*?(\d+)\s*(days?|weeks?|months?)",
        "priority": "high",
        "category": "expiration"
    },
    {
        "pattern": r"(?:notice|notification).*?(\d+)\s*(days?|weeks?|months?)",
        "priority": "medium",
        "category": "notice"
    }
]

# Risk-based action item templates
RISK_ACTION_TEMPLATES = {
    "high": {
        "task_prefix": "Address high-risk item",
        "days_offset": 5,
        "priority": "high",
        "category": "risk_mitigation",
        "description_prefix": "Review and mitigate"
    },
    "medium": {
        "task_prefix": "Review medium-risk item",
        "days_offset": 10,
        "priority": "medium",
        "category": "risk_review",
        "description_prefix": "Evaluate and address"
    },
    "low": {
        "task_prefix": "Monitor low-risk item",
        "days_offset": 30,
        "priority": "low",
        "category": "monitoring",
        "description_prefix": "Keep track of"
    }
}