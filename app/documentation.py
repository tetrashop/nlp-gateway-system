def get_documentation_html():
    return '''
<!DOCTYPE html>
<html dir="rtl" lang="fa">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>NLP Gateway Documentation</title>
    <style>
        body { font-family: 'Vazir', Tahoma, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; border-radius: 10px; padding: 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        h1 { color: #2c3e50; border-bottom: 3px solid #3498db; padding-bottom: 10px; }
        h2 { color: #34495e; margin-top: 30px; }
        .endpoint { background: #ecf0f1; border-radius: 5px; padding: 15px; margin: 15px 0; font-family: monospace; }
        .method { display: inline-block; padding: 3px 8px; border-radius: 3px; font-weight: bold; margin-right: 10px; }
        .post { background: #27ae60; color: white; }
        .get { background: #3498db; color: white; }
        code { background: #2c3e50; color: #ecf0f1; padding: 2px 5px; border-radius: 3px; }
        pre { background: #2c3e50; color: #ecf0f1; padding: 15px; border-radius: 5px; overflow-x: auto; }
        .test-btn { background: #3498db; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer; margin-top: 10px; }
        .result { background: #ecf0f1; padding: 10px; border-radius: 3px; margin-top: 10px; display: none; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚀 NLP Gateway API Documentation</h1>
        <p><strong>Base URL:</strong> <code>http://127.0.0.1:8080</code></p>
        <p><strong>API Key:</strong> <code>test-key-123</code> (Header: X-API-Key)</p>
        
        <h2>📝 Endpoints</h2>
        
        <div class="endpoint">
            <span class="method post">POST</span> <code>/v1/sentiment</code>
            <p>تحلیل احساسات متن</p>
            <pre>{"text": "این پروژه عالی است"}</pre>
        </div>
        
        <div class="endpoint">
            <span class="method post">POST</span> <code>/v1/detect-language</code>
            <p>تشخیص زبان متن</p>
            <pre>{"text": "سلام جهان"}</pre>
        </div>
        
        <div class="endpoint">
            <span class="method post">POST</span> <code>/v1/translate</code>
            <p>ترجمه ساده</p>
            <pre>{"text": "سلام", "source": "fa", "target": "en"}</pre>
        </div>
        
        <div class="endpoint">
            <span class="method post">POST</span> <code>/v1/filter</code>
            <p>فیلتر کلمات نامناسب</p>
            <pre>{"text": "این یک فحش است"}</pre>
        </div>
        
        <div class="endpoint">
            <span class="method post">POST</span> <code>/v1/entities</code>
            <p>تشخیص موجودیت‌ها</p>
            <pre>{"text": "با 09123456789 تماس بگیر"}</pre>
        </div>
        
        <div class="endpoint">
            <span class="method post">POST</span> <code>/v1/summarize</code>
            <p>خلاصه‌سازی متن</p>
            <pre>{"text": "متن بلند...", "num_sentences": 2}</pre>
        </div>
        
        <div class="endpoint">
            <span class="method get">GET</span> <code>/health</code>
            <p>بررسی سلامت سرویس</p>
        </div>
        
        <div class="endpoint">
            <span class="method get">GET</span> <code>/docs</code>
            <p>این صفحه مستندات</p>
        </div>
        
        <div class="endpoint">
            <span class="method get">GET</span> <code>/admin/keys</code>
            <p>مشاهده API Keys (فقط admin-key)</p>
        </div>
        
        <div class="endpoint">
            <span class="method get">GET</span> <code>/export/xml</code>
            <p>خروجی XML از درخواست‌ها</p>
        </div>
        
        <div class="endpoint">
            <span class="method get">GET</span> <code>/export/yaml</code>
            <p>خروجی YAML از درخواست‌ها</p>
        </div>
        
        <div class="endpoint">
            <span class="method post">POST</span> <code>/admin/keys/add</code>
            <p>اضافه کردن API Key جدید</p>
            <pre>{"key": "new-key-123", "user": "user1", "rate_limit": 20}</pre>
        </div>
        
        <h2>🔧 تست سریع</h2>
        <pre>curl -H "X-API-Key: test-key-123" http://127.0.0.1:8080/health</pre>
        <pre>curl -X POST http://127.0.0.1:8080/v1/sentiment -H "Content-Type: application/json" -H "X-API-Key: test-key-123" -d '{"text": "عالی"}'</pre>
        
        <h2>🔌 WebSocket (پورت 8081)</h2>
        <pre>ws://127.0.0.1:8081</pre>
        <p>ارسال: {"text": "متن برای تحلیل"}</p>
    </div>
</body>
</html>
    '''
