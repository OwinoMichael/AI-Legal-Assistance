from typing import Dict, List, Any, Set

from data.recommendations import CLAUSE_RECOMMENDATIONS, DOCUMENT_TYPE_RECOMMENDATIONS, FINANCIAL_RECOMMENDATIONS, GENERAL_RECOMMENDATIONS, RISK_RECOMMENDATIONS

def get_risk_based_recommendations(risks: List[Any]) -> List[str]:
    """Generate recommendations based on risk analysis"""
    recommendations = []
    
    # Count risks by level
    risk_counts = {"high": 0, "medium": 0, "low": 0}
    for risk in risks:
        level = getattr(risk, 'level', 'medium').lower()
        risk_counts[level] = risk_counts.get(level, 0) + 1
    
    # Generate recommendations based on risk thresholds
    for risk_type, config in RISK_RECOMMENDATIONS.items():
        if risk_type.endswith("_threshold"):
            level = risk_type.replace("_threshold", "").replace("_", "-")
            count = risk_counts.get(level.replace("-", "_"), 0)
            
            if count >= config["min_count"]:
                plural = "s" if count > 1 else ""
                recommendation = config["template"].format(count=count, plural=plural)
                recommendations.append(recommendation)
    
    return recommendations

def get_clause_based_recommendations(clauses: List[Any]) -> List[str]:
    """Generate recommendations based on clause analysis"""
    recommendations = []
    
    # Get unique clause types
    clause_types = {getattr(clause, 'type', '').lower() for clause in clauses}
    
    # Generate recommendations for detected clause types
    for clause_type in clause_types:
        if clause_type in CLAUSE_RECOMMENDATIONS:
            recommendations.append(CLAUSE_RECOMMENDATIONS[clause_type]["template"])
    
    return recommendations

def get_document_type_recommendations(document_type: str) -> List[str]:
    """Get recommendations specific to document type"""
    return DOCUMENT_TYPE_RECOMMENDATIONS.get(document_type.lower(), [])

def get_general_recommendations() -> List[str]:
    """Get general recommendations that apply to all documents"""
    return GENERAL_RECOMMENDATIONS.copy()

def get_financial_recommendations(financial_items: List[Any]) -> List[str]:
    """Generate recommendations based on financial analysis"""
    recommendations = []
    
    if not financial_items:
        return recommendations
    
    # Calculate total amounts
    total_amount = sum(getattr(item, 'amount', 0) for item in financial_items 
                      if hasattr(item, 'amount') and item.amount)
    
    # High amount recommendation
    if total_amount >= FINANCIAL_RECOMMENDATIONS["high_amounts"]["min_amount"]:
        recommendation = FINANCIAL_RECOMMENDATIONS["high_amounts"]["template"].format(amount=total_amount)
        recommendations.append(recommendation)
    
    # Multiple amounts recommendation
    if len(financial_items) >= FINANCIAL_RECOMMENDATIONS["multiple_amounts"]["min_count"]:
        recommendations.append(FINANCIAL_RECOMMENDATIONS["multiple_amounts"]["template"])
    
    # Payment schedule recommendation
    payment_keywords = FINANCIAL_RECOMMENDATIONS["payment_schedules"]["keywords"]
    for item in financial_items:
        description = getattr(item, 'description', '').lower()
        if any(keyword in description for keyword in payment_keywords):
            recommendations.append(FINANCIAL_RECOMMENDATIONS["payment_schedules"]["template"])
            break
    
    return recommendations

def sort_recommendations_by_priority(recommendations: List[str]) -> List[str]:
    """Sort recommendations by priority (critical first)"""
    # This is a simplified version - in a real implementation, 
    # you might want to track priority metadata with each recommendation
    
    priority_order = ["⚠️", "💰", "🚫", "💡", "⚖️", "📋", "💼", "🏠", "📄"]
    
    def get_priority_score(rec: str) -> int:
        for i, emoji in enumerate(priority_order):
            if rec.startswith(emoji):
                return i
        return len(priority_order)  # Default priority for unknown emojis
    
    return sorted(recommendations, key=get_priority_score)

def get_recommendation_categories() -> List[str]:
    """Get all available recommendation categories"""
    return list(CLAUSE_RECOMMENDATIONS.keys())

def filter_recommendations_by_category(
    recommendations: List[str], 
    categories: List[str]
) -> List[str]:
    """Filter recommendations by specific categories"""
    # This would require tracking category metadata with recommendations
    # For now, return all recommendations
    return recommendations

def get_max_recommendations_per_category() -> int:
    """Get maximum number of recommendations per category"""
    return 3  # Configurable limit to prevent overwhelming users