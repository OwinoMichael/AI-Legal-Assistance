from datetime import datetime, timedelta
from typing import Dict, List, Any

from data.action_items import ACTION_ITEM_TEMPLATES, DEADLINE_PATTERNS, RISK_ACTION_TEMPLATES



def get_action_items_for_document_type(document_type: str) -> List[Dict[str, Any]]:
    """Get action item templates for a specific document type"""
    return ACTION_ITEM_TEMPLATES.get(document_type.lower(), ACTION_ITEM_TEMPLATES.get("general", []))

def get_deadline_patterns() -> List[Dict[str, Any]]:
    """Get all deadline extraction patterns"""
    return DEADLINE_PATTERNS

def get_risk_action_template(risk_level: str) -> Dict[str, Any]:
    """Get action item template for a specific risk level"""
    return RISK_ACTION_TEMPLATES.get(risk_level.lower(), RISK_ACTION_TEMPLATES["medium"])

def create_action_item_with_deadline(template: Dict[str, Any], base_date: datetime = None) -> Dict[str, Any]:
    """Create an action item with calculated deadline"""
    if base_date is None:
        base_date = datetime.now()
    
    action_item = template.copy()
    days_offset = action_item.pop("days_offset", 7)
    action_item["deadline"] = (base_date + timedelta(days=days_offset)).isoformat()
    
    return action_item

def get_time_multiplier(unit: str) -> int:
    """Get multiplier for converting time units to days"""
    unit_lower = unit.lower()
    if "week" in unit_lower:
        return 7
    elif "month" in unit_lower:
        return 30
    elif "year" in unit_lower:
        return 365
    else:
        return 1  # Default to days