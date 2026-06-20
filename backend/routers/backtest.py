from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models import StockPrice, Fundamental
import pandas as pd
import numpy as np
from pydantic import BaseModel

router = APIRouter()

class BacktestParams(BaseModel):
    startDate: str
    endDate: str
    rebalanceFreq: str
    portfolioSize: int
    positionSizing: str
    minMarketCap: float
    maxMarketCap: float
    minROCE: float
    rankMetric: str
    rankOrder: str
    initialCapital: float

def get_rebalance_dates(start, end, freq):
    if freq == "monthly":
        return pd.date_range(start, end, freq="MS").tolist()
    elif freq == "quarterly":
        return pd.date_range(start, end, freq="QS").tolist()
    elif freq == "yearly":
        return pd.date_range(start, end, freq="YS").tolist()
    return pd.date_range(start, end, freq="MS").tolist()

@router.post("/run")
def run_backtest(params: BacktestParams, db: Session = Depends(get_db)):
    start = pd.to_datetime(params.startDate)
    end = pd.to_datetime(params.endDate)
    rebalance_dates = get_rebalance_dates(start, end, params.rebalanceFreq)

    fundamentals = db.query(Fundamental).all()
    fund_df = pd.DataFrame([{
        "symbol": f.symbol,
        "roce": float(f.roce) if f.roce else 0,
        "roe": float(f.roe) if f.roe else 0,
        "pe_ratio": float(f.pe_ratio) if f.pe_ratio else 0,
        "market_cap": float(f.market_cap) if f.market_cap else 0,
        "pat": float(f.pat) if f.pat else 0,
    } for f in fundamentals])

    if fund_df.empty:
        return {"error": "No fundamental data found. Please fetch data first."}

    filtered = fund_df[
        (fund_df["market_cap"] >= params.minMarketCap * 1e7) &
        (fund_df["market_cap"] <= params.maxMarketCap * 1e9) &
        (fund_df["roce"] >= params.minROCE) &
        (fund_df["pat"] > 0)
    ]

    ascending = params.rankOrder == "ascending"
    filtered = filtered.sort_values(params.rankMetric, ascending=ascending)
    top_stocks = filtered["symbol"].unique()[:params.portfolioSize].tolist()

    if not top_stocks:
        return {"error": "No stocks matched the filters."}

    prices = db.query(StockPrice).filter(
        StockPrice.symbol.in_(top_stocks),
        StockPrice.date >= start.date(),
        StockPrice.date <= end.date()
    ).all()

    price_df = pd.DataFrame([{
        "symbol": p.symbol,
        "date": p.date,
        "close": float(p.close)
    } for p in prices])

    if price_df.empty:
        return {"error": "No price data found."}

    price_pivot = price_df.pivot(index="date", columns="symbol", values="close").ffill()

    capital = params.initialCapital
    equity_curve = []
    portfolio_log = []

    for i, date in enumerate(rebalance_dates):
        date = date.date()
        available = [s for s in top_stocks if s in price_pivot.columns]
        if not available:
            continue

        weights = {s: 1 / len(available) for s in available}
        next_date = rebalance_dates[i + 1].date() if i + 1 < len(rebalance_dates) else end.date()
        period_prices = price_pivot[available].loc[
            (price_pivot.index >= date) & (price_pivot.index <= next_date)
        ]

        if period_prices.empty:
            continue

        period_returns = period_prices.pct_change().fillna(0)
        weighted_returns = period_returns.mul(pd.Series(weights), axis=1).sum(axis=1)
        capital = capital * (1 + weighted_returns).prod()

        equity_curve.append({"date": str(next_date), "value": round(capital, 2)})
        portfolio_log.append({
            "date": str(date),
            "stocks": available,
            "capital": round(capital, 2)
        })

    if not equity_curve:
        return {"error": "Could not compute equity curve."}

    values = [e["value"] for e in equity_curve]
    total_return = (values[-1] - params.initialCapital) / params.initialCapital * 100
    n_years = (end - start).days / 365
    cagr = ((values[-1] / params.initialCapital) ** (1 / n_years) - 1) * 100 if n_years > 0 else 0

    returns_series = pd.Series(values).pct_change().dropna()
    sharpe = (returns_series.mean() / returns_series.std() * np.sqrt(12)) if returns_series.std() > 0 else 0

    peak = pd.Series(values).cummax()
    drawdown = (pd.Series(values) - peak) / peak * 100
    max_drawdown = drawdown.min()

    nifty_prices = db.query(StockPrice).filter(
        StockPrice.symbol == "^NSEI",
        StockPrice.date >= start.date(),
        StockPrice.date <= end.date()
    ).all()

    nifty_df = pd.DataFrame([{"date": str(p.date), "nifty": float(p.close)} for p in nifty_prices])

    if not nifty_df.empty:
        first_val = nifty_df["nifty"].iloc[0]
        nifty_df["nifty"] = nifty_df["nifty"] / first_val * params.initialCapital
        nifty_curve = nifty_df.to_dict(orient="records")
    else:
        nifty_curve = []

    return {
        "equityCurve": equity_curve,
        "portfolioLog": portfolio_log,
        "niftyCurve": nifty_curve,
        "metrics": {
            "cagr": round(cagr, 2),
            "sharpe": round(sharpe, 2),
            "maxDrawdown": round(max_drawdown, 2),
            "totalReturn": round(total_return, 2)
        },
        "topStocks": top_stocks
    }