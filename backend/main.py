from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import backtest, data

app = FastAPI(title="BacktestIQ API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(data.router, prefix="/api/data", tags=["data"])
app.include_router(backtest.router, prefix="/api/backtest", tags=["backtest"])

@app.get("/")
def root():
    return {"message": "BacktestIQ API is running"}