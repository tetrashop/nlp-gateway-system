import re
import json
from pathlib import Path

class SimpleSentimentAnalyzer:
    def __init__(self):
        # دیکشنری کلمات مثبت و منفی فارسی (می‌توانید خودتان گسترش دهید)
        self.positive_words = set([
            'عالی', 'خوب', 'عالیه', 'خوبه', 'عالیست', 'خوبست', 'زیبا', 'عالیین',
            'قشنگ', 'لذت‌بخش', '開心', 'خوشحال', 'خوش', 'پیشرفت', 'موفق', 'بهترین',
            'بی‌نظیر', 'فوق‌العاده'
        ])
        self.negative_words = set([
            'بد', 'ناخوشایند', 'افتضاح', 'بدترین', 'ناراحت', 'غمگین', 'ناراحت‌کننده',
            'مشکل', 'خراب', 'بی‌کیفیت', 'ضعیف', 'زشت'
        ])
        # کلمات تقویت‌کننده (شدت)
        self.intensifiers = set(['بسیار', 'خیلی', 'فوق‌العاده', 'کاملاً', 'کاملا'])

    def analyze(self, text: str) -> dict:
        text = text.lower()
        # شمارش کلمات مثبت و منفی (با احتساب تکرار)
        pos_count = sum(1 for word in self.positive_words if word in text)
        neg_count = sum(1 for word in self.negative_words if word in text)
        # شدت: اگر کلمات تقویت‌کننده وجود داشته باشد نمره را ضرب می‌کنیم
        intensifier = 1
        for word in self.intensifiers:
            if word in text:
                intensifier = 1.5
                break
        # نمره خام (از -1 تا 1)
        total = pos_count - neg_count
        if total > 0:
            score = min(1.0, (total / max(1, pos_count+neg_count)) * intensifier)
            sentiment = 'positive'
        elif total < 0:
            score = max(-1.0, (total / max(1, pos_count+neg_count)) * intensifier)
            sentiment = 'negative'
        else:
            score = 0.0
            sentiment = 'neutral'
        confidence = abs(score)  # اطمینان بر اساس فاصله از صفر
        return {
            'sentiment': sentiment,
            'confidence': round(confidence, 4),
            'score': round(score, 4)
        }

# نمونه singleton برای استفاده در API
analyzer = SimpleSentimentAnalyzer()
