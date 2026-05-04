import sqlite3
import json
from datetime import datetime

DB_PATH = 'nlp_gateway.db'

def init_db():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # جدول درخواست‌ها
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS requests (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp TEXT,
            endpoint TEXT,
            client_ip TEXT,
            api_key TEXT,
            input TEXT,
            output TEXT
        )
    ''')
    
    # جدول API Keys
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS api_keys (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            key TEXT UNIQUE,
            user_name TEXT,
            rate_limit INTEGER DEFAULT 10,
            created_at TEXT
        )
    ''')
    
    # جدول کش
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS cache (
            key TEXT PRIMARY KEY,
            value TEXT,
            expires_at TEXT
        )
    ''')
    
    # اضافه کردن کلیدهای پیش‌فرض
    cursor.execute('INSERT OR IGNORE INTO api_keys (key, user_name, rate_limit, created_at) VALUES (?, ?, ?, ?)',
                   ('test-key-123', 'default_user', 10, datetime.now().isoformat()))
    cursor.execute('INSERT OR IGNORE INTO api_keys (key, user_name, rate_limit, created_at) VALUES (?, ?, ?, ?)',
                   ('admin-key', 'admin', 100, datetime.now().isoformat()))
    
    conn.commit()
    conn.close()

def save_request(endpoint, client_ip, api_key, input_data, output_data):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO requests (timestamp, endpoint, client_ip, api_key, input, output)
        VALUES (?, ?, ?, ?, ?, ?)
    ''', (datetime.now().isoformat(), endpoint, client_ip, api_key, 
          json.dumps(input_data, ensure_ascii=False), 
          json.dumps(output_data, ensure_ascii=False)))
    conn.commit()
    conn.close()

def get_requests(limit=50):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM requests ORDER BY id DESC LIMIT ?', (limit,))
    rows = cursor.fetchall()
    conn.close()
    return rows

def get_api_keys():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute('SELECT key, user_name, rate_limit FROM api_keys')
    rows = cursor.fetchall()
    conn.close()
    return rows

def add_api_key(key, user_name, rate_limit=10):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute('INSERT OR IGNORE INTO api_keys (key, user_name, rate_limit, created_at) VALUES (?, ?, ?, ?)',
                   (key, user_name, rate_limit, datetime.now().isoformat()))
    conn.commit()
    conn.close()

def remove_api_key(key):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute('DELETE FROM api_keys WHERE key = ?', (key,))
    conn.commit()
    conn.close()

def get_cache(key):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute('SELECT value, expires_at FROM cache WHERE key = ?', (key,))
    row = cursor.fetchone()
    conn.close()
    if row:
        expires_at = datetime.fromisoformat(row[1])
        if expires_at > datetime.now():
            return json.loads(row[0])
    return None

def set_cache(key, value, ttl_seconds=300):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    expires_at = datetime.now().isoformat()
    cursor.execute('INSERT OR REPLACE INTO cache (key, value, expires_at) VALUES (?, ?, ?)',
                   (key, json.dumps(value, ensure_ascii=False), expires_at))
    conn.commit()
    conn.close()

init_db()
