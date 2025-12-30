import { NLPResponse } from '../../../types/nlp';

export class TextSummarizer {
  private summaryRatio: number = 0.3; // 30% خلاصه‌سازی
  private minSentenceLength: number = 10;
  private maxSentenceLength: number = 100;

  // خلاصه‌سازی متن فارسی
  async summarize(text: string, options?: { ratio?: number }): Promise<NLPResponse> {
    const startTime = Date.now();
    
    try {
      // تجزیه متن به جملات
      const sentences = this.splitIntoSentences(text);
      
      // محاسبه امتیاز هر جمله
      const scoredSentences = sentences.map(sentence => ({
        sentence,
        score: this.scoreSentence(sentence),
        length: sentence.length,
        words: sentence.split(/\s+/).length
      }));

      // فیلتر جملات کوتاه/بلند
      const filteredSentences = scoredSentences.filter(s => 
        s.length >= this.minSentenceLength && 
        s.length <= this.maxSentenceLength
      );

      // مرتب‌سازی بر اساس امتیاز
      filteredSentences.sort((a, b) => b.score - a.score);

      // تعیین تعداد جملات برای خلاصه
      const targetCount = Math.max(
        1,
        Math.round(filteredSentences.length * (options?.ratio || this.summaryRatio))
      );

      // انتخاب جملات برتر
      const selectedSentences = filteredSentences
        .slice(0, targetCount)
        .sort((a, b) => 
          sentences.indexOf(a.sentence) - sentences.indexOf(b.sentence)
        );

      // ساخت خلاصه
      const summary = selectedSentences
        .map(s => s.sentence.trim())
        .join(' ');

      const processingTime = Date.now() - startTime;

      return {
        success: true,
        data: {
          summary,
          statistics: {
            originalSentences: sentences.length,
            summarySentences: selectedSentences.length,
            compressionRatio: selectedSentences.length / Math.max(1, sentences.length),
            originalLength: text.length,
            summaryLength: summary.length,
            reductionPercentage: Math.round((1 - (summary.length / Math.max(1, text.length))) * 100)
          },
          sentences: selectedSentences.map(s => ({
            sentence: s.sentence,
            score: this.roundScore(s.score),
            length: s.length,
            wordCount: s.words
          }))
        },
        processingTime,
        serviceId: 'summarizer',
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      console.error('Text summarization error:', error);
      
      return {
        success: false,
        data: null,
        processingTime: Date.now() - startTime,
        serviceId: 'summarizer',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'خطا در خلاصه‌سازی متن'
      };
    }
  }

  // تقسیم متن به جملات
  private splitIntoSentences(text: string): string[] {
    // الگوی پایان جملات فارسی
    const sentenceEndings = /[.!?۔؟]+/;
    
    return text
      .split(sentenceEndings)
      .map(s => s.trim())
      .filter(s => s.length > 0);
  }

  // امتیازدهی به جملات
  private scoreSentence(sentence: string): number {
    const words = sentence.split(/\s+/);
    let score = 0;

    // امتیاز بر اساس طول جمله (جملات با طول متوسط بهترند)
    const lengthScore = this.calculateLengthScore(sentence.length);
    score += lengthScore;

    // امتیاز بر اساس موقعیت جمله (جملات ابتدایی و انتهایی مهم‌ترند)
    // اینجا فرض می‌کنیم جمله را در متن اصلی نداریم
    
    // امتیاز بر اساس کلمات کلیدی
    const keywordScore = this.calculateKeywordScore(words);
    score += keywordScore;

    // امتیاز بر اساس افعال (جملات دارای فعل کامل‌ترند)
    const verbScore = this.calculateVerbScore(sentence);
    score += verbScore;

    return score;
  }

  // محاسبه امتیاز طول
  private calculateLengthScore(length: number): number {
    const optimalLength = 50;
    const deviation = Math.abs(length - optimalLength);
    return Math.max(0, 1 - (deviation / optimalLength));
  }

  // محاسبه امتیاز کلمات کلیدی
  private calculateKeywordScore(words: string[]): number {
    const keywords = [
      'نتیجه', 'خلاصه', 'مهم', 'اصلی', 'کلیدی',
      'نهایی', 'قطعاً', 'بدون‌شک', 'مطمئناً'
    ];

    const foundKeywords = words.filter(word => 
      keywords.includes(word.toLowerCase())
    );

    return foundKeywords.length * 0.5;
  }

  // محاسبه امتیاز فعل
  private calculateVerbScore(sentence: string): number {
    const persianVerbs = [
      'است', 'هست', 'بود', 'شد', 'کرد',
      'می‌باشد', 'می‌شود', 'می‌کند', 'می‌باشد'
    ];

    const hasVerb = persianVerbs.some(verb => 
      sentence.includes(verb)
    );

    return hasVerb ? 0.3 : 0;
  }

  // گرد کردن امتیاز
  private roundScore(score: number): number {
    return Math.round(score * 100) / 100;
  }

  // تنظیم نسبت خلاصه‌سازی
  setSummaryRatio(ratio: number): void {
    this.summaryRatio = Math.max(0.1, Math.min(ratio, 0.9));
  }

  // تنظیم محدودیت طول جملات
  setSentenceLengthLimits(min: number, max: number): void {
    this.minSentenceLength = Math.max(5, min);
    this.maxSentenceLength = Math.min(500, max);
  }

  // دریافت تنظیمات فعلی
  getConfig() {
    return {
      summaryRatio: this.summaryRatio,
      minSentenceLength: this.minSentenceLength,
      maxSentenceLength: this.maxSentenceLength,
      version: '1.2.0'
    };
  }
}

// نمونه Singleton
export const textSummarizer = new TextSummarizer();
