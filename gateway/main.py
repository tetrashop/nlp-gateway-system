"""
سرویس تحلیل احساسات متن فارسی با استفاده از مدل BERT از پیش آموزش دیده.
این سرویس به صورت داخلی اجرا می‌شود و توسط API Gateway فراخوانی می‌گردد.
"""
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from transformers import pipeline, AutoTokenizer, AutoModelForSequenceClassification
import torch
import logging
from typing import Dict, Any

# تنظیمات لاگ
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# تعریف مدل درخواست
class SentimentRequest(BaseModel):
    text: str
    truncation: bool = True
    max_length: int = 512

class SentimentResponse(BaseModel):
    sentiment: str
    confidence: float
    label_id: int
    raw_output: Dict[str, Any]

# ایجاد اپلیکیشن FastAPI
app = FastAPI(
    title="سرویس تحلیل احساسات فارسی",
    description="سرویس داخلی برای تحلیل احساسات متن‌های فارسی با استفاده از مدل HooshvareLab/bert-fa-base-uncased-sentiment",
    version="1.0.0"
)

# بارگذاری مدل در حافظه هنگام راه‌اندازی سرویس
@app.on_event("startup")
async def load_model():
    """بارگذاری مدل و توکنایزر هنگام راه‌اندازی سرویس"""
    global sentiment_pipeline
    try:
        logger.info("در حال بارگذاری مدل تحلیل احساسات فارسی...")
        
        # استفاده از مدل از پیش آموزش دیده برای تحلیل احساسات فارسی
        model_name = "HooshvareLab/bert-fa-base-uncased-sentiment"
        
        # بارگذاری مدل و توکنایزر
        tokenizer = AutoTokenizer.from_pretrained(model_name)
        model = AutoModelForSequenceClassification.from_pretrained(model_name)
        
        # ایجاد pipeline برای تحلیل احساسات
        sentiment_pipeline = pipeline(
            "sentiment-analysis",
            model=model,
            tokenizer=tokenizer,
            device=0 if torch.cuda.is_available() else -1  # استفاده از GPU اگر موجود باشد
        )
        
        logger.info(f"✅ مدل {model_name} با موفقیت بارگذاری شد.")
        logger.info(f"📊 دستگاه پردازش: {'GPU' if torch.cuda.is_available() else 'CPU'}")
        
    except Exception as e:
        logger.error(f"❌ خطا در بارگذاری مدل: {e}")
        raise

@app.get("/")
async def root():
    """صفحه اصلی سرویس"""
    return {
        "service": "Sentiment Analysis API",
        "language": "Persian (Farsi)",
        "status": "active",
        "model": "HooshvareLab/bert-fa-base-uncased-sentiment",
        "endpoints": {
            "analyze": "POST /analyze",
            "health": "GET /health",
            "info": "GET /info"
        }
    }

@app.get("/health")
async def health_check():
    """بررسی سلامت سرویس و مدل"""
    try:
        # تست مدل با یک جمله نمونه
        test_text = "این یک تست است"
        _ = sentiment_pipeline(test_text, truncation=True, max_length=512)
        
        return {
            "status": "healthy",
            "model_loaded": True,
            "service": "sentiment-analysis"
        }
    except Exception as e:
        logger.error(f"Health check failed: {e}")
        raise HTTPException(status_code=503, detail="Model not ready")

@app.get("/info")
async def model_info():
    """اطلاعات درباره مدل استفاده شده"""
    return {
        "model_name": "HooshvareLab/bert-fa-base-uncased-sentiment",
        "task": "sentiment-analysis",
        "language": "fa",
        "labels": ["negative", "neutral", "positive"],
        "max_length": 512,
        "description": "BERT base uncased model for Persian sentiment analysis"
    }

@app.post("/analyze", response_model=SentimentResponse)
async def analyze_sentiment(request: SentimentRequest):
    """
    تحلیل احساسات متن فارسی ورودی
    
    پارامترها:
    - text: متن فارسی برای تحلیل
    - truncation: کوتاه کردن متن اگر طولانی‌تر از max_length باشد (پیش‌فرض: True)
    - max_length: حداکثر طول توکن (پیش‌فرض: 512)
    
    پاسخ:
    - sentiment: برچسب احساس (negative/neutral/positive)
    - confidence: میزان اطمینان مدل (بین 0 تا 1)
    - label_id: شناسه عددی برچسب
    - raw_output: خروجی خام مدل
    """
    try:
        logger.info(f"📨 دریافت درخواست تحلیل احساسات. طول متن: {len(request.text)} کاراکتر")
        
        # تحلیل احساسات با استفاده از pipeline
        result = sentiment_pipeline(
            request.text,
            truncation=request.truncation,
            max_length=request.max_length
        )[0]  # pipeline لیست برمی‌گرداند، اولین عنصر را بگیر
        
        # نگاشت label به متن فارسی خوانا
        label_mapping = {
            "LABEL_0": {"fa": "منفی", "en": "negative", "id": 0},
            "LABEL_1": {"fa": "خنثی", "en": "neutral", "id": 1},
            "LABEL_2": {"fa": "مثبت", "en": "positive", "id": 2}
        }
        
        label_info = label_mapping.get(result['label'], {"fa": "نامشخص", "en": "unknown", "id": -1})
        
        response = SentimentResponse(
            sentiment=label_info["fa"],
            confidence=round(result['score'], 4),
            label_id=label_info["id"],
            raw_output=result
        )
        
        logger.info(f"✅ تحلیل انجام شد. نتیجه: {response.sentiment} (اعتماد: {response.confidence})")
        return response
        
    except Exception as e:
        logger.error(f"❌ خطا در تحلیل احساسات: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"خطا در پردازش متن: {str(e)}"
        )

if __name__ == "__main__":
    import uvicorn
    logger.info("🚀 راه‌اندازی سرویس تحلیل احساسات فارسی...")
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8001,
        log_level="info"
    )
