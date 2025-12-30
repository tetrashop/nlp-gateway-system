FROM python:3.9-slim

WORKDIR /app

# نصب وابستگی‌های سیستمی
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# کپی فایل‌های نیازمندی
COPY requirements.txt .

# نصب پکیج‌های پایتون
RUN pip install --no-cache-dir -r requirements.txt

# کپی کد منبع
COPY . .

# پورت سرویس
EXPOSE 8001

# دستور اجرا
CMD ["python", "main.py"]
