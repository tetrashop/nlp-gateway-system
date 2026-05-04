import re

class SimpleTranslator:
    def __init__(self):
        # دیکشنری ساده فارسی به انگلیسی
        self.fa_to_en = {
            'سلام': 'hello',
            'خداحافظ': 'goodbye',
            'ممنون': 'thanks',
            'متشکرم': 'thank you',
            'بله': 'yes',
            'خیر': 'no',
            'خوب': 'good',
            'بد': 'bad',
            'عالی': 'excellent',
            'زیبا': 'beautiful',
            'دوست': 'friend',
            'خانه': 'house',
            'ماشین': 'car',
            'کتاب': 'book',
            'قلم': 'pen',
            'آب': 'water',
            'نان': 'bread',
            'پروژه': 'project',
            'گیت وی': 'gateway',
        }
        
        # دیکشنری معکوس انگلیسی به فارسی
        self.en_to_fa = {v: k for k, v in self.fa_to_en.items()}
    
    def detect_language(self, text: str) -> str:
        """تشخیص زبان ساده بر اساس کاراکترها"""
        persian_chars = re.findall(r'[\u0600-\u06FF]', text)
        english_chars = re.findall(r'[a-zA-Z]', text)
        
        if len(persian_chars) > len(english_chars):
            return 'fa'
        elif len(english_chars) > len(persian_chars):
            return 'en'
        else:
            return 'unknown'
    
    def translate_word(self, word: str, source: str, target: str) -> str:
        """ترجمه یک کلمه"""
        word_lower = word.lower()
        if source == 'fa' and target == 'en':
            return self.fa_to_en.get(word_lower, word)
        elif source == 'en' and target == 'fa':
            return self.en_to_fa.get(word_lower, word)
        return word
    
    def translate(self, text: str, source: str = 'auto', target: str = 'en') -> dict:
        """ترجمه متن"""
        if source == 'auto':
            source = self.detect_language(text)
        
        # تقسیم متن به کلمات
        words = text.split()
        translated_words = [self.translate_word(w, source, target) for w in words]
        translated_text = ' '.join(translated_words)
        
        return {
            'source_language': source,
            'target_language': target,
            'original': text,
            'translated': translated_text,
            'word_count': len(words)
        }

translator = SimpleTranslator()
