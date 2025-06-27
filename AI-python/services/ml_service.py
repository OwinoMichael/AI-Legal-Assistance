from transformers import pipeline
from sentence_transformers import SentenceTransformer
import torch
from typing import List, Optional
from config.settings import get_settings, MODEL_CONFIGS
import logging

logger = logging.getLogger(__name__)

class MLService:
    """Machine Learning service for embeddings and summarization"""
    
    def __init__(self):
        self.settings = get_settings()
        self.models_loaded = False
        
        # Model placeholders
        self.embedder: Optional[SentenceTransformer] = None
        self.summarizer = None
        
    def load_models(self):
        """Load all ML models"""
        try:
            logger.info("Loading embedding model...")
            self.embedder = SentenceTransformer(
                MODEL_CONFIGS["embedding"]["model_name"],
                device=MODEL_CONFIGS["embedding"]["device"]
            )
            
            logger.info("Loading summarization model...")
            self.summarizer = pipeline(
                "summarization",
                model=MODEL_CONFIGS["summarization"]["model_name"],
                device=0 if MODEL_CONFIGS["summarization"]["device"] == "cuda" else -1
            )
            
            self.models_loaded = True
            logger.info("All models loaded successfully!")
            
        except Exception as e:
            logger.error(f"Error loading models: {str(e)}")
            raise Exception(f"Failed to load ML models: {str(e)}")
    
    def get_embedding(self, text: str) -> List[float]:
        """Generate embedding for text"""
        if not self.embedder:
            raise Exception("Embedding model not loaded")
        
        try:
            # Truncate text if too long
            max_length = 512  # Most models have token limits
            if len(text.split()) > max_length:
                text = ' '.join(text.split()[:max_length])
            
            embedding = self.embedder.encode(
                text,
                normalize_embeddings=MODEL_CONFIGS["embedding"]["normalize_embeddings"]
            )
            return embedding.tolist()
            
        except Exception as e:
            logger.error(f"Error generating embedding: {str(e)}")
            raise Exception(f"Embedding generation failed: {str(e)}")
    
    def summarize_text(self, text: str) -> str:
        """Generate summary for text"""
        if not self.summarizer:
            raise Exception("Summarization model not loaded")
        
        try:
            # Check text length
            word_count = len(text.split())
            if word_count < self.settings.min_summary_length:
                raise Exception("Text too short for summarization")
            
            # Adjust max_length based on input length
            max_length = min(
                self.settings.max_summary_length,
                max(word_count // 4, self.settings.min_summary_length)
            )
            
            # Handle very long texts by chunking
            if word_count > 1000:
                # Take first 1000 words for summarization
                text = ' '.join(text.split()[:1000])
            
            summary_result = self.summarizer(
                text,
                max_length=max_length,
                min_length=self.settings.min_summary_length,
                do_sample=False,
                truncation=True
            )
            
            return summary_result[0]['summary_text']
            
        except Exception as e:
            logger.error(f"Error generating summary: {str(e)}")
            raise Exception(f"Summarization failed: {str(e)}")