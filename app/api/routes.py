from fastapi import APIRouter, HTTPException
from app.api.models import TextRequest, SentimentResponse
from app.services.nlp_service import nlp_service

router = APIRouter(prefix="/v1", tags=["NLP"])

@router.post("/sentiment", response_model=SentimentResponse)
async def sentiment_analysis(request: TextRequest):
    try:
        result = nlp_service.analyze_sentiment(request.text)
        return SentimentResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# نمونه endpoint برای راحت بودن: /health
@router.get("/health")
async def health():
    return {"status": "ok"}

