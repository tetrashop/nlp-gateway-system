from fastapi import FastAPI
from app.api.routes import router

app = FastAPI(
    title="NLP Gateway",
    description="Gateway for NLP services (sentiment, translation, summarization, ...)",
    version="1.0.0"
)

app.include_router(router)

@app.on_event("startup")
async def startup():
    print("NLP Gateway is starting...")
