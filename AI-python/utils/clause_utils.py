from typing import Dict, List
from data.clause_patterns import CLAUSE_PATTERNS, DOCUMENT_SPECIFIC_CLAUSES


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