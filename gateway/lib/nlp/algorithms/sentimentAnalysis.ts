import { NLPResponse } from '../../../types/nlp';

// دیکشنری کلمات احساسی فارسی
const SENTIMENT_LEXICON = {
  positive: [
    'عالی', 'خوب', 'عالیه', 'زیبا', 'ممتاز', 'درخشان', 'فوقالعاده',
    'خوشحال', 'شاد', 'مسرور', 'خوشایند', 'دوست‌داشتنی', 'محبوب',
    'آرام', 'راحت', 'مطلوب', 'مناسب', 'عالیست', 'خوبی', 'خوبم',
    'عالیی', 'مثبت', 'عالیه', 'خوب', 'خوبی', 'خوبه', 'خوبم'
  ],
  negative: [
    'بد', 'ضعیف', 'مخرب', 'زشت', 'ناخوشایند', 'مشکل', 'ناراحت',
    'ناراضی', 'عصبانی', 'خشمگین', 'ناراحتم', 'بدی', 'زشتی',
    'مشکل', 'سخت', 'دشوار', 'ناامید', 'ناراحت‌کننده', 'منفی',
    'بد', 'بدی', 'بده', 'بدم', 'زشته', 'مشکل', 'سخته'
  ],
  intensifiers: {
    'خیلی': 2.0,
    'بسیار': 1.8,
    'واقعاً': 1.7,
    'اصلاً': -1.5,
    'هیچ': -1.3,
    'کم': -1.2,
    'کاملاً': 1.6,
    'کامل': 1.5,
    'شدیداً': 1.9
  },
  negations: [
    'نه', 'نیست', 'نمی', 'نبود', 'نباشد', 'نمیشه',
    'نمی‌شود', 'نمی‌کنم', 'نمی‌خواهم', 'نمی‌توانم'
  ]
};

export class SentimentAnalyzer {
  private lexicon = SENTIMENT_LEXICON;

  // تحلیل احساسات متن فارسی
  async analyze(text: string): Promise<NLPResponse> {
    const startTime = Date.now();
    
    try {
      // پیش‌پردازش متن
      const processedText = this.preprocessText(text);
      const words = processedText.split(/\s+/);
      
      let sentimentScore = 0;
      const foundKeywords: string[] = [];
      const details = {
        positiveWords: [] as string[],
        negativeWords: [] as string[],
        intensifiers: [] as string[],
        negations: [] as string[]
      };

      // تحلیل کلمه به کلمه
      for (let i = 0; i < words.length; i++) {
        const word = words[i];
        let wordScore = 0;
        let modifier = 1;

        // بررسی کلمات مثبت
        if (this.lexicon.positive.includes(word)) {
          wordScore = 1;
          details.positiveWords.push(word);
          foundKeywords.push(word);
        }
        
        // بررسی کلمات منفی
        if (this.lexicon.negative.includes(word)) {
          wordScore = -1;
          details.negativeWords.push(word);
          foundKeywords.push(word);
        }

        // بررسی تشدیدکننده‌ها
        if (this.lexicon.intensifiers[word]) {
          modifier = this.lexicon.intensifiers[word];
          details.intensifiers.push(word);
        }

        // بررسی نفی‌کننده‌ها
        if (this.lexicon.negations.includes(word)) {
          modifier = -modifier;
          details.negations.push(word);
        }

        // اعمال تشدید یا نفی
        if (wordScore !== 0) {
          sentimentScore += wordScore * modifier;
        }
      }

      // تعیین احساس نهایی
      const { sentiment, confidence } = this.determineSentiment(
        sentimentScore, 
        words.length,
        foundKeywords.length
      );

      const processingTime = Date.now() - startTime;

      return {
        success: true,
        data: {
          sentiment,
          score: sentimentScore,
          confidence,
          keywords: foundKeywords,
          details,
          metrics: {
            totalWords: words.length,
            analyzedWords: foundKeywords.length,
            positiveCount: details.positiveWords.length,
            negativeCount: details.negativeWords.length
          }
        },
        processingTime,
        serviceId: 'sentiment-analyzer',
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      console.error('Sentiment analysis error:', error);
      
      return {
        success: false,
        data: null,
        processingTime: Date.now() - startTime,
        serviceId: 'sentiment-analyzer',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'خطا در تحلیل احساسات'
      };
    }
  }

  // پیش‌پردازش متن
  private preprocessText(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^\u0600-\u06FF\s]/g, '') // حذف غیر فارسی
      .replace(/\s+/g, ' ')
      .trim();
  }

  // تعیین احساس بر اساس امتیاز
  private determineSentiment(score: number, totalWords: number, keywordCount: number): 
    { sentiment: string; confidence: 'high' | 'medium' | 'low' } {
    
    // نرمال‌سازی امتیاز
    const normalizedScore = score / Math.max(1, keywordCount);
    
    // تعیین احساس
    let sentiment: string;
    let confidence: 'high' | 'medium' | 'low';

    if (normalizedScore > 0.3) {
      sentiment = 'مثبت';
      confidence = keywordCount > 2 ? 'high' : 'medium';
    } else if (normalizedScore < -0.3) {
      sentiment = 'منفی';
      confidence = keywordCount > 2 ? 'high' : 'medium';
    } else {
      sentiment = 'خنثی';
      confidence = 'medium';
    }

    // کاهش اعتماد برای متن‌های کوتاه
    if (totalWords < 5 && confidence === 'high') {
      confidence = 'medium';
    }

    return { sentiment, confidence };
  }

  // آموزش مدل با داده جدید
  train(newData: { text: string; sentiment: 'positive' | 'negative' | 'neutral' }[]) {
    newData.forEach(data => {
      const words = this.preprocessText(data.text).split(/\s+/);
      
      words.forEach(word => {
        if (data.sentiment === 'positive' && !this.lexicon.positive.includes(word)) {
          this.lexicon.positive.push(word);
        } else if (data.sentiment === 'negative' && !this.lexicon.negative.includes(word)) {
          this.lexicon.negative.push(word);
        }
      });
    });
  }

  // دریافت وضعیت مدل
  getModelInfo() {
    return {
      positiveWords: this.lexicon.positive.length,
      negativeWords: this.lexicon.negative.length,
      intensifiers: Object.keys(this.lexicon.intensifiers).length,
      negations: this.lexicon.negations.length,
      version: '1.0.0'
    };
  }
}

// نمونه Singleton
export const sentimentAnalyzer = new SentimentAnalyzer();
