# simple_service.py
from flask import Flask, request, jsonify
import logging

app = Flask(__name__)
logging.basicConfig(level=logging.INFO)

# تحلیلگر احساسات ساده (همان منطق قبلی)
def analyze_sentiment_simple(text: str) -> dict:
    positive_words = ['عالی', 'خوب', 'عالیه', 'دوست', 'جذاب', 'هیجان', 'زیبا', 'محشره', 'مثبت']
    negative_words = ['بد', 'ضعیف', 'بی', 'مشکل', 'خراب', 'زشت', 'ناراحت', 'منفی']
    text_lower = text.lower()
    positive_count = sum(1 for word in positive_words if word in text_lower)
    negative_count = sum(1 for word in negative_words if word in text_lower)
    if positive_count > negative_count:
        return {"sentiment": "مثبت", "confidence": 0.85, "label": "positive"}
    elif negative_count > positive_count:
        return {"sentiment": "منفی", "confidence": 0.85, "label": "negative"}
    else:
        return {"sentiment": "خنثی", "confidence": 0.7, "label": "neutral"}

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "healthy", "service": "simple-sentiment"})

@app.route('/analyze', methods=['POST'])
def analyze():
    try:
        data = request.get_json()
        text = data.get('text', '')
        if not text:
            return jsonify({"error": "متن ارسال نشده"}), 400
        result = analyze_sentiment_simple(text)
        logging.info(f"✅ تحلیل متن: '{text[:50]}...' -> {result['sentiment']}")
        return jsonify(result)
    except Exception as e:
        logging.error(f"❌ خطا: {e}")
        return jsonify({"error": "خطای پردازش داخلی"}), 500

if __name__ == '__main__':
    logging.info("🚀 سرویس ساده تحلیل احساسات در حال راه‌اندازی روی پورت 8001...")
    app.run(host='0.0.0.0', port=8001, debug=False)
