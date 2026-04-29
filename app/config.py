import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    MODEL_NAME: str = os.getenv("MODEL_NAME", "cardiffnlp/twitter-roberta-base-sentiment-latest")
    CACHE_ENABLED: bool = os.getenv("CACHE_ENABLED", "False").lower() == "true"
    REDIS_URL: str = os.getenv("REDIS_URL", "redis://localhost:6379")

settings = Settings()
