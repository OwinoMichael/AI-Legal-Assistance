from fastapi import FastAPI, HTTPException
from models.schemas import (
    TextRequest, DocumentAnalysisRequest, ComprehensiveAnalysis,
    EmbedResponse, SummaryResponse
)
from services.ml_service import MLService
from services.analysis_service import DocumentAnalysisService
from config.settings import get_settings

# Initialize FastAPI app
app = FastAPI(
    title="Legal Document Analysis API",
    description="AI-powered legal document analysis and risk assessment",
    version="1.0.0"
)

# Initialize services
settings = get_settings()
ml_service = MLService()
analysis_service = DocumentAnalysisService()

@app.on_event("startup")
async def startup_event():
    """Initialize ML models on startup"""
    print("Loading ML models...")
    ml_service.load_models()
    print("All models loaded successfully!")

@app.post("/embed", response_model=EmbedResponse)
async def embed_text(request: TextRequest):
    """Generate embeddings for text"""
    text = request.text.strip()
    if not text:
        raise HTTPException(status_code=400, detail="Text is empty.")
    
    try:
        embedding = ml_service.get_embedding(text)
        return EmbedResponse(embedding=embedding)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Embedding failed: {str(e)}")

@app.post("/summarize", response_model=SummaryResponse)
async def summarize_text(request: TextRequest):
    """Generate summary for text"""
    text = request.text.strip()
    if not text:
        raise HTTPException(status_code=400, detail="Text is empty.")
    
    try:
        summary = ml_service.summarize_text(text)
        return SummaryResponse(summary=summary)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Summarization failed: {str(e)}")

@app.post("/analyze", response_model=ComprehensiveAnalysis)
async def analyze_document(request: DocumentAnalysisRequest):
    """Perform comprehensive document analysis"""
    text = request.text.strip()
    if not text:
        raise HTTPException(status_code=400, detail="Text is empty.")
        
    try:
        analysis_result = analysis_service.analyze_document(
            text=text,
            document_type=request.document_type,
            ml_service=ml_service
        )
        return analysis_result
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "models_loaded": ml_service.models_loaded,
        "version": "1.0.0"
    }

@app.get("/")
async def root():
    """Root endpoint with API information"""
    return {
        "message": "Legal Document Analysis API",
        "version": "1.0.0",
        "endpoints": ["/embed", "/summarize", "/analyze", "/health"]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)