/**
 * پردازشگر متن فارسی - نسخه بهبود یافته
 */
class PersianTextProcessor {
  
  // لیست کلمات توقف فارسی (Stop Words)
  static persianStopWords = new Set([
    'از', 'به', 'با', 'در', 'را', 'که', 'این', 'آن', 'برای', 'و',
    'تا', 'اما', 'یا', 'هم', 'یک', 'خیلی', 'همه', 'هیچ', 'چند',
    'بر', 'بی', 'پس', 'اگر', 'چون', 'چه', 'همچنین', 'بنابراین'
  ]);
  
  /**
   * تمیز کردن متن فارسی
   */
  static cleanText(text) {
    if (!text || typeof text !== 'string') return '';
    
    return text
      .replace(/[^\u0600-\u06FF\uFB8A\u067E\u0686\u06AF\u200C\u200F\s\.،؛:?؟!()\[\]0-9]/g, '')
      .replace(/\s+/g, ' ')
      .replace(/[٫٬]/g, '،')
      .trim();
  }
  
  /**
   * شمارش کلمات فارسی
   */
  static wordCount(text) {
    const cleaned = this.cleanText(text);
    if (!cleaned) return 0;
    
    const words = cleaned.split(/[\s\.،؛:?؟!()\[\]]+/).filter(w => w.length > 0);
    return words.length;
  }
  
  /**
   * شمارش حروف فارسی (بدون فاصله)
   */
  static charCount(text) {
    const cleaned = this.cleanText(text);
    if (!cleaned) return 0;
    
    const persianChars = cleaned.replace(/\s/g, '').match(/[\u0600-\u06FF\uFB8A\u067E\u0686\u06AF\u200C\u200F]/g);
    return persianChars ? persianChars.length : 0;
  }
  
  /**
   * استخراج کلمات کلیدی هوشمند
   */
  static extractKeywords(text, limit = 5, excludeStopWords = true) {
    const cleaned = this.cleanText(text);
    if (!cleaned) return [];
    
    const words = cleaned
      .split(/[\s\.،؛:؟!()\[\]]+/) // تقسیم به کلمات
      .filter(word => {
        // فیلتر کلمات کوتاه
        if (word.length < 2) return false;
        
        // حذف اعداد خالص
        if (/^\d+$/.test(word)) return false;
        
        // حذف stop words اگر فعال باشد
        if (excludeStopWords && this.persianStopWords.has(word)) return false;
        
        // فقط کلمات فارسی معتبر
        return /^[\u0600-\u06FF\uFB8A\u067E\u0686\u06AF\u200C\u200F]+$/.test(word);
      });
    
    const frequency = {};
    
    words.forEach(word => {
      frequency[word] = (frequency[word] || 0) + 1;
    });
    
    // محاسبه وزن کلمات (بر اساس تکرار و طول)
    const weightedWords = Object.entries(frequency).map(([word, count]) => {
      const lengthScore = Math.min(word.length / 10, 1); // کلمات بلندتر مهم‌ترند
      const frequencyScore = Math.min(count / 3, 1); // تکرار بیش از ۳ امتیاز اضافه نمی‌دهد
      const score = (frequencyScore * 0.7) + (lengthScore * 0.3);
      
      return { word, count, score };
    });
    
    // مرتب‌سازی بر اساس امتیاز
    return weightedWords
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(item => item.word);
  }
  
  /**
   * تشخیص ساده احساسات متن فارسی - نسخه بهبود یافته
   */
  static analyzeSentiment(text) {
    const positiveWords = {
      'خوب': 1, 'عالی': 2, 'ممتاز': 2, 'زیبا': 1, 'دوست': 1,
      'عالیه': 2, 'محشر': 2, 'کارآمد': 1, 'راضی': 1, 'مفید': 1,
      'آسان': 1, 'سریع': 1, 'ارزان': 1, 'بهترین': 2, 'پیشرفته': 1,
      'کیفیت': 1, 'خوشحال': 1, 'متشکر': 1, 'ممنون': 1
    };
    
    const negativeWords = {
      'بد': 1, 'ضعیف': 2, 'مشکل': 1, 'خراب': 2, 'بدترین': 2,
      'زشت': 1, 'ناراحت': 1, 'گران': 1, 'پیچیده': 1, 'کند': 1,
      'نامناسب': 1, 'ناامید': 1, 'انتقاد': 1, 'اشکال': 1, 'خطا': 1
    };
    
    const cleaned = this.cleanText(text).toLowerCase();
    let positiveScore = 0;
    let negativeScore = 0;
    
    // بررسی کلمات مثبت
    Object.entries(positiveWords).forEach(([word, weight]) => {
      const regex = new RegExp(word, 'g');
      const matches = cleaned.match(regex);
      if (matches) positiveScore += matches.length * weight;
    });
    
    // بررسی کلمات منفی
    Object.entries(negativeWords).forEach(([word, weight]) => {
      const regex = new RegExp(word, 'g');
      const matches = cleaned.match(regex);
      if (matches) negativeScore += matches.length * weight;
    });
    
    // محاسبه امتیاز نهایی
    const total = positiveScore + negativeScore;
    if (total === 0) {
      return { sentiment: 'خنثی', score: 0, confidence: 'low' };
    }
    
    const score = (positiveScore - negativeScore) / total;
    
    let sentiment, confidence;
    if (score > 0.4) {
      sentiment = 'مثبت قوی';
      confidence = 'high';
    } else if (score > 0.1) {
      sentiment = 'مثبت';
      confidence = 'medium';
    } else if (score < -0.4) {
      sentiment = 'منفی قوی';
      confidence = 'high';
    } else if (score < -0.1) {
      sentiment = 'منفی';
      confidence = 'medium';
    } else {
      sentiment = 'خنثی';
      confidence = 'low';
    }
    
    return {
      sentiment,
      score: Math.round(score * 100) / 100,
      confidence,
      positive_score: positiveScore,
      negative_score: negativeScore,
      total_words: this.wordCount(text)
    };
  }
  
  /**
   * شناسایی موضوع متن (ساده)
   */
  static detectTopic(text) {
    const topics = {
      'فناوری': ['کامپیوتر', 'برنامه', 'نرم‌افزار', 'هوش', 'مصنوعی', 'داده', 'اینترنت'],
      'اقتصاد': ['بازار', 'سرمایه', 'سهام', 'تجارت', 'پول', 'اقتصاد', 'فروش'],
      'سلامتی': ['درمان', 'بیمار', 'دارو', 'سلامت', 'پزشک', 'بیماری', 'کلینیک'],
      'آموزش': ['دانشگاه', 'مدرسه', 'تحصیل', 'آموزش', 'کتاب', 'درس', 'معلم'],
      'سیاست': ['دولت', 'رئیس', 'قانون', 'سیاست', 'انتخابات', 'وزیر', 'کشور']
    };
    
    const cleaned = this.cleanText(text).toLowerCase();
    let scores = {};
    
    Object.entries(topics).forEach(([topic, keywords]) => {
      scores[topic] = 0;
      keywords.forEach(keyword => {
        if (cleaned.includes(keyword)) {
          scores[topic] += 1;
        }
      });
    });
    
    // یافتن موضوع با بیشترین امتیاز
    const sortedTopics = Object.entries(scores)
      .sort((a, b) => b[1] - a[1])
      .filter(([_, score]) => score > 0);
    
    if (sortedTopics.length === 0) {
      return { topic: 'نامشخص', confidence: 'low' };
    }
    
    const [mainTopic, score] = sortedTopics[0];
    const confidence = score > 2 ? 'high' : score > 0 ? 'medium' : 'low';
    
    return {
      topic: mainTopic,
      confidence,
      score,
      all_topics: sortedTopics.slice(0, 3)
    };
  }
}

module.exports = PersianTextProcessor;
