from typing import Dict, List, Any

from data.compliance_patterns import COMPLIANCE_PATTERNS, COMPLIANCE_SEVERITY, DOCUMENT_TYPE_COMPLIANCE

def get_compliance_patterns_for_document_type(document_type: str) -> Dict[str, List[Dict[str, Any]]]:
    """Get compliance patterns relevant to a specific document type"""
    relevant_categories = DOCUMENT_TYPE_COMPLIANCE.get(document_type.lower(), DOCUMENT_TYPE_COMPLIANCE["general"])
    
    filtered_patterns = {}
    for category in relevant_categories:
        if category in COMPLIANCE_PATTERNS:
            filtered_patterns[category] = COMPLIANCE_PATTERNS[category]
    
    return filtered_patterns

def get_all_compliance_patterns() -> Dict[str, List[Dict[str, Any]]]:
    """Get all compliance patterns"""
    return COMPLIANCE_PATTERNS

def get_compliance_categories() -> List[str]:
    """Get list of all compliance categories"""
    return list(COMPLIANCE_PATTERNS.keys())

def get_compliance_severity_info(requirement_level: str) -> Dict[str, Any]:
    """Get severity information for a compliance requirement level"""
    return COMPLIANCE_SEVERITY.get(requirement_level, COMPLIANCE_SEVERITY["recommended"])

def is_high_priority_compliance(category: str, requirement_level: str) -> bool:
    """Check if a compliance item is high priority"""
    return (requirement_level == "mandatory" or 
            category in ["regulatory", "security", "certification"])