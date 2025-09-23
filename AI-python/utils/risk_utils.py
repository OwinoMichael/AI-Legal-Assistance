"""
Utility functions for contract risk analysis.
This file contains helper functions for working with risk patterns and data.
"""

import re
from typing import Dict, List, Tuple

from data.risk_patterns import (
    RISK_PATTERNS, 
    DOCUMENT_SPECIFIC_RISKS, 
    RISK_CATEGORIES, 
    SEVERITY_LEVELS
)


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


def get_patterns_by_severity(severity_level: str) -> List[Dict]:
    """Get all risk patterns by severity level"""
    if severity_level in RISK_PATTERNS:
        return RISK_PATTERNS[severity_level]
    return []


def get_all_patterns() -> List[Dict]:
    """Get all risk patterns from all severity levels"""
    patterns = []
    for level, pattern_list in RISK_PATTERNS.items():
        patterns.extend(pattern_list)
    return patterns


def get_severity_description(score: int) -> Dict:
    """Get severity level description from score"""
    return SEVERITY_LEVELS.get(score, {"level": "Unknown", "description": "Unknown severity"})


def get_category_info(category: str) -> Dict:
    """Get category information including name, description, and color"""
    return RISK_CATEGORIES.get(category, {
        "name": "Unknown Category",
        "description": "Unknown risk category",
        "color": "#888888"
    })


def search_pattern_in_text(text: str, pattern: Dict) -> List[Dict]:
    """Search for a specific pattern in text and return matches with context"""
    matches = []
    regex = re.compile(pattern["pattern"], re.IGNORECASE)
    
    for match in regex.finditer(text):
        # Get some context around the match
        start = max(0, match.start() - 50)
        end = min(len(text), match.end() + 50)
        context = text[start:end].strip()
        
        matches.append({
            "match": match.group(),
            "start": match.start(),
            "end": match.end(),
            "context": context,
            "pattern_info": pattern
        })
    
    return matches


def analyze_text_for_risks(text: str, doc_type: str = None) -> Dict:
    """Analyze text for all applicable risk patterns"""
    results = {
        "total_risks": 0,
        "risk_summary": {"critical": 0, "high": 0, "medium": 0, "low": 0},
        "category_summary": {},
        "matches": []
    }
    
    # Get patterns based on document type
    if doc_type:
        patterns = get_patterns_by_document_type(doc_type)
    else:
        patterns = get_all_patterns()
    
    # Search for each pattern
    for pattern in patterns:
        matches = search_pattern_in_text(text, pattern)
        if matches:
            results["matches"].extend(matches)
            
            # Update counters
            risk_level = get_risk_level_from_score(pattern["severity_score"])
            results["risk_summary"][risk_level] += len(matches)
            
            category = pattern.get("category", "unknown")
            if category not in results["category_summary"]:
                results["category_summary"][category] = 0
            results["category_summary"][category] += len(matches)
    
    results["total_risks"] = len(results["matches"])
    return results