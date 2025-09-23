from data.legal_terms import LEGAL_TERMS


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