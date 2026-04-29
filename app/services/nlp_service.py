from transformers import pipeline
from app.config import settings

class NLPService:
    def __init__(self):
        # بارگذاری مدل پیش‌فرض (می‌توانید چند مدل را map کنید)
        self.sentiment_pipeline = pipeline(
            "sentiment-analysis",
            model=settings.MODEL_NAME,
            device=-1  # CPU; برای GPU عدد 0 بگذارید
        )
        # در آینده مدل‌های دیگر را هم اضافه کنید (ترجمه، NER، خلاصه‌سازی)

    def analyze_sentiment(self, text: str) -> dict:
        result = self.sentiment_pipeline(text)[0]
        return {
            "sentiment": result["label"],
            "confidence": result["score"]
        }

# نمونه singleton
nlp_service = NLPService()
