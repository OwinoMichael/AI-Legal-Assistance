import re
from typing import List, Dict, Optional
from datetime import datetime
from models.schemas import FinancialItem
import logging

logger = logging.getLogger(__name__)

class FinancialExtractor:
    """Extract financial information from documents"""
    
    def __init__(self):
        # Currency patterns
        self.currency_patterns = {
            'usd': [
                r'\$[\d,]+(?:\.\d{2})?',
                r'USD\s*[\d,]+(?:\.\d{2})?',
                r'dollars?\s*[\d,]+(?:\.\d{2})?',
                r'[\d,]+(?:\.\d{2})?\s*dollars?'
            ],
            'eur': [
                r'€[\d,]+(?:\.\d{2})?',
                r'EUR\s*[\d,]+(?:\.\d{2})?',
                r'euros?\s*[\d,]+(?:\.\d{2})?'
            ],
            'gbp': [
                r'£[\d,]+(?:\.\d{2})?',
                r'GBP\s*[\d,]+(?:\.\d{2})?',
                r'pounds?\s*[\d,]+(?:\.\d{2})?'
            ]
        }
        
        # Financial term patterns
        self.financial_terms = {
            'salary': [
                r'salary.*?\$?[\d,]+(?:\.\d{2})?',
                r'annual.*?compensation.*?\$?[\d,]+(?:\.\d{2})?',
                r'base.*?pay.*?\$?[\d,]+(?:\.\d{2})?'
            ],
            'bonus': [
                r'bonus.*?\$?[\d,]+(?:\.\d{2})?',
                r'incentive.*?\$?[\d,]+(?:\.\d{2})?',
                r'commission.*?\$?[\d,]+(?:\.\d{2})?'
            ],
            'penalty': [
                r'penalty.*?\$?[\d,]+(?:\.\d{2})?',
                r'fine.*?\$?[\d,]+(?:\.\d{2})?',
                r'liquidated.*?damages.*?\$?[\d,]+(?:\.\d{2})?'
            ],
            'fee': [
                r'fee.*?\$?[\d,]+(?:\.\d{2})?',
                r'cost.*?\$?[\d,]+(?:\.\d{2})?',
                r'charge.*?\$?[\d,]+(?:\.\d{2})?'
            ],
            'deposit': [
                r'deposit.*?\$?[\d,]+(?:\.\d{2})?',
                r'security.*?\$?[\d,]+(?:\.\d{2})?'
            ]
        }
    
    def extract_financial_information(self, text: str) -> List[FinancialItem]:
        """Extract all financial information from text"""
        financial_items = []
        
        # Extract currency amounts
        financial_items.extend(self._extract_currency_amounts(text))
        
        # Extract financial terms with amounts
        financial_items.extend(self._extract_financial_terms(text))
        
        # Extract payment schedules
        financial_items.extend(self._extract_payment_schedules(text))
        
        # Remove duplicates and sort by location
        financial_items = self._deduplicate_financial_items(financial_items)
        financial_items.sort(key=lambda x: x.location or 0)
        
        return financial_items
    
    def _extract_currency_amounts(self, text: str) -> List[FinancialItem]:
        """Extract basic currency amounts"""
        items = []
        
        for currency, patterns in self.currency_patterns.items():
            for pattern in patterns:
                matches = re.finditer(pattern, text, re.IGNORECASE)
                for match in matches:
                    amount = self._parse_amount(match.group())
                    if amount:
                        # Get context around the match
                        start = max(0, match.start() - 50)
                        end = min(len(text), match.end() + 50)
                        context = text[start:end].strip()
                        
                        items.append(FinancialItem(
                            type="amount",
                            amount=amount,
                            currency=currency.upper(),
                            description=f"Currency amount: {match.group()}",
                            context=context,
                            location=match.start(),
                            confidence=0.8
                        ))
        
        return items
    
    def _extract_financial_terms(self, text: str) -> List[FinancialItem]:
        """Extract financial terms with associated amounts"""
        items = []
        
        for term_type, patterns in self.financial_terms.items():
            for pattern in patterns:
                matches = re.finditer(pattern, text, re.IGNORECASE)
                for match in matches:
                    # Extract amount from the match
                    amount_match = re.search(r'\$?[\d,]+(?:\.\d{2})?', match.group())
                    if amount_match:
                        amount = self._parse_amount(amount_match.group())
                        if amount:
                            # Get broader context
                            start = max(0, match.start() - 100)
                            end = min(len(text), match.end() + 100)
                            context = text[start:end].strip()
                            
                            items.append(FinancialItem(
                                type=term_type,
                                amount=amount,
                                currency="USD",  # Default to USD
                                description=f"{term_type.title()}: {match.group()}",
                                context=context,
                                location=match.start(),
                                confidence=0.9
                            ))
        
        return items
    
    def _extract_payment_schedules(self, text: str) -> List[FinancialItem]:
        """Extract payment schedule information"""
        items = []
        
        # Payment frequency patterns
        frequency_patterns = [
            r'(?:monthly|weekly|quarterly|annually).*?payment.*?\$?[\d,]+(?:\.\d{2})?',
            r'payment.*?(?:monthly|weekly|quarterly|annually).*?\$?[\d,]+(?:\.\d{2})?',
            r'(?:bi-weekly|biweekly).*?payment.*?\$?[\d,]+(?:\.\d{2})?'
        ]
        
        for pattern in frequency_patterns:
            matches = re.finditer(pattern, text, re.IGNORECASE)
            for match in matches:
                # Extract amount
                amount_match = re.search(r'\$?[\d,]+(?:\.\d{2})?', match.group())
                if amount_match:
                    amount = self._parse_amount(amount_match.group())
                    if amount:
                        # Extract frequency
                        frequency_match = re.search(
                            r'(monthly|weekly|quarterly|annually|bi-weekly|biweekly)', 
                            match.group(), 
                            re.IGNORECASE
                        )
                        frequency = frequency_match.group().lower() if frequency_match else "unknown"
                        
                        # Get context
                        start = max(0, match.start() - 100)
                        end = min(len(text), match.end() + 100)
                        context = text[start:end].strip()
                        
                        items.append(FinancialItem(
                            type="payment_schedule",
                            amount=amount,
                            currency="USD",
                            description=f"{frequency.title()} payment: {match.group()}",
                            context=context,
                            location=match.start(),
                            confidence=0.85,
                            metadata={"frequency": frequency}
                        ))
        
        return items
    
    def _parse_amount(self, amount_str: str) -> Optional[float]:
        """Parse amount string to float"""
        try:
            # Remove currency symbols and spaces
            cleaned = re.sub(r'[^\d,.]', '', amount_str)
            # Remove commas
            cleaned = cleaned.replace(',', '')
            # Convert to float
            return float(cleaned)
        except (ValueError, AttributeError):
            return None
    
    def _deduplicate_financial_items(self, items: List[FinancialItem]) -> List[FinancialItem]:
        """Remove duplicate financial items"""
        if not items:
            return items
        
        # Sort by location
        items.sort(key=lambda x: x.location or 0)
        
        deduplicated = []
        for item in items:
            # Check if we already have a similar item nearby
            is_duplicate = False
            for existing in deduplicated:
                if (abs((item.location or 0) - (existing.location or 0)) < 50 and
                    abs(item.amount - existing.amount) < 0.01 and
                    item.currency == existing.currency):
                    is_duplicate = True
                    break
            
            if not is_duplicate:
                deduplicated.append(item)
        
        return deduplicated
    
    def get_financial_summary(self, items: List[FinancialItem]) -> Dict:
        """Generate a summary of financial items"""
        if not items:
            return {"total_items": 0}
        
        summary = {
            "total_items": len(items),
            "by_type": {},
            "by_currency": {},
            "total_amounts": {},
            "highest_amount": 0,
            "lowest_amount": float('inf')
        }
        
        for item in items:
            # Count by type
            summary["by_type"][item.type] = summary["by_type"].get(item.type, 0) + 1
            
            # Count by currency
            summary["by_currency"][item.currency] = summary["by_currency"].get(item.currency, 0) + 1
            
            # Sum amounts by currency
            if item.currency not in summary["total_amounts"]:
                summary["total_amounts"][item.currency] = 0
            summary["total_amounts"][item.currency] += item.amount
            
            # Track highest and lowest amounts
            summary["highest_amount"] = max(summary["highest_amount"], item.amount)
            summary["lowest_amount"] = min(summary["lowest_amount"], item.amount)
        
        # Handle case where no amounts were found
        if summary["lowest_amount"] == float('inf'):
            summary["lowest_amount"] = 0
        
        return summary