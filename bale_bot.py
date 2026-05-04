import requests, json, sys
BOT_TOKEN = "YOUR_BALE_TOKEN"
BASE_URL = f"https://api.bale.ai/v1/bot{BOT_TOKEN}/"
def send_message(chat_id, text):
    requests.post(BASE_URL+"sendMessage", json={"chat_id":chat_id,"text":text})
def handle_message(chat_id, msg):
    try:
        resp = requests.post("http://localhost:1680/api/sentiment", json={"text":msg})
        sentiment = resp.json().get("sentiment","نامشخص")
        summary_resp = requests.post("http://localhost:1680/api/summarize", json={"text":msg,"num_sentences":1})
        summary = summary_resp.json().get("summary","")
        reply = f"احساسات: {sentiment}\nخلاصه: {summary}"
        send_message(chat_id, reply)
    except: send_message(chat_id, "خطا در تحلیل پیام")
if __name__ == "__main__":
    print("ربات بله راه‌اندازی شد (توکن را تنظیم کنید)")
