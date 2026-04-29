from pydantic import BaseModel
from typing import List, Optional

class TextRequest(BaseModel):
    text: str
    language: Optional[str] = "fa"

class SentimentResponse(BaseModel):
    sentiment: str
    confidence: float

class TranslationRequest(BaseModel):
    text: str
    target_lang: str = "en"

class NLResponse(BaseModel):
    result: dict
