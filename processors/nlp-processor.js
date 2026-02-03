const natural = require('natural');
const fs = require('fs').promises;
const path = require('path');

class NLP168Processor {
    constructor() {
        this.posts = [];
        this.stats = {
            totalPosts: 0,
            totalWords: 0,
            categories: {},
            sentimentAnalysis: { positive: 0, negative: 0, neutral: 0 }
        };
        
        // ایجاد اندیس برای جستجوی سریع‌تر
        this.searchIndex = {};
    }
    
    // تولید 168 پست نمونه - نسخه بهبود یافته
    async generatePosts() {
        const categories = [
            'تحلیل احساسات', 'تشخیص موجودیت', 'خلاصه‌سازی',
            'ترجمه ماشینی', 'دسته‌بندی متن', 'تولید متن'
        ];
        
        const topics = [
            'پردازش زبان طبیعی فارسی',
            'یادگیری عمیق در NLP',
            'مدل‌های زبانی بزرگ',
            'تحلیل احساسات در شبکه‌های اجتماعی',
            'تشخیص موجودیت‌های نامدار',
            'ترجمه فارسی به انگلیسی'
        ];
        
        // متن‌های نمونه با احساسات مختلف
        const positiveTemplates = [
            'این آموزش بسیار عالی و کاربردی بود. مطالب به خوبی ارائه شده‌اند.',
            'پروژه‌ای فوق‌العاده با مثال‌های عملی و مفید.',
            'کیفیت محتوا بسیار بالا و قابل تقدیر است.'
        ];
        
        const negativeTemplates = [
            'متأسفانه کیفیت پایین بود و نکات مفید کمی داشت.',
            'پیاده‌سازی سخت و مستندات ضعیف.',
            'منتظر مطالب بهتری بودم ولی разоحر شدم.'
        ];
        
        const neutralTemplates = [
            'این مطلب به بررسی موضوع می‌پردازد.',
            'در این پست جنبه‌های مختلفی بررسی شده‌اند.',
            'مطالب ارائه شده استاندارد و معمولی هستند.'
        ];
        
        this.posts = [];
        
        for (let i = 1; i <= 168; i++) {
            const category = categories[i % categories.length];
            const topic = topics[i % topics.length];
            
            // انتخاب قالب بر اساس ID برای تنوع احساسات
            let template;
            let sentiment;
            
            if (i % 7 === 0) {
                template = positiveTemplates[i % positiveTemplates.length];
                sentiment = 'positive';
            } else if (i % 5 === 0) {
                template = negativeTemplates[i % negativeTemplates.length];
                sentiment = 'negative';
            } else {
                template = neutralTemplates[i % neutralTemplates.length];
                sentiment = 'neutral';
            }
            
            const post = {
                id: i,
                title: `پست ${i}: ${topic} - ${category}`,
                content: `${template} این مطلب بخشی از مجموعه 168 پست تخصصی NLP است. ` +
                        `موضوع اصلی: ${topic}. ` +
                        `این پست شامل ${150 + (i % 100)} کلمه است و ` +
                        `برای سطح ${['مقدماتی', 'متوسط', 'پیشرفته'][i % 3]} طراحی شده.`,
                category: category,
                topic: topic,
                tags: ['NLP', 'هوش مصنوعی', 'فارسی', category, topic.split(' ')[0]],
                wordCount: 150 + (i % 100),
                sentiment: sentiment,
                createdAt: new Date(Date.now() - (i * 3600000)).toISOString(),
                processed: true,
                popularity: Math.floor(Math.random() * 100) + 1
            };
            
            this.posts.push(post);
            
            // به‌روزرسانی آمار احساسات
            this.stats.sentimentAnalysis[sentiment]++;
        }
        
        await this.savePosts();
        await this.calculateStats();
        this.buildSearchIndex();
        
        return this.posts;
    }
    
    // ساخت اندیس برای جستجوی سریع
    buildSearchIndex() {
        this.searchIndex = {};
        
        this.posts.forEach((post, index) => {
            // اندیس‌سازی بر اساس کلمات کلیدی
            const keywords = [
                ...post.title.split(' '),
                ...post.content.split(' ').slice(0, 20),
                ...post.tags
            ];
            
            keywords.forEach(keyword => {
                if (keyword.length > 2) { // فقط کلمات با طول بیشتر از 2
                    const normalized = keyword.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
                    if (!this.searchIndex[normalized]) {
                        this.searchIndex[normalized] = [];
                    }
                    if (!this.searchIndex[normalized].includes(index)) {
                        this.searchIndex[normalized].push(index);
                    }
                }
            });
        });
    }
    
    async savePosts() {
        const dataDir = path.join(__dirname, '../data/posts');
        
        // ایجاد پوشه اگر وجود ندارد
        await fs.mkdir(dataDir, { recursive: true });
        
        // ذخیره همه پست‌ها
        await fs.writeFile(
            path.join(dataDir, 'all-posts.json'),
            JSON.stringify(this.posts, null, 2)
        );
        
        console.log(`✅ ${this.posts.length} پست ذخیره شدند`);
    }
    
    async calculateStats() {
        this.stats.totalPosts = this.posts.length;
        this.stats.totalWords = this.posts.reduce((sum, post) => sum + post.wordCount, 0);
        
        // آمار دسته‌ها
        this.posts.forEach(post => {
            this.stats.categories[post.category] = (this.stats.categories[post.category] || 0) + 1;
        });
        
        // ذخیره آمار
        const statsDir = path.join(__dirname, '../data');
        await fs.mkdir(statsDir, { recursive: true });
        
        await fs.writeFile(
            path.join(statsDir, 'stats.json'),
            JSON.stringify(this.stats, null, 2)
        );
        
        return this.stats;
    }
    
    // جستجوی پیشرفته
    search(query, limit = 20) {
        if (!query || query.trim().length === 0) {
            return [];
        }
        
        const results = [];
        const queryWords = query.split(' ').filter(word => word.length > 2);
        
        // اگر اندیس ساخته نشده، بساز
        if (Object.keys(this.searchIndex).length === 0) {
            this.buildSearchIndex();
        }
        
        // برای هر پست امتیاز محاسبه کن
        this.posts.forEach((post, index) => {
            let score = 0;
            
            // امتیاز بر اساس تطابق کلمات
            queryWords.forEach(word => {
                const normalizedWord = word.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
                
                // بررسی در عنوان
                if (post.title.includes(word) || 
                    post.title.normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes(normalizedWord)) {
                    score += 3;
                }
                
                // بررسی در محتوا
                if (post.content.includes(word) || 
                    post.content.normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes(normalizedWord)) {
                    score += 1;
                }
                
                // بررسی در تگ‌ها
                if (post.tags.some(tag => tag.includes(word) || 
                    tag.normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes(normalizedWord))) {
                    score += 2;
                }
                
                // استفاده از اندیس
                if (this.searchIndex[normalizedWord] && this.searchIndex[normalizedWord].includes(index)) {
                    score += 1;
                }
            });
            
            if (score > 0) {
                results.push({
                    post: post,
                    score: score,
                    relevance: score > 5 ? '🔴 بالا' : score > 2 ? '🟡 متوسط' : '🟢 پایین'
                });
            }
        });
        
        // مرتب‌سازی بر اساس امتیاز و محبوبیت
        return results
            .sort((a, b) => {
                if (b.score !== a.score) {
                    return b.score - a.score;
                }
                return b.post.popularity - a.post.popularity;
            })
            .slice(0, limit);
    }
    
    // تحلیل احساسات متن
    analyzeSentiment(text) {
        const positiveWords = [
            'عالی', 'ممتاز', 'خوب', 'کاربردی', 'مفید', 'جالب',
            'جذاب', 'پیشرفته', 'خلاقانه', 'فوقالعاده', 'عالی'
        ];
        
        const negativeWords = [
            'ضعیف', 'مشکل', 'پیچیده', 'سخت', 'گران', 'بد',
            'نامطلوب', 'بی‌فایده', 'کم‌کیفیت', 'ضعیف', 'ناامید'
        ];
        
        const words = text.split(/\s+/);
        let score = 0;
        
        words.forEach(word => {
            const cleanWord = word.replace(/[.,!?;،؛؟]/g, '');
            if (positiveWords.includes(cleanWord)) score++;
            if (negativeWords.includes(cleanWord)) score--;
        });
        
        if (score > 1) return 'positive';
        if (score < -1) return 'negative';
        return 'neutral';
    }
    
    // نمایش آمار
    displayStats() {
        console.log('\n📊 آمار سیستم پردازش 168 پست NLP');
        console.log('='.repeat(50));
        console.log(`📝 تعداد کل پست‌ها: ${this.stats.totalPosts}`);
        console.log(`🔤 تعداد کل کلمات: ${this.stats.totalWords}`);
        console.log(`📈 میانگین کلمات هر پست: ${Math.round(this.stats.totalWords / this.stats.totalPosts)}`);
        
        console.log('\n🏷️ توزیع دسته‌ها:');
        Object.entries(this.stats.categories).forEach(([category, count]) => {
            const percentage = ((count / this.stats.totalPosts) * 100).toFixed(1);
            console.log(`  ${category}: ${count} پست (${percentage}%)`);
        });
        
        console.log('\n😊 تحلیل احساسات:');
        console.log(`  مثبت: ${this.stats.sentimentAnalysis.positive}`);
        console.log(`  منفی: ${this.stats.sentimentAnalysis.negative}`);
        console.log(`  خنثی: ${this.stats.sentimentAnalysis.neutral}`);
    }
}

// اجرای پردازشگر
async function main() {
    console.log('🚀 شروع پردازش 168 پست NLP...\n');
    
    const processor = new NLP168Processor();
    
    // تولید پست‌ها
    console.log('📝 در حال تولید 168 پست...');
    await processor.generatePosts();
    
    // نمایش آمار
    processor.displayStats();
    
    // نمونه جستجو
    console.log('\n🔍 نمونه جستجو برای "پردازش زبان طبیعی":');
    const results = processor.search('پردازش زبان طبیعی', 3);
    
    results.forEach((result, index) => {
        console.log(`\n  ${index + 1}. پست ${result.post.id}: ${result.post.title}`);
        console.log(`     امتیاز: ${result.score} (${result.relevance})`);
        console.log(`     دسته: ${result.post.category}`);
        console.log(`     احساس: ${result.post.sentiment}`);
    });
    
    console.log('\n✅ پردازش کامل شد!');
    console.log('📁 داده‌ها در پوشه data/ ذخیره شدند.');
}

// اگر مستقیماً اجرا شد
if (require.main === module) {
    main().catch(console.error);
}

module.exports = NLP168Processor;
