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
                r'\$[\d,.]+',                           # $5,000 or $5000
                r'USD\s*[\d,.]+',
                r'US\s*dollars?\s*[\d,.]+',
                r'[\d,.]+\s*US\s*dollars?'
            ],
            'eur': [
                r'€[\d,.]+',
                r'EUR\s*[\d,.]+',
                r'euros?\s*[\d,.]+',
                r'[\d,.]+\s*euros?'
            ],
            'gbp': [
                r'£[\d,.]+',
                r'GBP\s*[\d,.]+',
                r'pounds?\s*sterling\s*[\d,.]+',
                r'[\d,.]+\s*pounds?\s*sterling'
            ],
            'cad': [
                r'CAD\s*[\d,.]+',
                r'C\$[\d,.]+',
                r'Canadian\s*dollars?\s*[\d,.]+',
                r'[\d,.]+\s*Canadian\s*dollars?'
            ],
            'aud': [
                r'AUD\s*[\d,.]+',
                r'A\$[\d,.]+',
                r'Australian\s*dollars?\s*[\d,.]+',
                r'[\d,.]+\s*Australian\s*dollars?'
            ],
            'inr': [
                r'₹[\d,.]+',
                r'INR\s*[\d,.]+',
                r'rupees?\s*[\d,.]+',
                r'[\d,.]+\s*rupees?'
            ],
            'jpy': [
                r'¥[\d,.]+',
                r'JPY\s*[\d,.]+',
                r'yen\s*[\d,.]+',
                r'[\d,.]+\s*yen'
            ]
        }
        
        # Financial term patterns
        self.financial_terms = {
            'salary': [
                r'salary.*?\$?[\d,.]+',
                r'annual\s+salary.*?\$?[\d,.]+',
                r'base\s+(?:pay|salary).*?\$?[\d,.]+',
                r'compensation\s+package.*?\$?[\d,.]+',
                r'gross\s+income.*?\$?[\d,.]+'
            ],
            'bonus': [
                r'bonus.*?\$?[\d,.]+',
                r'signing\s+bonus.*?\$?[\d,.]+',
                r'incentive.*?\$?[\d,.]+',
                r'commission.*?\$?[\d,.]+',
                r'performance\s+bonus.*?\$?[\d,.]+'
            ],
            'penalty': [
                r'penalt(?:y|ies).*?\$?[\d,.]+',
                r'fine.*?\$?[\d,.]+',
                r'liquidated\s+damages.*?\$?[\d,.]+',
                r'breach\s+penalty.*?\$?[\d,.]+'
            ],
            'fee': [
                r'fee.*?\$?[\d,.]+',
                r'service\s+charge.*?\$?[\d,.]+',
                r'cost.*?\$?[\d,.]+',
                r'charge.*?\$?[\d,.]+',
                r'processing\s+fee.*?\$?[\d,.]+',
                r'administration\s+fee.*?\$?[\d,.]+'
            ],
            'deposit': [
                r'deposit.*?\$?[\d,.]+',
                r'security\s+deposit.*?\$?[\d,.]+',
                r'advance\s+payment.*?\$?[\d,.]+',
                r'escrow\s+deposit.*?\$?[\d,.]+'
            ],
            'loan_amount': [
                r'loan\s+amount.*?\$?[\d,.]+',
                r'principal\s+sum.*?\$?[\d,.]+',
                r'borrowed\s+sum.*?\$?[\d,.]+'
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
        
        # Remove duplicates and sort by location (if available)
        financial_items = self._deduplicate_financial_items(financial_items)
        
        # Sort by location if items have location attribute
        try:
            financial_items.sort(key=lambda x: getattr(x, 'location', 0))
        except AttributeError:
            # If location attribute doesn't exist, just keep original order
            pass
        
        return financial_items
    
    def _create_financial_item(self, item_data: Dict, location: Optional[int] = None) -> FinancialItem:
        """Helper method to create FinancialItem with or without location"""
        try:
            # Try to create with location first
            if location is not None:
                return FinancialItem(location=location, **item_data)
            else:
                return FinancialItem(**item_data)
        except TypeError as e:
            # If location field is not supported, create without it
            if 'location' in str(e):
                logger.debug("FinancialItem model doesn't support location field")
                return FinancialItem(**item_data)
            else:
                raise e
    
    def _extract_currency_amounts(self, text: str) -> List[FinancialItem]:
        """Extract basic currency amounts"""
        items = []
        
        for currency, patterns in self.currency_patterns.items():
            for pattern in patterns:
                try:
                    matches = re.finditer(pattern, text, re.IGNORECASE)
                    for match in matches:
                        amount = self._parse_amount(match.group())
                        if amount is not None:
                            # Get context around the match
                            start = max(0, match.start() - 50)
                            end = min(len(text), match.end() + 50)
                            context = text[start:end].strip()
                            
                            item_data = {
                                "type": "amount",
                                "amount": str(amount),
                                "currency": currency.upper(),
                                "description": f"Currency amount: {match.group()}",
                                "context": context,
                                "confidence": 0.8
                            }
                            
                            items.append(self._create_financial_item(item_data, match.start()))
                except re.error as e:
                    logger.warning(f"Invalid regex pattern '{pattern}': {e}")
                    continue
        
        return items
    
    def _extract_financial_terms(self, text: str) -> List[FinancialItem]:
        """Extract financial terms with associated amounts"""
        items = []
        
        for term_type, patterns in self.financial_terms.items():
            for pattern in patterns:
                try:
                    matches = re.finditer(pattern, text, re.IGNORECASE)
                    for match in matches:
                        # Extract amount from the match
                        amount_match = re.search(r'\$?[\d,]+(?:\.\d{2})?', match.group())
                        if amount_match:
                            amount = self._parse_amount(amount_match.group())
                            if amount is not None:
                                # Get broader context
                                start = max(0, match.start() - 100)
                                end = min(len(text), match.end() + 100)
                                context = text[start:end].strip()
                                
                                item_data = {
                                    "type": term_type,
                                    "amount": str(amount),
                                    "currency": "USD",
                                    "description": f"{term_type.title()}: {match.group()}",
                                    "context": context,
                                    "confidence": 0.9
                                }
                                
                                items.append(self._create_financial_item(item_data, match.start()))
                except re.error as e:
                    logger.warning(f"Invalid regex pattern '{pattern}': {e}")
                    continue
        
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
            try:
                matches = re.finditer(pattern, text, re.IGNORECASE)
                for match in matches:
                    # Extract amount
                    amount_match = re.search(r'\$?[\d,]+(?:\.\d{2})?', match.group())
                    if amount_match:
                        amount = self._parse_amount(amount_match.group())
                        if amount is not None:
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
                            
                            item_data = {
                                "type": "payment_schedule",
                                "amount": str(amount),
                                "currency": "USD",
                                "description": f"{frequency.title()} payment: {match.group()}",
                                "context": context,
                                "confidence": 0.85,
                                "metadata": {"frequency": frequency}
                            }
                            
                            items.append(self._create_financial_item(item_data, match.start()))
            except re.error as e:
                logger.warning(f"Invalid regex pattern '{pattern}': {e}")
                continue
        
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
        
        # Sort by location if available
        items.sort(key=lambda x: getattr(x, 'location', 0))
        
        deduplicated = []
        for item in items:
            # Check if we already have a similar item nearby
            is_duplicate = False
            for existing in deduplicated:
                # Use getattr to safely access location attribute
                item_location = getattr(item, 'location', 0)
                existing_location = getattr(existing, 'location', 0)
                location_diff = abs(item_location - existing_location)
                
                try:
                    item_amount = float(item.amount)
                    existing_amount = float(existing.amount)
                    amount_diff = abs(item_amount - existing_amount)
                except (ValueError, TypeError):
                    # If amounts can't be compared, consider them different
                    amount_diff = float('inf')
                
                if (location_diff < 50 and
                    amount_diff < 0.01 and
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
            
            # Convert amount to float for calculations
            try:
                amount_float = float(item.amount)
            except (ValueError, TypeError):
                continue  # Skip invalid amounts
            
            # Sum amounts by currency
            if item.currency not in summary["total_amounts"]:
                summary["total_amounts"][item.currency] = 0
            summary["total_amounts"][item.currency] += amount_float
            
            # Track highest and lowest amounts
            summary["highest_amount"] = max(summary["highest_amount"], amount_float)
            summary["lowest_amount"] = min(summary["lowest_amount"], amount_float)
        
        # Handle case where no amounts were found
        if summary["lowest_amount"] == float('inf'):
            summary["lowest_amount"] = 0
        
        return summary