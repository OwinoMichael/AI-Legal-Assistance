import re
from typing import List, Dict, Optional, Tuple
from datetime import datetime, timedelta
import logging

logger = logging.getLogger(__name__)

class DateExtractor:
    """Extract and parse dates from documents"""
    
    def __init__(self):
        # Date patterns in various formats
        self.date_patterns = [
            # MM/DD/YYYY and variations
            r'\b(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})\b',
            r'\b(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2})\b',
            
            # DD/MM/YYYY (European format)
            r'\b(\d{1,2})\.(\d{1,2})\.(\d{4})\b',
            
            # Month DD, YYYY
            r'\b(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{1,2}),?\s+(\d{4})\b',
            r'\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\.?\s+(\d{1,2}),?\s+(\d{4})\b',
            
            # DD Month YYYY
            r'\b(\d{1,2})\s+(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{4})\b',
            r'\b(\d{1,2})\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\.?\s+(\d{4})\b',
            
            # YYYY-MM-DD (ISO format)
            r'\b(\d{4})-(\d{1,2})-(\d{1,2})\b',
        ]
        
        # Month name mappings
        self.month_names = {
            'january': 1, 'jan': 1,
            'february': 2, 'feb': 2,
            'march': 3, 'mar': 3,
            'april': 4, 'apr': 4,
            'may': 5,
            'june': 6, 'jun': 6,
            'july': 7, 'jul': 7,
            'august': 8, 'aug': 8,
            'september': 9, 'sep': 9,
            'october': 10, 'oct': 10,
            'november': 11, 'nov': 11,
            'december': 12, 'dec': 12
        }
        
        # Relative date patterns
        self.relative_patterns = [
            r'\b(\d+)\s+days?\s+(?:from|after|before)\b',
            r'\b(\d+)\s+weeks?\s+(?:from|after|before)\b',
            r'\b(\d+)\s+months?\s+(?:from|after|before)\b',
            r'\b(\d+)\s+years?\s+(?:from|after|before)\b',
            r'\bwithin\s+(\d+)\s+days?\b',
            r'\bwithin\s+(\d+)\s+weeks?\b',
            r'\bwithin\s+(\d+)\s+months?\b',
        ]
        
        # Deadline and event patterns
        self.deadline_patterns = [
            r'deadline.*?(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{4})',
            r'due.*?(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{4})',
            r'expires?.*?(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{4})',
            r'effective.*?(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{4})',
            r'starts?.*?(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{4})',
            r'ends?.*?(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{4})',
        ]
    
    def extract_dates(self, text: str) -> List[Dict]:
        """Extract all dates from text"""
        dates = []
        
        # Extract absolute dates
        dates.extend(self._extract_absolute_dates(text))
        
        # Extract relative dates
        dates.extend(self._extract_relative_dates(text))
        
        # Extract deadline dates
        dates.extend(self._extract_deadline_dates(text))
        
        # Remove duplicates and sort by location
        dates = self._deduplicate_dates(dates)
        dates.sort(key=lambda x: x.get('location', 0))
        
        return dates
    
    def _extract_absolute_dates(self, text: str) -> List[Dict]:
        """Extract absolute dates in various formats"""
        dates = []
        
        for pattern in self.date_patterns:
            matches = re.finditer(pattern, text, re.IGNORECASE)
            for match in matches:
                parsed_date = self._parse_date_match(match)
                if parsed_date:
                    # Get context around the date
                    start = max(0, match.start() - 50)
                    end = min(len(text), match.end() + 50)
                    context = text[start:end].strip()
                    
                    dates.append({
                        'type': 'absolute',
                        'date': parsed_date,
                        'original_text': match.group(),
                        'context': context,
                        'location': match.start(),
                        'confidence': 0.9
                    })
        
        return dates
    
    def _extract_relative_dates(self, text: str) -> List[Dict]:
        """Extract relative date expressions"""
        dates = []
        
        for pattern in self.relative_patterns:
            matches = re.finditer(pattern, text, re.IGNORECASE)
            for match in matches:
                # Calculate relative date
                relative_date = self._calculate_relative_date(match.group())
                if relative_date:
                    # Get context
                    start = max(0, match.start() - 50)
                    end = min(len(text), match.end() + 50)
                    context = text[start:end].strip()
                    
                    dates.append({
                        'type': 'relative',
                        'date': relative_date,
                        'original_text': match.group(),
                        'context': context,
                        'location': match.start(),
                        'confidence': 0.7
                    })
        
        return dates
    
    def _extract_deadline_dates(self, text: str) -> List[Dict]:
        """Extract dates associated with deadlines"""
        dates = []
        
        for pattern in self.deadline_patterns:
            matches = re.finditer(pattern, text, re.IGNORECASE)
            for match in matches:
                # Parse the date part
                date_part = match.group(1)
                parsed_date = self._parse_date_string(date_part)
                
                if parsed_date:
                    # Get broader context for deadlines
                    start = max(0, match.start() - 100)
                    end = min(len(text), match.end() + 100)
                    context = text[start:end].strip()
                    
                    # Determine deadline type
                    deadline_type = 'deadline'
                    full_match = match.group().lower()
                    if 'due' in full_match:
                        deadline_type = 'due_date'
                    elif 'expire' in full_match:
                        deadline_type = 'expiration'
                    elif 'effective' in full_match:
                        deadline_type = 'effective_date'
                    elif 'start' in full_match:
                        deadline_type = 'start_date'
                    elif 'end' in full_match:
                        deadline_type = 'end_date'
                    
                    dates.append({
                        'type': deadline_type,
                        'date': parsed_date,
                        'original_text': match.group(),
                        'context': context,
                        'location': match.start(),
                        'confidence': 0.85
                    })
        
        return dates
    
    def _parse_date_match(self, match) -> Optional[datetime]:
        """Parse a regex match object to extract date"""
        groups = match.groups()
        match_text = match.group()
        
        try:
            # Handle different date formats based on the pattern
            if '/' in match_text or '-' in match_text:
                # Numeric date formats
                if len(groups) == 3:
                    # Determine if it's MM/DD/YYYY or DD/MM/YYYY or YYYY-MM-DD
                    if len(groups[0]) == 4:  # YYYY-MM-DD
                        year, month, day = int(groups[0]), int(groups[1]), int(groups[2])
                    else:  # MM/DD/YYYY or DD/MM/YYYY
                        # Assume MM/DD/YYYY for US format
                        month, day, year = int(groups[0]), int(groups[1]), int(groups[2])
                        # Handle 2-digit years
                        if year < 100:
                            year += 2000 if year < 50 else 1900
                    
                    return datetime(year, month, day)
            
            elif any(month in match_text.lower() for month in self.month_names.keys()):
                # Month name formats
                return self._parse_month_name_date(match_text, groups)
        
        except (ValueError, IndexError) as e:
            logger.debug(f"Failed to parse date: {match_text}, error: {e}")
            return None
        
        return None
    
    def _parse_month_name_date(self, date_text: str, groups: Tuple) -> Optional[datetime]:
        """Parse dates with month names"""
        try:
            date_lower = date_text.lower()
            
            # Find the month
            month_num = None
            for month_name, month_val in self.month_names.items():
                if month_name in date_lower:
                    month_num = month_val
                    break
            
            if not month_num:
                return None
            
            # Extract day and year from groups
            numbers = [int(g) for g in groups if g.isdigit()]
            
            if len(numbers) >= 2:
                # Determine which is day and which is year
                day = next(n for n in numbers if 1 <= n <= 31)
                year = next(n for n in numbers if n > 31)
                
                return datetime(year, month_num, day)
        
        except (ValueError, StopIteration):
            return None
        
        return None
    
    def _parse_date_string(self, date_str: str) -> Optional[datetime]:
        """Parse a date string in common formats"""
        # Try common formats
        formats = [
            '%m/%d/%Y', '%m-%d-%Y', '%m.%d.%Y',
            '%d/%m/%Y', '%d-%m-%Y', '%d.%m.%Y',
            '%Y-%m-%d', '%Y/%m/%d',
            '%m/%d/%y', '%m-%d-%y',
            '%B %d, %Y', '%b %d, %Y',
            '%d %B %Y', '%d %b %Y'
        ]
        
        for fmt in formats:
            try:
                return datetime.strptime(date_str.strip(), fmt)
            except ValueError:
                continue
        
        return None
    
    def _calculate_relative_date(self, relative_text: str) -> Optional[datetime]:
        """Calculate absolute date from relative expression"""
        try:
            text_lower = relative_text.lower()
            
            # Extract number
            number_match = re.search(r'(\d+)', text_lower)
            if not number_match:
                return None
            
            num = int(number_match.group(1))
            base_date = datetime.now()
            
            # Determine time unit and direction
            if 'day' in text_lower:
                delta = timedelta(days=num)
            elif 'week' in text_lower:
                delta = timedelta(weeks=num)
            elif 'month' in text_lower:
                delta = timedelta(days=num * 30)  # Approximate
            elif 'year' in text_lower:
                delta = timedelta(days=num * 365)  # Approximate
            else:
                return None
            
            # Apply direction
            if 'before' in text_lower:
                return base_date - delta
            else:  # 'after', 'from', 'within'
                return base_date + delta
        
        except (ValueError, AttributeError):
            return None
    
    def _deduplicate_dates(self, dates: List[Dict]) -> List[Dict]:
        """Remove duplicate dates"""
        if not dates:
            return dates
        
        # Sort by location
        dates.sort(key=lambda x: x.get('location', 0))
        
        deduplicated = []
        for date_item in dates:
            # Check if we already have this date nearby
            is_duplicate = False
            for existing in deduplicated:
                if (abs(date_item.get('location', 0) - existing.get('location', 0)) < 50 and
                    date_item.get('date') == existing.get('date')):
                    is_duplicate = True
                    break
            
            if not is_duplicate:
                deduplicated.append(date_item)
        
        return deduplicated
    
    def get_important_dates(self, dates: List[Dict]) -> Dict:
        """Identify the most important dates"""
        if not dates:
            return {}
        
        important_dates = {
            'deadlines': [],
            'effective_dates': [],
            'expiration_dates': [],
            'future_dates': [],
            'past_dates': []
        }
        
        now = datetime.now()
        
        for date_item in dates:
            date_obj = date_item.get('date')
            if not date_obj:
                continue
            
            date_type = date_item.get('type', 'unknown')
            
            # Categorize by type
            if 'deadline' in date_type or 'due' in date_type:
                important_dates['deadlines'].append(date_item)
            elif 'effective' in date_type:
                important_dates['effective_dates'].append(date_item)
            elif 'expir' in date_type:
                important_dates['expiration_dates'].append(date_item)
            
            # Categorize by time relative to now
            if date_obj > now:
                important_dates['future_dates'].append(date_item)
            else:
                important_dates['past_dates'].append(date_item)
        
        # Sort each category by date
        for category in important_dates:
            important_dates[category].sort(key=lambda x: x.get('date', now))
        
        return important_dates