import os
from fastapi import FastAPI, File, Form,  Query, UploadFile, HTTPException
from fastapi.responses import StreamingResponse
import pathlib
from models.schemas import (
    TextRequest, DocumentAnalysisRequest, ComprehensiveAnalysis,
    EmbedResponse, SummaryResponse
)
from services import memory_store
from services.ml_service import MLService
from services.analysis_service import DocumentAnalysisService
from config.settings import get_settings
from services.pdf_plumber_extractor import PdfPlumberExtractor
from services.memory_store import MemoryStore
from services import memory_store
from uuid import uuid4

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



@app.post("/analyze", response_model=ComprehensiveAnalysis)
async def analyze_document(
    file: UploadFile = File(...),
    document_type: str = Form("general"),
    extract_tables: bool = Form(False),
    detect_invoice_tables: bool = Form(False)
):
    """Perform comprehensive document analysis with optional table extraction"""
    
    # Add logging and validation
    print(f"Received file: {file.filename}, size: {file.size}, content_type: {file.content_type}")
    print(f"Document type: {document_type}, extract_tables: {extract_tables}, detect_invoice_tables: {detect_invoice_tables}")
    
    # Validate file
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file provided")
    
    temp_file_path = None
    
    try:
        # 1️⃣ Read file
        contents = await file.read()
        print(f"File contents read, length: {len(contents)}")
        
        if not contents:
            raise HTTPException(status_code=400, detail="Empty file uploaded")
        
        # 2️⃣ Generate UUID-based filename to avoid conflicts
        file_extension = pathlib.Path(file.filename).suffix if file.filename else ""
        unique_filename = f"{uuid4()}{file_extension}"
        temp_file_path = f"/tmp/{unique_filename}"
        
        # Save temporary file
        with open(temp_file_path, "wb") as f:
            f.write(contents)
        print(f"Temporary file saved: {temp_file_path}")
        
        # 3️⃣ Initialize enhanced PDF extractor
        print("Initializing PDF extractor...")
        pdf_extractor = PdfPlumberExtractor()
        
        # 4️⃣ Extract content based on requirements
        extracted_content = {}
        table_summaries = []
        
        if extract_tables or detect_invoice_tables:
            print("Extracting structured content (text + tables)...")
            structured_content = pdf_extractor.extract_structured_content(temp_file_path)
            
            text = structured_content["text"].strip()
            extracted_content["text"] = text
            extracted_content["tables"] = structured_content["tables"]
            extracted_content["table_count"] = structured_content["table_count"]
            extracted_content["pages"] = structured_content["pages"]
            
            print(f"Structured extraction completed: {len(text)} chars, {extracted_content['table_count']} tables")
            
            # Generate table summaries
            for table_info in extracted_content["tables"]:
                df = table_info["dataframe"]
                summary = f"Table from Page {table_info['page']}: {len(df)} rows, {len(df.columns)} columns"
                
                # Add column names if available
                if not df.empty:
                    columns = [str(col) for col in df.columns if col and str(col).strip()]
                    if columns:
                        summary += f" (Columns: {', '.join(columns[:5])}{'...' if len(columns) > 5 else ''})"
                
                table_summaries.append(summary)
            
            # 5️⃣ Additional invoice table detection if requested
            if detect_invoice_tables:
                print("Detecting invoice-specific tables...")
                invoice_tables = pdf_extractor.find_invoice_tables(temp_file_path)
                extracted_content["invoice_tables"] = invoice_tables
                extracted_content["invoice_table_count"] = len(invoice_tables)
                print(f"Found {len(invoice_tables)} potential invoice tables")
        else:
            print("Extracting text only...")
            text = pdf_extractor.extract_text(temp_file_path).strip()
            extracted_content["text"] = text
            extracted_content["tables"] = []
            extracted_content["table_count"] = 0
            extracted_content["invoice_table_count"] = 0
        
        if not extracted_content["text"]:
            raise HTTPException(status_code=400, detail="No text could be extracted from the document")
        
        # 6️⃣ Generate document ID and save
        doc_id = str(uuid4())
        memory_store.save(doc_id, extracted_content)
        print(f"Document saved with ID: {doc_id}")
        
        # 7️⃣ Prepare text for analysis
        analysis_text = extracted_content["text"]
        
        # Append table summaries to analysis text if tables were found
        if table_summaries:
            analysis_text += "\n\n--- TABLE SUMMARIES ---\n"
            analysis_text += "\n".join(table_summaries)
        
        # 8️⃣ Perform analysis
        print("Starting analysis...")
        analysis_result = analysis_service.analyze_document(
            text=analysis_text,
            document_type=document_type,
            ml_service=ml_service
        )
        
        # 9️⃣ Create enhanced analysis result with table information
        # Convert to dict, add table fields, then recreate
        analysis_dict = analysis_result.dict() if hasattr(analysis_result, 'dict') else analysis_result.__dict__
        
        # Add table metadata
        analysis_dict.update({
            "table_count": extracted_content.get("table_count", 0),
            "has_tables": extracted_content.get("table_count", 0) > 0,
            "invoice_tables_detected": extracted_content.get("invoice_table_count", 0),
            "has_invoice_tables": extracted_content.get("invoice_table_count", 0) > 0,
            "table_summaries": table_summaries
        })
        
        # Recreate the analysis result with table fields
        enhanced_analysis = ComprehensiveAnalysis(**analysis_dict)
        
        print("Analysis completed successfully")
        
        return enhanced_analysis
        
    except HTTPException:
        # Re-raise HTTP exceptions as-is
        raise
    except Exception as e:
        print(f"Unexpected error: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")
    
    finally:
        # 🔟 Clean up temporary file
        if temp_file_path and os.path.exists(temp_file_path):
            os.remove(temp_file_path)
            print(f"Cleaned up temporary file: {temp_file_path}")

@app.post("/embed", response_model=EmbedResponse)
async def embed_text():
    record = memory_store.get_last()
    
    if not record:
        raise HTTPException(status_code=404, detail="No text found to embed.")
    
    text = record["text"]   # ✅ Extract the string
    
    embedding = ml_service.get_embedding(text)
    
    memory_store.delete_last()
    
    return EmbedResponse(embedding=embedding)

# @app.post("/chat")
# async def chat_endpoint(request: ChatRequest):
#     def generate_response():
#         # 1. Embed the user's question
#         question_embedding = ml_service.get_embedding(request.text)
        
#         # 2. Find relevant documents using vector similarity
#         relevant_docs = vector_store.similarity_search(question_embedding, top_k=3)
        
#         # 3. Create context-aware prompt
#         context = "\n".join([doc.content for doc in relevant_docs])
#         enhanced_prompt = f"""
#         Context: {context}
        
#         Question: {request.text}
        
#         Please answer based on the provided context.
#         """
        
#         # 4. Send enhanced prompt to Ollama (not embeddings)
#         for chunk in ollama_stream_response(enhanced_prompt):
#             yield f"data: {json.dumps({'text': chunk})}\n\n"
    
#     return StreamingResponse(
#         generate_response(),
#         media_type="text/event-stream",
#         headers={
#             "Cache-Control": "no-cache",
#             "Connection": "keep-alive"
#         }
#     )

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