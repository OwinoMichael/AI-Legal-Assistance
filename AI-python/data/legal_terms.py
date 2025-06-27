# Legal terms dictionary - easily expandable
LEGAL_TERMS = {
    # Employment Terms
    "at-will employment": {
        "definition": "Employment that can be terminated by either party at any time without cause",
        "category": "employment",
        "importance": "high",
        "related_terms": ["wrongful termination", "employment contract"]
    },
    "non-disclosure agreement": {
        "definition": "Agreement to keep confidential information secret",
        "category": "confidentiality",
        "importance": "high",
        "related_terms": ["confidentiality", "trade secrets", "proprietary information"]
    },
    "non-compete clause": {
        "definition": "Agreement not to work for competitors for specified period",
        "category": "employment",
        "importance": "high",
        "related_terms": ["restraint of trade", "competition", "solicitation"]
    },
    "intellectual property": {
        "definition": "Creations of the mind such as inventions, designs, and artistic works",
        "category": "legal",
        "importance": "high",
        "related_terms": ["copyright", "patent", "trademark", "trade secret"]
    },
    
    # Financial Terms
    "liquidated damages": {
        "definition": "Predetermined amount of damages specified in contract",
        "category": "financial",
        "importance": "high",
        "related_terms": ["penalty", "breach", "compensation"]
    },
    "indemnification": {
        "definition": "Security or protection against legal responsibility for damages",
        "category": "legal",
        "importance": "medium",
        "related_terms": ["liability", "hold harmless", "defense"]
    },
    "escrow": {
        "definition": "Third party holding of funds until conditions are met",
        "category": "financial",
        "importance": "medium",
        "related_terms": ["deposit", "contingency", "closing"]
    },
    "retainer": {
        "definition": "Advance payment to secure services",
        "category": "financial",
        "importance": "medium",
        "related_terms": ["deposit", "advance", "professional services"]
    },
    
    # Contract Terms
    "force majeure": {
        "definition": "Unforeseeable circumstances that prevent fulfillment of contract",
        "category": "legal",
        "importance": "medium",
        "related_terms": ["act of god", "impossibility", "frustration"]
    },
    "severability": {
        "definition": "If one part of contract is invalid, the rest remains enforceable",
        "category": "legal",
        "importance": "medium",
        "related_terms": ["savings clause", "validity", "enforceability"]
    },
    "governing law": {
        "definition": "Which state or country's laws will be used to interpret the contract",
        "category": "legal",
        "importance": "medium",
        "related_terms": ["jurisdiction", "choice of law", "venue"]
    },
    "arbitration": {
        "definition": "Alternative dispute resolution outside of court system",
        "category": "legal",
        "importance": "medium",
        "related_terms": ["mediation", "adr", "binding arbitration"]
    },
    
    # Real Estate Terms
    "easement": {
        "definition": "Right to use another's property for specific purpose",
        "category": "real_estate",
        "importance": "medium",
        "related_terms": ["right of way", "access", "encumbrance"]
    },
    "lien": {
        "definition": "Legal claim against property as security for debt",
        "category": "real_estate",
        "importance": "high",
        "related_terms": ["mortgage", "security interest", "encumbrance"]
    },
    "title insurance": {
        "definition": "Insurance protecting against defects in property title",
        "category": "real_estate",
        "importance": "medium",
        "related_terms": ["title search", "clear title", "ownership"]
    },
    
    # Business Terms
    "fiduciary duty": {
        "definition": "Legal obligation to act in another's best interest",
        "category": "business",
        "importance": "high",
        "related_terms": ["trust", "loyalty", "care", "good faith"]
    },
    "due diligence": {
        "definition": "Investigation or audit of potential investment or transaction",
        "category": "business",
        "importance": "medium",
        "related_terms": ["investigation", "verification", "audit"]
    },
    "material adverse change": {
        "definition": "Significant negative change affecting business or transaction",
        "category": "business",
        "importance": "high",
        "related_terms": ["mac clause", "material change", "adverse effect"]
    },
    
    # Additional Common Terms
    "breach of contract": {
        "definition": "Failure to perform any term of a contract without excuse",
        "category": "legal",
        "importance": "high",
        "related_terms": ["default", "violation", "non-performance"]
    },
    "statute of limitations": {
        "definition": "Time limit for bringing legal action",
        "category": "legal",
        "importance": "medium",
        "related_terms": ["time bar", "limitation period", "deadline"]
    },
    "consideration": {
        "definition": "Something of value exchanged in a contract",
        "category": "legal",
        "importance": "high",
        "related_terms": ["exchange", "bargain", "value"]
    },
    "warranty": {
        "definition": "Promise that certain facts or conditions are true",
        "category": "legal",
        "importance": "medium",
        "related_terms": ["guarantee", "assurance", "representation"]
    },
    "liability": {
        "definition": "Legal responsibility for one's acts or omissions",
        "category": "legal",
        "importance": "high",
        "related_terms": ["responsibility", "obligation", "accountability"]
    }
}

# Categories for organizing terms
TERM_CATEGORIES = {
    "employment": "Employment & Labor",
    "financial": "Financial & Payment",
    "legal": "General Legal",
    "real_estate": "Real Estate",
    "business": "Business & Corporate",
    "confidentiality": "Confidentiality & Privacy",
    "dispute": "Dispute Resolution"
}

# Importance levels
IMPORTANCE_LEVELS = {
    "high": "Critical - requires careful attention",
    "medium": "Important - should be understood",
    "low": "Good to know - general awareness"
}

def get_terms_by_category(category: str) -> dict:
    """Get all terms in a specific category"""
    return {term: data for term, data in LEGAL_TERMS.items() 
            if data["category"] == category}

def get_high_importance_terms() -> dict:
    """Get all high importance terms"""
    return {term: data for term, data in LEGAL_TERMS.items() 
            if data["importance"] == "high"}

def search_terms(query: str) -> dict:
    """Search terms by keyword"""
    query = query.lower()
    results = {}
    
    for term, data in LEGAL_TERMS.items():
        if (query in term.lower() or 
            query in data["definition"].lower() or
            any(query in related.lower() for related in data["related_terms"])):
            results[term] = data
            
    return results

def get_related_terms(term: str) -> list:
    """Get related terms for a given term"""
    if term in LEGAL_TERMS:
        return LEGAL_TERMS[term]["related_terms"]
    return []