import re
import json
import os
from collections import Counter

class SimpleSentimentAnalyzer:
    def __init__(self, config_file='word_config.json'):
        self.config_file = config_file
        self.load_config()
        self.intensifiers = {'بسیار': 1.5, 'خیلی': 1.5, 'کاملاً': 1.3, 'فوق‌العاده': 1.8}
        self.diminishers = {'کمی': 0.7, 'مقداری': 0.7}
        self.cache = {}
        self.cache_max_size = 100
        self.request_count = {}
        self.rate_limit = 10

    def load_config(self):
        if os.path.exists(self.config_file):
            with open(self.config_file, 'r', encoding='utf-8') as f:
                config = json.load(f)
                self.word_scores = config.get('word_scores', {})
                self.bad_words = set(config.get('bad_words', []))
        else:
            self.word_scores = {
                'عالی': 2.0, 'فوق‌العاده': 2.5, 'بی‌نظیر': 2.0, 'خوب': 1.0,
                'قشنگ': 1.2, 'زیبا': 1.2, 'خوشحال': 1.0, 'موفق': 1.5,
                'پیشرفت': 1.0, 'لذت‌بخش': 1.3, 'بهترین': 2.0,
                'بد': -1.0, 'افتضاح': -2.0, 'ناخوشایند': -1.5, 'غمگین': -1.0,
                'ناراحت': -1.2, 'مشکل': -1.0, 'خراب': -1.5, 'بدترین': -2.0,
                'بی‌کیفیت': -1.8, 'ضعیف': -1.0, 'زشت': -1.2,
            }
            self.bad_words = set(['فحش', 'ناپاک', 'کثیف', 'فحاشی'])

    def save_config(self):
        config = {'word_scores': self.word_scores, 'bad_words': list(self.bad_words)}
        with open(self.config_file, 'w', encoding='utf-8') as f:
            json.dump(config, f, ensure_ascii=False, indent=2)

    def detect_language(self, text: str) -> str:
        persian_chars = re.findall(r'[\u0600-\u06FF]', text)
        english_chars = re.findall(r'[a-zA-Z]', text)
        if len(persian_chars) > len(english_chars):
            return 'fa'
        elif len(english_chars) > len(persian_chars):
            return 'en'
        return 'unknown'

    def clean_text(self, text: str) -> str:
        text = re.sub(r'[^\w\s\u0600-\u06FF]', '', text)
        text = re.sub(r'\s+', ' ', text).strip()
        return text.lower()

    def split_sentences(self, text: str) -> list:
        sentences = re.split(r'[.!?]+', text)
        return [s.strip() for s in sentences if s.strip()]

    def analyze_sentence(self, sentence: str) -> float:
        words = sentence.split()
        raw_score = sum(self.word_scores.get(w, 0) for w in words)
        intensifier = 1.0
        for w, f in self.intensifiers.items():
            if w in sentence:
                intensifier = max(intensifier, f)
        for w, f in self.diminishers.items():
            if w in sentence:
                intensifier = min(intensifier, f)
        return raw_score * intensifier

    def analyze(self, text: str, client_ip: str = 'unknown') -> dict:
        if client_ip in self.request_count:
            if len(self.request_count[client_ip]) >= self.rate_limit:
                return {'error': 'Rate limit exceeded'}
        
        cache_key = hash(text)
        if cache_key in self.cache:
            return self.cache[cache_key]
        
        lang = self.detect_language(text)
        cleaned = self.clean_text(text)
        
        if not cleaned:
            result = {'sentiment': 'neutral', 'confidence': 0.0, 'score': 0.0, 'language': lang}
        else:
            sentences = self.split_sentences(cleaned)
            if sentences:
                scores = [self.analyze_sentence(s) for s in sentences]
                final_score = sum(scores) / len(scores)
            else:
                final_score = self.analyze_sentence(cleaned)
            
            if final_score > 0.2:
                sentiment = 'positive'
                confidence = min(1.0, final_score / 2.5)
            elif final_score < -0.2:
                sentiment = 'negative'
                confidence = min(1.0, abs(final_score) / 2.5)
            else:
                sentiment = 'neutral'
                confidence = 0.5 if final_score == 0 else abs(final_score) / 1.5
            
            result = {'sentiment': sentiment, 'confidence': round(confidence, 4), 'score': round(final_score, 4), 'language': lang}
        
        self.cache[cache_key] = result
        return result

    def filter_bad_words(self, text: str, replacement: str = "***") -> str:
        words = text.split()
        filtered = [replacement if w in self.bad_words else w for w in words]
        return ' '.join(filtered)

    def convert_persian_numbers(self, text: str) -> str:
        persian_digits = '۰۱۲۳۴۵۶۷۸۹'
        english_digits = '0123456789'
        trans_table = str.maketrans(persian_digits, english_digits)
        return text.translate(trans_table)

    def extract_entities(self, text: str) -> dict:
        entities = {'dates': [], 'phones': [], 'emails': []}
        date_pattern = r'\b(?:13|14)\d{2}[/-](?:0?[1-9]|1[0-2])[/-](?:0?[1-9]|[12][0-9]|3[01])\b'
        entities['dates'] = re.findall(date_pattern, text)
        phone_pattern = r'\b(?:0|0098|\+98)?9\d{9}\b'
        entities['phones'] = re.findall(phone_pattern, text)
        email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
        entities['emails'] = re.findall(email_pattern, text)
        return entities

    def summarize(self, text: str, num_sentences: int = 2) -> str:
        sentences = self.split_sentences(text)
        if len(sentences) <= num_sentences:
            return text
        scored = []
        for sent in sentences:
            score = abs(self.analyze_sentence(sent))
            length_score = min(1.0, len(sent.split()) / 20)
            total = score * 0.7 + length_score * 0.3
            scored.append((total, sent))
        scored.sort(reverse=True, key=lambda x: x[0])
        summary_sents = [s[1] for s in scored[:num_sentences]]
        return ' '.join(summary_sents)

analyzer = SimpleSentimentAnalyzer()
