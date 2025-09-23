import re
from typing import List, Dict, Set, Optional, Tuple
from dataclasses import dataclass
from collections import defaultdict
import logging

logger = logging.getLogger(__name__)

@dataclass
class Entity:
    """Represents an extracted entity"""
    text: str
    entity_type: str
    confidence: float
    start_position: int
    end_position: int
    context: str
    normalized_value: Optional[str] = None
    metadata: Optional[Dict] = None

class EntityExtractor:
    """Service for extracting named entities from legal documents"""
    
    def __init__(self):
        self.entity_patterns = self._initialize_patterns()
        self.common_names = self._load_common_names()
        self.company_indicators = self._load_company_indicators()
    
    def _initialize_patterns(self) -> Dict[str, List[Dict]]:
        """Initialize regex patterns for different entity types"""
        return {
            "person": [
                {
                    "pattern": r'\b(?:Mr\.?|Mrs\.?|Ms\.?|Dr\.?|Prof\.?)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)',
                    "confidence": 0.9,
                    "group": 1
                },
                {
                    "pattern": r'\b([A-Z][a-z]+\s+[A-Z][a-z]+)(?:\s+(?:Esq\.?|Jr\.?|Sr\.?|II|III))?(?=\s+(?:agrees|shall|will|hereby|signed|executed))',
                    "confidence": 0.8,
                    "group": 1
                },
                {
                    "pattern": r'(?:employee|contractor|individual|person)\s+named\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)',
                    "confidence": 0.85,
                    "group": 1
                }
            ],
            "organization": [
                {
                    "pattern": r'\b([A-Z][A-Za-z\s&]+(?:Inc\.?|LLC|Corp\.?|Corporation|Company|Co\.?|Ltd\.?|Limited|LP|LLP|Partnership))\b',
                    "confidence": 0.9,
                    "group": 1
                },
                {
                    "pattern": r'\b([A-Z][A-Za-z\s&]+)\s+(?:\("Company"\)|, a corporation|, an LLC)',
                    "confidence": 0.95,
                    "group": 1
                },
                {
                    "pattern": r'(?:company|corporation|organization|employer|business)\s+known as\s+([A-Z][A-Za-z\s&]+)',
                    "confidence": 0.8,
                    "group": 1
                }
            ],
            "address": [
                {
                    "pattern": r'\b\d+\s+[A-Za-z\s]+(?:Street|St\.?|Avenue|Ave\.?|Road|Rd\.?|Drive|Dr\.?|Lane|Ln\.?|Boulevard|Blvd\.?|Way|Place|Pl\.?|Court|Ct\.?),?\s*[A-Za-z\s]+,?\s*[A-Z]{2}\s*\d{5}(?:-\d{4})?\b',
                    "confidence": 0.9,
                    "group": 0
                },
                {
                    "pattern": r'\b(?:P\.?O\.?\s*Box\s*\d+),?\s*[A-Za-z\s]+,?\s*[A-Z]{2}\s*\d{5}(?:-\d{4})?\b',
                    "confidence": 0.85,
                    "group": 0
                }
            ],
            "phone": [
                {
                    "pattern": r'\b(?:\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})\b',
                    "confidence": 0.95,
                    "group": 0
                },
                {
                    "pattern": r'\b(?:phone|tel|telephone|call).*?(\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4})',
                    "confidence": 0.8,
                    "group": 1
                }
            ],
            "email": [
                {
                    "pattern": r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b',
                    "confidence": 0.99,
                    "group": 0
                }
            ],
            "date": [
                {
                    "pattern": r'\b(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},?\s+\d{4}\b',
                    "confidence": 0.95,
                    "group": 0
                },
                {
                    "pattern": r'\b\d{1,2}/\d{1,2}/\d{4}\b',
                    "confidence": 0.9,
                    "group": 0
                },
                {
                    "pattern": r'\b\d{4}-\d{2}-\d{2}\b',
                    "confidence": 0.9,
                    "group": 0
                }
            ],
            "currency": [
                {
                    "pattern": r'\$[\d,]+(?:\.\d{2})?(?:\s*(?:USD|dollars?))?',
                    "confidence": 0.95,
                    "group": 0
                },
                {
                    "pattern": r'\b(?:USD|dollars?)\s*[\d,]+(?:\.\d{2})?',
                    "confidence": 0.9,
                    "group": 0
                }
            ],
            "percentage": [
                {
                    "pattern": r'\b\d+(?:\.\d+)?%',
                    "confidence": 0.95,
                    "group": 0
                },
                {
                    "pattern": r'\b\d+(?:\.\d+)?\s*percent',
                    "confidence": 0.9,
                    "group": 0
                }
            ],
            "legal_reference": [
                {
                    "pattern": r'\b(?:Section|Sec\.?|§)\s*\d+(?:\.\d+)*(?:\([a-z]\))?',
                    "confidence": 0.9,
                    "group": 0
                },
                {
                    "pattern": r'\b(?:Article|Art\.?)\s*[IVX]+',
                    "confidence": 0.85,
                    "group": 0
                },
                {
                    "pattern": r'\b\d+\s*U\.?S\.?C\.?\s*§?\s*\d+',
                    "confidence": 0.95,
                    "group": 0
                }
            ],
            "duration": [
                {
                    "pattern": r'\b\d+\s*(?:years?|months?|weeks?|days?|hours?|minutes?)',
                    "confidence": 0.9,
                    "group": 0
                },
                {
                    "pattern": r'\b(?:one|two|three|four|five|six|seven|eight|nine|ten)\s+(?:years?|months?|weeks?|days?)',
                    "confidence": 0.8,
                    "group": 0
                }
            ]
        }
    
    def _load_common_names(self) -> Set[str]:
        """Load common first and last names for person entity validation"""
        # Common first names
        first_names = {
            'james', 'john', 'robert', 'michael', 'william', 'david', 'richard', 'charles',
            'joseph', 'thomas', 'christopher', 'daniel', 'paul', 'mark', 'donald', 'steven',
            'kenneth', 'andrew', 'joshua', 'kevin', 'brian', 'george', 'edward', 'ronald',
            'timothy', 'jason', 'jeffrey', 'ryan', 'jacob', 'gary', 'nicholas', 'eric',
            'mary', 'patricia', 'jennifer', 'linda', 'elizabeth', 'barbara', 'susan',
            'jessica', 'sarah', 'karen', 'nancy', 'lisa', 'betty', 'helen', 'sandra',
            'donna', 'carol', 'ruth', 'sharon', 'michelle', 'laura', 'sarah', 'kimberly',
            'deborah', 'dorothy', 'lisa', 'nancy', 'karen', 'betty', 'helen', 'sandra'
        }
        
        # Common last names
        last_names = {
            'smith', 'johnson', 'williams', 'brown', 'jones', 'garcia', 'miller', 'davis',
            'rodriguez', 'martinez', 'hernandez', 'lopez', 'gonzalez', 'wilson', 'anderson',
            'thomas', 'taylor', 'moore', 'jackson', 'martin', 'lee', 'perez', 'thompson',
            'white', 'harris', 'sanchez', 'clark', 'ramirez', 'lewis', 'robinson', 'walker',
            'young', 'allen', 'king', 'wright', 'scott', 'torres', 'nguyen', 'hill', 'flores'
        }
        
        return first_names.union(last_names)
    
    def _load_company_indicators(self) -> Set[str]:
        """Load indicators that suggest an entity is a company"""
        return {
            'inc', 'incorporated', 'corp', 'corporation', 'company', 'co', 'llc', 'ltd',
            'limited', 'lp', 'llp', 'partnership', 'associates', 'group', 'holdings',
            'enterprises', 'solutions', 'systems', 'technologies', 'services', 'consulting',
            'international', 'global', 'national', 'regional', 'foundation', 'institute'
        }
    
    def extract_entities(self, text: str, entity_types: Optional[List[str]] = None) -> List[Entity]:
        """Extract entities from text"""
        if entity_types is None:
            entity_types = list(self.entity_patterns.keys())
        
        entities = []
        
        for entity_type in entity_types:
            if entity_type in self.entity_patterns:
                entities.extend(self._extract_entities_by_type(text, entity_type))
        
        # Remove duplicates and overlapping entities
        entities = self._deduplicate_entities(entities)
        
        # Sort by position
        entities.sort(key=lambda x: x.start_position)
        
        return entities
    
    def _extract_entities_by_type(self, text: str, entity_type: str) -> List[Entity]:
        """Extract entities of a specific type"""
        entities = []
        patterns = self.entity_patterns.get(entity_type, [])
        
        for pattern_data in patterns:
            pattern = pattern_data["pattern"]
            confidence = pattern_data["confidence"]
            group = pattern_data.get("group", 0)
            
            matches = re.finditer(pattern, text, re.IGNORECASE)
            
            for match in matches:
                try:
                    entity_text = match.group(group).strip()
                    
                    # Skip if empty or too short
                    if not entity_text or len(entity_text) < 2:
                        continue
                    
                    # Additional validation based on entity type
                    if not self._validate_entity(entity_text, entity_type):
                        continue
                    
                    # Get context
                    context = self._get_context(text, match.start(), match.end())
                    
                    # Normalize entity value
                    normalized_value = self._normalize_entity(entity_text, entity_type)
                    
                    # Create entity
                    entity = Entity(
                        text=entity_text,
                        entity_type=entity_type,
                        confidence=confidence,
                        start_position=match.start(),
                        end_position=match.end(),
                        context=context,
                        normalized_value=normalized_value,
                        metadata=self._get_entity_metadata(entity_text, entity_type, context)
                    )
                    
                    entities.append(entity)
                    
                except (IndexError, AttributeError) as e:
                    logger.warning(f"Error extracting entity: {e}")
                    continue
        
        return entities
    
    def _validate_entity(self, entity_text: str, entity_type: str) -> bool:
        """Validate extracted entity based on type-specific rules"""
        if entity_type == "person":
            # Check if it contains common name parts
            words = entity_text.lower().split()
            if len(words) >= 2:
                return any(word in self.common_names for word in words)
            return False
        
        elif entity_type == "organization":
            # Check if it has company indicators or is properly capitalized
            words = entity_text.lower().split()
            has_company_indicator = any(word in self.company_indicators for word in words)
            is_properly_capitalized = all(word[0].isupper() for word in entity_text.split() if word)
            return has_company_indicator or is_properly_capitalized
        
        elif entity_type == "email":
            # Additional email validation
            return "@" in entity_text and "." in entity_text.split("@")[-1]
        
        elif entity_type == "phone":
            # Check if it has enough digits
            digits = re.findall(r'\d', entity_text)
            return len(digits) >= 10
        
        elif entity_type == "currency":
            # Check if it has valid currency format
            return bool(re.search(r'[\d,]+(?:\.\d{2})?', entity_text))
        
        return True
    
    def _get_context(self, text: str, start: int, end: int, context_size: int = 100) -> str:
        """Get surrounding context for an entity"""
        context_start = max(0, start - context_size)
        context_end = min(len(text), end + context_size)
        return text[context_start:context_end].strip()
    
    def _normalize_entity(self, entity_text: str, entity_type: str) -> str:
        """Normalize entity value based on type"""
        if entity_type == "phone":
            # Normalize phone number to standard format
            digits = re.findall(r'\d', entity_text)
            if len(digits) == 10:
                return f"({digits[0]}{digits[1]}{digits[2]}) {digits[3]}{digits[4]}{digits[5]}-{digits[6]}{digits[7]}{digits[8]}{digits[9]}"
            elif len(digits) == 11 and digits[0] == '1':
                return f"1-({digits[1]}{digits[2]}{digits[3]}) {digits[4]}{digits[5]}{digits[6]}-{digits[7]}{digits[8]}{digits[9]}{digits[10]}"
        
        elif entity_type == "currency":
            # Extract numeric value
            amount = re.search(r'[\d,]+(?:\.\d{2})?', entity_text)
            if amount:
                return f"${amount.group()}"
        
        elif entity_type == "percentage":
            # Normalize percentage format
            number = re.search(r'\d+(?:\.\d+)?', entity_text)
            if number:
                return f"{number.group()}%"
        
        elif entity_type == "person":
            # Title case for person names
            return entity_text.title()
        
        elif entity_type == "organization":
            # Preserve original capitalization for organizations
            return entity_text.strip()
        
        return entity_text
    
    def _get_entity_metadata(self, entity_text: str, entity_type: str, context: str) -> Dict:
        """Get additional metadata for entity"""
        metadata = {}
        
        if entity_type == "person":
            # Check for titles
            titles = re.findall(r'\b(?:Mr\.?|Mrs\.?|Ms\.?|Dr\.?|Prof\.?|Esq\.?|Jr\.?|Sr\.?)\b', 
                               context, re.IGNORECASE)
            if titles:
                metadata["titles"] = list(set(titles))
        
        elif entity_type == "organization":
            # Extract company type
            company_types = re.findall(r'\b(?:Inc\.?|LLC|Corp\.?|Corporation|Company|Co\.?|Ltd\.?|Limited|LP|LLP)\b', 
                                     entity_text, re.IGNORECASE)
            if company_types:
                metadata["company_type"] = company_types[0]
        
        elif entity_type == "currency":
            # Extract currency context (salary, fee, penalty, etc.)
            currency_contexts = [
                ("salary", r'\b(?:salary|wage|pay|compensation|income)\b'),
                ("fee", r'\b(?:fee|charge|cost|price)\b'),
                ("penalty", r'\b(?:penalty|fine|damages|liquidated)\b'),
                ("deposit", r'\b(?:deposit|down payment|security)\b'),
                ("bonus", r'\b(?:bonus|incentive|commission)\b')
            ]
            
            for context_type, pattern in currency_contexts:
                if re.search(pattern, context, re.IGNORECASE):
                    metadata["currency_context"] = context_type
                    break
        
        return metadata
    
    def _deduplicate_entities(self, entities: List[Entity]) -> List[Entity]:
        """Remove duplicate and overlapping entities"""
        if not entities:
            return entities
        
        # Sort by start position
        entities.sort(key=lambda x: x.start_position)
        
        deduplicated = []
        
        for entity in entities:
            # Check for overlaps with existing entities
            is_duplicate = False
            
            for existing in deduplicated:
                # Check for text overlap
                if (entity.start_position < existing.end_position and 
                    entity.end_position > existing.start_position):
                    
                    # Keep the entity with higher confidence
                    if entity.confidence > existing.confidence:
                        deduplicated.remove(existing)
                        break
                    else:
                        is_duplicate = True
                        break
                
                # Check for exact text match
                if (entity.text.lower() == existing.text.lower() and 
                    entity.entity_type == existing.entity_type):
                    is_duplicate = True
                    break
            
            if not is_duplicate:
                deduplicated.append(entity)
        
        return deduplicated
    
    def get_entities_by_type(self, entities: List[Entity], entity_type: str) -> List[Entity]:
        """Filter entities by type"""
        return [entity for entity in entities if entity.entity_type == entity_type]
    
    def get_entity_summary(self, entities: List[Entity]) -> Dict[str, int]:
        """Get summary of entity counts by type"""
        summary = defaultdict(int)
        for entity in entities:
            summary[entity.entity_type] += 1
        return dict(summary)
    
    def extract_key_parties(self, text: str) -> Dict[str, List[Entity]]:
        """Extract key parties from legal document"""
        # Extract persons and organizations
        entities = self.extract_entities(text, ["person", "organization"])
        
        parties = {
            "individuals": self.get_entities_by_type(entities, "person"),
            "organizations": self.get_entities_by_type(entities, "organization")
        }
        
        # Try to identify specific roles based on context
        role_patterns = {
            "employer": r'\b(?:employer|company|corporation)\b.*?([A-Z][A-Za-z\s&]+(?:Inc\.?|LLC|Corp\.?))',
            "employee": r'\b(?:employee|individual|person)\s+named\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)',
            "landlord": r'\b(?:landlord|lessor|owner)\b.*?([A-Z][A-Za-z\s&]+)',
            "tenant": r'\b(?:tenant|lessee|renter)\b.*?([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)'
        }
        
        for role, pattern in role_patterns.items():
            matches = re.finditer(pattern, text, re.IGNORECASE)
            role_entities = []
            for match in matches:
                entity_text = match.group(1).strip()
                context = self._get_context(text, match.start(), match.end())
                
                entity = Entity(
                    text=entity_text,
                    entity_type="role_specific",
                    confidence=0.8,
                    start_position=match.start(),
                    end_position=match.end(),
                    context=context,
                    normalized_value=entity_text,
                    metadata={"role": role}
                )
                role_entities.append(entity)
            
            if role_entities:
                parties[role] = role_entities
        
        return parties