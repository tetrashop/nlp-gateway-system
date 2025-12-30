import { NLPResponse } from '../../../types/nlp';

// کلمات توقف فارسی
const PERSIAN_STOP_WORDS = [
  'و', 'در', 'به', 'از', 'که', 'را', 'این', 'با', 'آن', 'برای',
  'هم', 'یک', 'شده', 'کرد', 'شد', 'بود', 'گفت', 'می', 'های',
  'تا', 'کند', 'کنند', 'باید', 'باشد', 'دارد', 'داشته', 'دارند',
  'خود', 'ما', 'شما', 'من', 'تو', 'او', 'آنها', 'همه', 'چند',
  'هیچ', 'چه', 'اگر', 'اما', 'یا', 'نیز', 'ولی', 'همچنین'
];

export class KeywordExtractor {
  private stopWords: Set<string>;
  private minWordLength: number = 2;
  private maxKeywords: number = 10;

  constructor() {
    this.stopWords = new Set(PERSIAN_STOP_WORDS);
  }

  // استخراج کلیدواژه‌های مهم
  async extract(text: string, options?: { maxKeywords?: number }): Promise<NLPResponse> {
    const startTime = Date.now();
    
    try {
      // پیش‌پردازش متن
      const processedText = this.preprocessText(text);
      const words = processedText.split(/\s+/);
      
      // حذف کلمات توقف و کوتاه
      const filteredWords = words.filter(word => 
        word.length >= this.minWordLength && 
        !this.stopWords.has(word)
      );

      // محاسبه فرکانس کلمات
      const wordFrequencies = this.calculateFrequencies(filteredWords);
      
      // محاسبه TF-IDF (ساده‌شده)
      const scoredKeywords = this.calculateTFIDF(wordFrequencies, filteredWords.length);
      
      // مرتب‌سازی بر اساس امتیاز
      const sortedKeywords = Object.entries(scoredKeywords)
        .sort(([, a], [, b]) => b - a)
        .slice(0, options?.maxKeywords || this.maxKeywords);

      // فرمت‌بندی نتایج
      const keywords = sortedKeywords.map(([word, score]) => ({
        word,
        score: this.roundScore(score),
        frequency: wordFrequencies[word],
        length: word.length
      }));

      const processingTime = Date.now() - startTime;

      return {
        success: true,
        data: {
          keywords,
          statistics: {
            totalWords: words.length,
            uniqueWords: Object.keys(wordFrequencies).length,
            filteredWords: filteredWords.length,
            extractedKeywords: keywords.length
          },
          textSummary: this.generateSummary(keywords)
        },
        processingTime,
        serviceId: 'keyword-extractor',
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      console.error('Keyword extraction error:', error);
      
      return {
        success: false,
        data: null,
        processingTime: Date.now() - startTime,
        serviceId: 'keyword-extractor',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'خطا در استخراج کلیدواژه'
      };
    }
  }

  // پیش‌پردازش متن
  private preprocessText(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^\u0600-\u06FF\s]/g, '') // حذف غیر فارسی
      .replace(/[\u064B-\u065F]/g, '') // حذف اعراب
      .replace(/\s+/g, ' ')
      .trim();
  }

  // محاسبه فرکانس کلمات
  private calculateFrequencies(words: string[]): Record<string, number> {
    const frequencies: Record<string, number> = {};
    
    words.forEach(word => {
      frequencies[word] = (frequencies[word] || 0) + 1;
    });

    return frequencies;
  }

  // محاسبه TF-IDF ساده‌شده
  private calculateTFIDF(frequencies: Record<string, number>, totalWords: number): Record<string, number> {
    const scores: Record<string, number> = {};
    const totalDocs = 1000; // فرضی برای محاسبه IDF
    const docFrequency: Record<string, number> = {}; // فرضی

    Object.entries(frequencies).forEach(([word, freq]) => {
      const tf = freq / totalWords;
      const idf = Math.log(totalDocs / (docFrequency[word] || 1));
      scores[word] = tf * idf;
    });

    return scores;
  }

  // تولید خلاصه از کلیدواژه‌ها
  private generateSummary(keywords: Array<{ word: string; score: number }>): string {
    const topWords = keywords.slice(0, 5).map(k => k.word);
    return `کلیدواژه‌های اصلی: ${topWords.join('، ')}`;
  }

  // گرد کردن امتیاز
  private roundScore(score: number): number {
    return Math.round(score * 1000) / 1000;
  }

  // اضافه کردن کلمه توقف جدید
  addStopWord(word: string): void {
    this.stopWords.add(word.toLowerCase());
  }

  // حذف کلمه از توقف
  removeStopWord(word: string): void {
    this.stopWords.delete(word.toLowerCase());
  }

  // دریافت لیست کلمات توقف
  getStopWords(): string[] {
    return Array.from(this.stopWords);
  }

  // تنظیم حداکثر تعداد کلیدواژه
  setMaxKeywords(max: number): void {
    this.maxKeywords = Math.max(1, Math.min(max, 50));
  }
}

// نمونه Singleton
export const keywordExtractor = new KeywordExtractor();
