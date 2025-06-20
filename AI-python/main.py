from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from transformers import pipeline
from sentence_transformers import SentenceTransformer
import torch

app = FastAPI()

# Load models once at startup
embedder = SentenceTransformer('sentence-transformers/all-mpnet-base-v2')
summarizer = pipeline("summarization", model="facebook/bart-large-cnn")

result = summarizer("Your long legal contract text goes here.", max_length=200, min_length=30, do_sample=False)
print(result)

# Input schema
class TextRequest(BaseModel):
    text: str

# Output schemas
class EmbedResponse(BaseModel):
    embedding: list[float]

class SummaryResponse(BaseModel):
    summary: str

# Embedding endpoint
@app.post("/embed", response_model=EmbedResponse)
async def embed_text(request: TextRequest):
    text = request.text.strip()
    if not text:
        raise HTTPException(status_code=400, detail="Text is empty.")

    embedding = embedder.encode(text).tolist()
    return EmbedResponse(embedding=embedding)

# Summary endpoint
@app.post("/summarize", response_model=SummaryResponse)
async def summarize_text(request: TextRequest):
    text = request.text.strip()
    if not text:
        raise HTTPException(status_code=400, detail="Text is empty.")

    # Summarizer models often have token limits, chunk if needed
    try:
        summary_list = summarizer(text, max_length=300, min_length=50, do_sample=False)
        summary_text = summary_list[0]['summary_text']
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Summarization failed: {str(e)}")

    return SummaryResponse(summary=summary_text)
