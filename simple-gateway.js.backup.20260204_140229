const express = require('express');
const cors = require('cors');
const natural = require('natural');
const NLP168Processor = require('./processors/nlp-processor');

const app = express();
const PORT = process.env.PORT || 1680;

// Middleware
app.use(cors());
app.use(express.json());

// ایجاد نمونه پردازشگر
const nlpProcessor = new NLP168Processor();

// روت اصلی
app.get('/', (req, res) => {
    res.json({
        message: '🚀 خوش آمدید به سیستم پردازش ۱۶۸ پست NLP',
        version: '1.0.0',
        endpoints: {
            home: '/',
            allPosts: '/api/posts',
            postById: '/api/posts/:id',
            search: '/api/search',
            stats: '/api/stats',
            analyze: '/api/analyze',
            health: '/api/health'
        },
        description: 'سیستم پردازش زبان طبیعی با ۱۶۸ پست تخصصی'
    });
});

// دریافت همه پست‌ها
app.get('/api/posts', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const category = req.query.category;
        
        // اگر پست‌ها هنوز تولید نشده‌اند
        if (nlpProcessor.posts.length === 0) {
            await nlpProcessor.generatePosts();
        }
        
        let filteredPosts = nlpProcessor.posts;
        
        // فیلتر بر اساس دسته اگر وجود دارد
        if (category) {
            filteredPosts = filteredPosts.filter(post => 
                post.category === category
            );
        }
        
        // صفحه‌بندی
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        
        const results = filteredPosts.slice(startIndex, endIndex);
        
        res.json({
            success: true,
            total: filteredPosts.length,
            page,
            limit,
            totalPages: Math.ceil(filteredPosts.length / limit),
            posts: results
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// دریافت پست بر اساس ID
app.get('/api/posts/:id', (req, res) => {
    const id = parseInt(req.params.id);
    
    if (id < 1 || id > 168) {
        return res.status(404).json({
            success: false,
            error: 'پست یافت نشد. ID باید بین 1 تا 168 باشد.'
        });
    }
    
    // اگر پست‌ها هنوز تولید نشده‌اند
    if (nlpProcessor.posts.length === 0) {
        return res.status(404).json({
            success: false,
            error: 'پست‌ها هنوز تولید نشده‌اند. لطفاً ابتدا به /api/posts مراجعه کنید.'
        });
    }
    
    const post = nlpProcessor.posts.find(p => p.id === id);
    
    if (post) {
        res.json({
            success: true,
            post
        });
    } else {
        res.status(404).json({
            success: false,
            error: 'پست یافت نشد'
        });
    }
});

// جستجو در پست‌ها
app.get('/api/search', async (req, res) => {
    try {
        const query = req.query.q;
        
        if (!query) {
            return res.status(400).json({
                success: false,
                error: 'پارامتر جستجو (q) الزامی است'
            });
        }
        
        // اطمینان از تولید پست‌ها
        if (nlpProcessor.posts.length === 0) {
            await nlpProcessor.generatePosts();
        }
        
        const results = nlpProcessor.search(query, 20);
        
        res.json({
            success: true,
            query,
            count: results.length,
            results
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// دریافت آمار
app.get('/api/stats', async (req, res) => {
    try {
        // اگر آمار محاسبه نشده
        if (nlpProcessor.stats.totalPosts === 0) {
            await nlpProcessor.generatePosts();
        }
        
        res.json({
            success: true,
            stats: nlpProcessor.stats,
            generatedAt: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// تحلیل متن - نسخه بهبود یافته
app.post('/api/analyze', (req, res) => {
    try {
        const { text } = req.body;
        
        if (!text) {
            return res.status(400).json({
                success: false,
                error: 'متن الزامی است'
            });
        }
        
        // استفاده از tokenizer ساده برای فارسی
        const tokens = text.split(/\s+/).filter(word => word.length > 0);
        const wordCount = tokens.length;
        const charCount = text.length;
        
        // تحلیل احساسات بهبود یافته
        const positiveWords = ['خوب', 'عالی', 'ممتاز', 'کاربردی', 'مفید', 'جالب', 'جذاب'];
        const negativeWords = ['بد', 'ضعیف', 'مشکل', 'پیچیده', 'سخت'];
        
        let sentimentScore = 0;
        tokens.forEach(word => {
            if (positiveWords.includes(word)) sentimentScore++;
            if (negativeWords.includes(word)) sentimentScore--;
        });
        
        let sentiment = 'neutral';
        if (sentimentScore > 1) sentiment = 'positive';
        if (sentimentScore < -1) sentiment = 'negative';
        
        // یافتن کلمات کلیدی (حذف حروف ربط)
        const stopWords = ['و', 'در', 'به', 'از', 'که', 'این', 'است', 'را', 'با', 'هم'];
        const keywords = tokens
            .filter(word => !stopWords.includes(word) && word.length > 2)
            .slice(0, 10);
        
        res.json({
            success: true,
            analysis: {
                originalText: text,
                statistics: {
                    wordCount,
                    charCount,
                    sentenceCount: (text.match(/[.!?۔]+/g) || []).length,
                    uniqueWords: [...new Set(tokens)].length
                },
                sentiment: {
                    label: sentiment,
                    score: sentimentScore,
                    confidence: Math.min(Math.abs(sentimentScore) * 20, 100)
                },
                tokens: tokens.slice(0, 20),
                keywords: keywords,
                readingTime: `${Math.ceil(wordCount / 200)} دقیقه`,
                complexity: wordCount > 100 ? 'پیشرفته' : wordCount > 50 ? 'متوسط' : 'ساده'
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// سلامت سرویس
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        status: 'healthy',
        timestamp: new Date().toISOString(),
        postsCount: nlpProcessor.posts.length,
        uptime: process.uptime(),
        memory: process.memoryUsage()
    });
});

// تولید پست‌ها
app.post('/api/generate', async (req, res) => {
    try {
        await nlpProcessor.generatePosts();
        
        res.json({
            success: true,
            message: `${nlpProcessor.posts.length} پست با موفقیت تولید شدند`,
            stats: nlpProcessor.stats
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// راه‌اندازی سرور
app.listen(PORT, async () => {
    console.log(`\n🚀 سرور NLP Gateway روی پورت ${PORT} اجرا شد`);
    console.log(`🔗 آدرس: http://localhost:${PORT}`);
    console.log(`📝 تعداد پست‌ها: 168 پست تخصصی NLP`);
    console.log(`\n📌 نقاط دسترسی:`);
    console.log(`  📊 آمار کلی: http://localhost:${PORT}/api/stats`);
    console.log(`  📝 همه پست‌ها: http://localhost:${PORT}/api/posts`);
    console.log(`  🔍 جستجو: http://localhost:${PORT}/api/search?q=پردازش`);
    console.log(`  🩺 سلامت: http://localhost:${PORT}/api/health`);
    
    // تولید پست‌ها در پس‌زمینه
    console.log('\n🔄 در حال تولید 168 پست...');
    try {
        await nlpProcessor.generatePosts();
        console.log('✅ پست‌ها با موفقیت تولید شدند');
        
        // نمایش آمار
        console.log('\n📊 آمار تولید شده:');
        console.log(`  تعداد پست‌ها: ${nlpProcessor.stats.totalPosts}`);
        console.log(`  تعداد کلمات کل: ${nlpProcessor.stats.totalWords}`);
        Object.entries(nlpProcessor.stats.categories).forEach(([cat, count]) => {
            console.log(`  ${cat}: ${count} پست`);
        });
    } catch (error) {
        console.error('❌ خطا در تولید پست‌ها:', error.message);
    }
});
