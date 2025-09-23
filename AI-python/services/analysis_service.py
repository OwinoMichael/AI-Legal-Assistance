import re
from typing import List, Dict, Optional
from datetime import datetime, timedelta
from collections import defaultdict

from models.schemas import (
    Risk, Clause, KeyTerm, ActionItem, FinancialItem, 
    ComplianceItem, ComprehensiveAnalysis, DocumentMetadata
)
from data.legal_terms import LEGAL_TERMS
from data.risk_patterns import RISK_PATTERNS
from data.clause_patterns import CLAUSE_PATTERNS
from services.document_type import DocumentClassifier
from services.extractors.financial_extractor import FinancialExtractor
from services.extractors.date_extractor import DateExtractor
from services.extractors.entity_extractor import EntityExtractor
from config.settings import get_settings
import logging

from utils.action_items_utils import create_action_item_with_deadline, get_action_items_for_document_type, get_deadline_patterns, get_risk_action_template, get_time_multiplier
from utils.clause_utils import get_document_specific_clauses
from utils.compliance_utils import get_compliance_patterns_for_document_type
from utils.recommendation_utils import get_clause_based_recommendations, get_document_type_recommendations, get_financial_recommendations, get_general_recommendations, get_risk_based_recommendations, sort_recommendations_by_priority
from utils.risk_utils import get_patterns_by_document_type, get_risk_level_from_score

logger = logging.getLogger(__name__)

class DocumentAnalysisService:
    """Main service for comprehensive document analysis"""
    
    def __init__(self):
        self.settings = get_settings()
        self.financial_extractor = FinancialExtractor()
        self.date_extractor = DateExtractor()
        self.entity_extractor = EntityExtractor()
        self.document_classifier = DocumentClassifier  # <- your classifier class, not an instance
    
    def analyze_document(
        self, 
        text: str, 
        document_type: str = "general",
        ml_service=None
    ) -> ComprehensiveAnalysis:
        """Perform comprehensive document analysis"""
        
        start_time = datetime.now()
        
        try:
            # 1️⃣ CLASSIFY if needed
            if not document_type or document_type.lower() == "general":
                classification_result = self.document_classifier.classify_document(text)
                document_type = classification_result.document_type.value  # Enum to str
                logger.info(f"Auto-classified document as {document_type} | Confidence: {classification_result.confidence:.2f}")
                logger.debug(f"Classification details: {classification_result.reasoning}")
            
            # 2️⃣ Summarize
            summary = ""
            if ml_service and ml_service.models_loaded:
                try:
                    summary = ml_service.summarize_text(text)
                except Exception as e:
                    logger.warning(f"ML summarization failed, falling back to extractive: {e}")
                    summary = self._generate_extractive_summary(text)
            else:
                summary = self._generate_extractive_summary(text)
            
            # 3️⃣ Extract various elements
            risks = self._identify_risks(text, document_type)
            clauses = self._extract_clauses(text, document_type)
            key_terms = self._extract_key_terms(text)
            action_items = self._generate_action_items(text, document_type, risks, clauses)
            financial_impact = self.financial_extractor.extract_financial_information(text)
            compliance_items = self._extract_compliance_items(text, document_type)
            recommendations = self._generate_recommendations(risks, clauses, document_type, financial_impact)
            
            # 4️⃣ Confidence score
            confidence_score = self._calculate_confidence_score(
                text, risks, clauses, key_terms, financial_impact
            )
            
            # 5️⃣ Metadata
            processing_time = (datetime.now() - start_time).total_seconds()
            metadata = {
                "document_type": document_type,
                "text_length": len(text),
                "word_count": len(text.split()),
                "processing_time": processing_time,
                "analysis_date": datetime.now().isoformat(),
                "feature_counts": {
                    "risks": len(risks),
                    "clauses": len(clauses),
                    "key_terms": len(key_terms),
                    "financial_items": len(financial_impact),
                    "compliance_items": len(compliance_items)
                }
            }
            
            return ComprehensiveAnalysis(
                summary=summary,
                risks=risks,
                clauses=clauses,
                key_terms=key_terms,
                action_items=action_items,
                financial_impact=financial_impact,
                compliance_items=compliance_items,
                recommendations=recommendations,
                confidence_score=confidence_score,
                analysis_metadata=metadata
            )
        
        except Exception as e:
            logger.error(f"Document analysis failed: {str(e)}")
            raise Exception(f"Analysis failed: {str(e)}")
    
    def _generate_extractive_summary(self, text: str) -> str:
        """Generate a simple extractive summary as fallback"""
        sentences = re.split(r'[.!?]+', text)
        sentences = [s.strip() for s in sentences if len(s.strip()) > 20]
        
        if len(sentences) <= 3:
            return text[:500] + "..." if len(text) > 500 else text
        
        # Take first sentence, middle sentence, and key sentences with important terms
        summary_sentences = []
        
        # First sentence
        if sentences:
            summary_sentences.append(sentences[0])
        
        # Find sentences with important terms
        important_terms = ['payment', 'obligation', 'termination', 'penalty', 'agreement', 'contract']
        for sentence in sentences[1:]:
            if any(term in sentence.lower() for term in important_terms) and len(summary_sentences) < 3:
                summary_sentences.append(sentence)
        
        # Add middle sentence if we don't have enough
        if len(summary_sentences) < 2 and len(sentences) > 2:
            middle_idx = len(sentences) // 2
            summary_sentences.append(sentences[middle_idx])
        
        return '. '.join(summary_sentences) + '.'
    
    def _identify_risks(self, text: str, document_type: str) -> List[Risk]:
        """Identify potential risks in the document using modularized risk patterns"""
        risks = []
        
        try:
            # Get risk patterns for the specific document type
            patterns = get_patterns_by_document_type(document_type)
            
            for pattern_data in patterns:
                # Handle different pattern data structures safely
                if isinstance(pattern_data, dict):
                    pattern = pattern_data.get('pattern', '')
                    risk_score = pattern_data.get('score', pattern_data.get('risk_score', 5))  # Default score of 5
                    description = pattern_data.get('description', pattern_data.get('title', 'Risk detected'))
                    category = pattern_data.get('category', 'general')
                elif isinstance(pattern_data, str):
                    # Handle simple string patterns
                    pattern = pattern_data
                    risk_score = 5  # Default score
                    description = "Risk pattern detected"
                    category = 'general'
                else:
                    logger.warning(f"Unknown pattern data type: {type(pattern_data)}")
                    continue
                
                if not pattern:
                    continue
                
                try:
                    matches = re.finditer(pattern, text, re.IGNORECASE)
                    for match in matches:
                        # Get surrounding context
                        start = max(0, match.start() - 100)
                        end = min(len(text), match.end() + 100)
                        context = text[start:end].strip()
                        
                        # Determine risk level from score
                        risk_level = get_risk_level_from_score(risk_score)
                        
                        risks.append(Risk(
                            level=risk_level,
                            title=description,
                            description=f"Match: '{match.group()}' - Context: {context[:200]}...",
                            confidence=min(1.0, risk_score / 10.0),
                            category=category,
                            location=match.start()
                        ))
                except re.error as e:
                    logger.warning(f"Invalid regex pattern '{pattern}': {e}")
                    continue
                
        except Exception as e:
            logger.error(f"Error in risk identification: {e}")
            # Return empty list if patterns can't be loaded, but don't fail the entire analysis
        
        # Remove duplicate risks (same title and similar location)
        risks = self._deduplicate_risks(risks)
        
        return risks
    
    def _extract_clauses(self, text: str, document_type: str) -> List[Clause]:
        """Extract and categorize important clauses using modularized patterns"""
        clauses = []
        
        try:
            # Get clause patterns for the specific document type
            clause_patterns = get_document_specific_clauses(document_type)
            
            for clause_type, patterns in clause_patterns.items():
                for pattern_data in patterns:
                    # Handle different pattern data structures safely
                    if isinstance(pattern_data, dict):
                        pattern = pattern_data.get('pattern', '')
                        significance = pattern_data.get('significance', 'standard')
                        title = pattern_data.get('title', f"{clause_type.title()} Clause")
                    elif isinstance(pattern_data, str):
                        pattern = pattern_data
                        significance = 'standard'
                        title = f"{clause_type.title()} Clause"
                    else:
                        continue
                    
                    if not pattern:
                        continue
                    
                    try:
                        matches = re.finditer(pattern, text, re.IGNORECASE)
                        for match in matches:
                            # Extract larger context (±300 characters)
                            start = max(0, match.start() - 300)
                            end = min(len(text), match.end() + 300)
                            context = text[start:end].strip()
                            
                            clauses.append(Clause(
                                type=clause_type,
                                title=title,
                                content=context,
                                significance=significance,
                                location=match.start(),
                                matched_text=match.group()
                            ))
                    except re.error as e:
                        logger.warning(f"Invalid regex pattern '{pattern}': {e}")
                        continue
                        
        except Exception as e:
            logger.error(f"Error in clause extraction: {e}")
        
        # Remove duplicate clauses
        clauses = self._deduplicate_clauses(clauses)
        
        return clauses
    
    def _extract_key_terms(self, text: str) -> List[KeyTerm]:
        """Extract and define key legal terms using modularized legal terms"""
        key_terms = []
        
        try:
            # Get all legal terms
            legal_terms = LEGAL_TERMS
            
            for term, definition_data in legal_terms.items():
                if isinstance(definition_data, dict):
                    definition = definition_data.get('definition', '')
                    category = definition_data.get('category', 'legal')
                    importance = definition_data.get('importance', 'medium')
                else:
                    # Handle legacy string definitions
                    definition = definition_data
                    category = 'legal'
                    importance = 'medium'
                
                # Search for term in text (case insensitive)
                pattern = re.escape(term)
                try:
                    match = re.search(pattern, text, re.IGNORECASE)
                    
                    if match:
                        # Find context around the term
                        start = max(0, match.start() - 75)
                        end = min(len(text), match.end() + 75)
                        context = text[start:end].strip()
                        
                        key_terms.append(KeyTerm(
                            term=term.title(),
                            definition=definition,
                            category=category,
                            context=context,
                            importance=importance,
                            location=match.start()
                        ))
                except re.error as e:
                    logger.warning(f"Invalid regex pattern for term '{term}': {e}")
                    continue
                    
        except Exception as e:
            logger.error(f"Error in key terms extraction: {e}")
        
        return key_terms
    
    def _generate_action_items(
        self, 
        text: str, 
        document_type: str, 
        risks: List[Risk], 
        clauses: List[Clause]
    ) -> List[ActionItem]:
        """Generate action items based on document content and analysis results using modularized templates"""
        action_items = []
        
        try:
            # Get document type specific action items
            action_templates = get_action_items_for_document_type(document_type)
            
            for template in action_templates:
                action_item_data = create_action_item_with_deadline(template)
                action_items.append(ActionItem(**action_item_data))
            
            # Generate action items from high-risk findings
            high_risks = [r for r in risks if r.level == "high"]
            risk_template = get_risk_action_template("high")
            
            for i, risk in enumerate(high_risks[:3]):  # Limit to top 3 high risks
                action_item_data = {
                    "id": f"risk_{i+1}",
                    "task": f"{risk_template['task_prefix']}: {risk.title}",
                    "deadline": (datetime.now() + timedelta(days=risk_template['days_offset'])).isoformat(),
                    "priority": risk_template['priority'],
                    "status": "pending",
                    "description": f"{risk_template['description_prefix']}: {risk.description[:100]}...",
                    "category": risk_template['category']
                }
                action_items.append(ActionItem(**action_item_data))
            
            # Extract deadline-related action items from text
            deadline_patterns = get_deadline_patterns()
            
            for pattern_data in deadline_patterns:
                pattern = pattern_data['pattern']
                priority = pattern_data['priority']
                category = pattern_data['category']
                
                try:
                    matches = re.finditer(pattern, text, re.IGNORECASE)
                    for i, match in enumerate(matches):
                        if i >= 5:  # Limit extracted deadlines
                            break
                            
                        try:
                            days = int(match.group(1))
                            unit = match.group(2).lower()
                            
                            # Convert to days using the utility function
                            days = days * get_time_multiplier(unit)
                            
                            deadline = (datetime.now() + timedelta(days=days)).isoformat()
                            
                            action_item_data = {
                                "id": f"deadline_{category}_{i+1}",
                                "task": f"Complete requirement: {match.group()[:50]}...",
                                "deadline": deadline,
                                "priority": priority,
                                "status": "pending",
                                "description": f"Action item extracted from document: {match.group()}",
                                "category": category
                            }
                            action_items.append(ActionItem(**action_item_data))
                        except (ValueError, IndexError):
                            continue
                except re.error as e:
                    logger.warning(f"Invalid regex pattern '{pattern}': {e}")
                    continue
                    
        except Exception as e:
            logger.error(f"Error in action items generation: {e}")
        
        return action_items
    
    def _extract_compliance_items(self, text: str, document_type: str) -> List[ComplianceItem]:
        """Extract compliance-related items from the document using modularized patterns"""
        compliance_items = []
        
        try:
            # Get compliance patterns for the specific document type
            compliance_patterns = get_compliance_patterns_for_document_type(document_type)
            
            for category, patterns in compliance_patterns.items():
                for pattern_data in patterns:
                    pattern = pattern_data['pattern']
                    description = pattern_data['description']
                    requirement_level = pattern_data['requirement_level']
                    
                    try:
                        matches = re.finditer(pattern, text, re.IGNORECASE)
                        for match in matches:
                            start = max(0, match.start() - 100)
                            end = min(len(text), match.end() + 100)
                            context = text[start:end].strip()
                            
                            compliance_items.append(ComplianceItem(
                                type=category,
                                description=description,
                                requirement_level=requirement_level,
                                context=context,
                                location=match.start()
                            ))
                    except re.error as e:
                        logger.warning(f"Invalid regex pattern '{pattern}': {e}")
                        continue
                        
        except Exception as e:
            logger.error(f"Error in compliance extraction: {e}")
        
        return compliance_items
    
    def _generate_recommendations(
        self, 
        risks: List[Risk], 
        clauses: List[Clause], 
        document_type: str,
        financial_impact: List[FinancialItem]
    ) -> List[str]:
        """Generate recommendations based on identified risks and clauses using modularized templates"""
        recommendations = []
        
        try:
            # Get risk-based recommendations
            risk_recommendations = get_risk_based_recommendations(risks)
            recommendations.extend(risk_recommendations)
            
            # Get clause-based recommendations
            clause_recommendations = get_clause_based_recommendations(clauses)
            recommendations.extend(clause_recommendations)
            
            # Get document type specific recommendations
            doc_type_recommendations = get_document_type_recommendations(document_type)
            recommendations.extend(doc_type_recommendations)
            
            # Get financial recommendations
            financial_recommendations = get_financial_recommendations(financial_impact)
            recommendations.extend(financial_recommendations)
            
            # Get general recommendations
            general_recommendations = get_general_recommendations()
            recommendations.extend(general_recommendations)
            
            # Sort recommendations by priority
            recommendations = sort_recommendations_by_priority(recommendations)
            
            # Remove duplicates while preserving order
            seen = set()
            unique_recommendations = []
            for rec in recommendations:
                if rec not in seen:
                    seen.add(rec)
                    unique_recommendations.append(rec)
            
            return unique_recommendations
            
        except Exception as e:
            logger.error(f"Error in recommendations generation: {e}")
            return [
                "📄 Keep copies of all signed documents in a secure location",
                "⏰ Add all important deadlines and dates to your calendar",
                "❓ Ask questions about any unclear terms before signing"
            ]
    
    def _calculate_confidence_score(
        self, 
        text: str, 
        risks: List[Risk], 
        clauses: List[Clause], 
        key_terms: List[KeyTerm], 
        financial_impact: List[FinancialItem]
    ) -> float:
        """Calculate confidence score based on analysis completeness and text characteristics"""
        
        # Base score from text characteristics
        text_length = len(text)
        word_count = len(text.split())
        
        # Length-based confidence
        if text_length < 500:
            length_score = 0.3
        elif text_length < 2000:
            length_score = 0.6
        else:
            length_score = 0.9
        
        # Feature-based confidence
        feature_count = len(risks) + len(clauses) + len(key_terms) + len(financial_impact)
        feature_score = min(0.9, feature_count / 20.0)
        
        # Structure-based confidence (presence of typical document elements)
        structure_indicators = [
            r'\b(?:agreement|contract|terms)\b',
            r'\b(?:party|parties)\b',
            r'\b(?:section|clause|paragraph)\b',
            r'\b(?:effective|date|term)\b'
        ]
        
        structure_matches = sum(1 for pattern in structure_indicators 
                              if re.search(pattern, text, re.IGNORECASE))
        structure_score = min(0.8, structure_matches / len(structure_indicators))
        
        # Weighted final score
        confidence_score = (
            length_score * 0.3 +
            feature_score * 0.4 +
            structure_score * 0.3
        )
        
        return round(confidence_score, 2)
    
    def _deduplicate_risks(self, risks: List[Risk]) -> List[Risk]:
        """Remove duplicate or very similar risks"""
        if not risks:
            return risks
        
        deduplicated = []
        seen_titles = set()
        
        for risk in risks:
            # Create a normalized title for comparison
            normalized_title = re.sub(r'\W+', ' ', risk.title.lower()).strip()
            
            if normalized_title not in seen_titles:
                seen_titles.add(normalized_title)
                deduplicated.append(risk)
        
        return deduplicated
    
    def _deduplicate_clauses(self, clauses: List[Clause]) -> List[Clause]:
        """Remove duplicate clauses based on type and location"""
        if not clauses:
            return clauses
        
        # Sort by location first
        clauses.sort(key=lambda x: x.location or 0)
        
        deduplicated = []
        for clause in clauses:
            # Check if we already have a similar clause nearby
            is_duplicate = False
            for existing in deduplicated:
                if (clause.type == existing.type and 
                    abs((clause.location or 0) - (existing.location or 0)) < 200):
                    is_duplicate = True
                    break
            
            if not is_duplicate:
                deduplicated.append(clause)
        
        return deduplicated
    
    def debug_analysis(self, text: str, document_type: str = "general") -> Dict:
        """Debug function to understand analysis results"""
        
        logger.info(f"=== DEBUG ANALYSIS ===")
        logger.info(f"Document type: {document_type}")
        logger.info(f"Text length: {len(text)}")
        logger.info(f"Text preview: {text[:200]}...")
        
        # Test each component separately
        risks = self._identify_risks(text, document_type)
        clauses = self._extract_clauses(text, document_type)
        key_terms = self._extract_key_terms(text)
        financial_impact = self.financial_extractor.extract_financial_information(text)
        
        # Check for basic patterns
        dollar_matches = re.findall(r'\$[\d,]+(?:\.\d{2})?', text)
        date_matches = re.findall(r'\d{1,2}/\d{1,2}/\d{4}', text)
        
        debug_results = {
            "text_length": len(text),
            "word_count": len(text.split()),
            "text_preview": text[:200],
            "risks_found": len(risks),
            "clauses_found": len(clauses),
            "key_terms_found": len(key_terms),
            "financial_items_found": len(financial_impact),
            "dollar_amounts": dollar_matches,
            "dates_found": date_matches,
            "sample_risks": [r.dict() for r in risks[:3]],
            "sample_clauses": [c.dict() for c in clauses[:3]],
            "sample_key_terms": [t.dict() for t in key_terms[:3]],
            "sample_financial": [f.dict() for f in financial_impact[:3]]
        }
        
        logger.info(f"Debug results: {debug_results}")
        logger.info(f"=== END DEBUG ===")
        
        return debug_results