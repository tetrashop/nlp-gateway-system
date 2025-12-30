/**
 * خلاصه‌ساز متن فارسی
 */
class PersianSummarizer {
  
  /**
   * خلاصه‌سازی ساده بر اساس جملات کلیدی
   */
  static summarize(text, ratio = 0.3) {
    if (!text || typeof text !== 'string') {
      return { original: '', summary: '', ratio: 0, sentences: 0 };
    }
    
    // تقسیم به جملات
    const sentences = text.split(/[\.!؟؟]+/).filter(s => s.trim().length > 0);
    
    if (sentences.length <= 1) {
      return {
        original: text,
        summary: text,
        ratio: 1,
        sentences: sentences.length,
        method: 'no_summarization_needed'
      };
    }
    
    // محاسبه امتیاز هر جمله (بر اساس طول و موقعیت)
    const sentenceScores = sentences.map((sentence, index) => {
      const words = sentence.trim().split(/\s+/).length;
      const positionScore = 1 / (index + 1); // جملات اول مهم‌ترند
      const lengthScore = Math.min(words / 20, 1); // جملات با طول متوسط بهترند
      
      return {
        sentence: sentence.trim(),
        score: (positionScore * 0.6) + (lengthScore * 0.4),
        index,
        wordCount: words
      };
    });
    
    // مرتب‌سازی بر اساس امتیاز
    const sortedSentences = [...sentenceScores].sort((a, b) => b.score - a.score);
    
    // انتخاب جملات بر اساس ratio
    const summaryCount = Math.max(1, Math.floor(sentences.length * ratio));
    const selectedSentences = sortedSentences
      .slice(0, summaryCount)
      .sort((a, b) => a.index - b.index) // بازگرداندن به ترتیب اصلی
      .map(item => item.sentence);
    
    const summary = selectedSentences.join('. ') + '.';
    
    return {
      original: text,
      summary,
      ratio,
      original_length: text.length,
      summary_length: summary.length,
      compression_rate: ((text.length - summary.length) / text.length * 100).toFixed(1) + '%',
      original_sentences: sentences.length,
      summary_sentences: selectedSentences.length,
      method: 'extractive_summarization'
    };
  }
  
  /**
   * خلاصه‌سازی پیشرفته (برای متن‌های طولانی)
   */
  static advancedSummarize(text, targetWordCount = 100) {
    const basicSummary = this.summarize(text, 0.5);
    
    // اگر هنوز طولانی است، بیشتر خلاصه کن
    const summaryWords = basicSummary.summary.split(/\s+/).length;
    
    if (summaryWords > targetWordCount) {
      const newRatio = targetWordCount / summaryWords * 0.5;
      return this.summarize(basicSummary.summary, Math.max(0.1, newRatio));
    }
    
    return basicSummary;
  }
}

module.exports = PersianSummarizer;
