from pydantic_settings import BaseSettings
from typing import Optional
import os

class Settings(BaseSettings):
    # API Configuration
    app_name: str = "Legal Document Analysis API"
    version: str = "1.0.0"
    debug: bool = False
    
    # Model Configuration
    embedding_model: str = "sentence-transformers/all-mpnet-base-v2"
    summarization_model: str = "facebook/bart-large-cnn"
    classification_model: str = "microsoft/DialoGPT-medium"
    spacy_model: str = "en_core_web_sm"
    
    # Processing Configuration
    max_text_length: int = 50000
    max_summary_length: int = 300
    min_summary_length: int = 50
    embedding_batch_size: int = 32
    
    # Analysis Configuration
    risk_confidence_threshold: float = 0.5
    clause_context_window: int = 200
    financial_amount_threshold: float = 0.0
    
    # Cache Configuration
    enable_caching: bool = True
    cache_ttl: int = 3600  # 1 hour
    
    # Logging Configuration
    log_level: str = "INFO"
    log_file: Optional[str] = None
    
    # Database Configuration (for future use)
    database_url: Optional[str] = None
    
    # Security Configuration
    api_key: Optional[str] = None
    allowed_origins: list = ["*"]
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

# Global settings instance
_settings = None

def get_settings() -> Settings:
    global _settings
    if _settings is None:
        _settings = Settings()
    return _settings

# Model configurations
MODEL_CONFIGS = {
    "embedding": {
        "model_name": "sentence-transformers/all-mpnet-base-v2",
        "device": "cpu",  # Change to "cuda" if GPU available
        "normalize_embeddings": True
    },
    "summarization": {
        "model_name": "facebook/bart-large-cnn",
        "device": "cpu",
        "max_length": 300,
        "min_length": 50,
        "do_sample": False
    },
    "classification": {
        "model_name": "microsoft/DialoGPT-medium",
        "device": "cpu",
        "return_all_scores": True
    }
}

# Document type configurations
DOCUMENT_TYPES = {
    "employment": {
        "name": "Employment Contract",
        "key_sections": ["compensation", "benefits", "termination", "non-compete", "confidentiality"],
        "risk_factors": ["at-will", "non-compete", "ip-assignment", "confidentiality"],
        "action_items": ["review_terms", "negotiate_salary", "understand_benefits"]
    },
    "lease": {
        "name": "Lease Agreement",
        "key_sections": ["rent", "deposit", "maintenance", "termination", "utilities"],
        "risk_factors": ["late_fees", "damage_liability", "early_termination"],
        "action_items": ["inspect_property", "understand_fees", "review_rules"]
    },
    "service": {
        "name": "Service Agreement",
        "key_sections": ["scope", "payment", "deliverables", "timeline", "liability"],
        "risk_factors": ["scope_creep", "payment_terms", "liability_limits"],
        "action_items": ["define_scope", "set_milestones", "review_payments"]
    },
    "vendor": {
        "name": "Vendor Contract",
        "key_sections": ["pricing", "delivery", "quality", "warranties", "support"],
        "risk_factors": ["delivery_delays", "quality_issues", "support_limitations"],
        "action_items": ["verify_credentials", "check_references", "define_sla"]
    },
    "nda": {
        "name": "Non-Disclosure Agreement",
        "key_sections": ["confidential_info", "obligations", "duration", "exceptions"],
        "risk_factors": ["broad_definition", "long_duration", "return_requirements"],
        "action_items": ["understand_scope", "check_duration", "review_exceptions"]
    },
    "general": {
        "name": "General Legal Document",
        "key_sections": ["parties", "terms", "obligations", "termination"],
        "risk_factors": ["unclear_terms", "one_sided_clauses", "dispute_resolution"],
        "action_items": ["understand_obligations", "check_termination", "review_disputes"]
    }
}