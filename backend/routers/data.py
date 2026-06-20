from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models import Stock, StockPrice
import requests
import pandas as pd
from datetime import datetime, date
import time

router = APIRouter()

INDIAN_STOCKS = [
    "RELIANCE.NS", "TCS.NS", "HDFCBANK.NS", "INFY.NS", "ICICIBANK.NS",
    "HINDUNILVR.NS", "SBIN.NS", "BHARTIARTL.NS", "ITC.NS", "KOTAKBANK.NS",
    "LT.NS", "AXISBANK.NS", "ASIANPAINT.NS", "MARUTI.NS", "TITAN.NS",
    "SUNPHARMA.NS", "ULTRACEMCO.NS", "BAJFINANCE.NS", "NESTLEIND.NS", "WIPRO.NS",
    "POWERGRID.NS", "NTPC.NS", "TECHM.NS", "HCLTECH.NS", "ONGC.NS",
    "TATAMOTORS.NS", "JSWSTEEL.NS", "TATASTEEL.NS", "ADANIENT.NS", "ADANIPORTS.NS",
    "COALINDIA.NS", "BAJAJFINSV.NS", "DIVISLAB.NS", "DRREDDY.NS", "CIPLA.NS",
    "EICHERMOT.NS", "HEROMOTOCO.NS", "BPCL.NS", "GRASIM.NS", "HINDALCO.NS",
    "INDUSINDBK.NS", "SBILIFE.NS", "HDFCLIFE.NS", "BRITANNIA.NS",
    "APOLLOHOSP.NS", "TATACONSUM.NS", "BAJAJ-AUTO.NS", "UPL.NS", "SHREECEM.NS",
    "PIDILITIND.NS", "BERGEPAINT.NS", "HAVELLS.NS", "DABUR.NS", "MARICO.NS",
    "COLPAL.NS", "GODREJCP.NS", "MUTHOOTFIN.NS", "CHOLAFIN.NS", "SBICARD.NS",
    "ICICIPRULI.NS", "ICICIGI.NS", "NAUKRI.NS", "PERSISTENT.NS", "COFORGE.NS",
    "MPHASIS.NS", "OFSS.NS", "TATAELXSI.NS", "ABCAPITAL.NS", "MANAPPURAM.NS",
    "SUNDARMFIN.NS", "BAJAJHLDNG.NS", "ABBOTINDIA.NS", "ALKEM.NS", "AUROPHARMA.NS",
    "BIOCON.NS", "GLENMARK.NS", "LUPIN.NS", "TORNTPHARM.NS", "ZYDUSLIFE.NS",
    "CONCOR.NS", "IRCTC.NS", "RVNL.NS", "IRFC.NS", "RECLTD.NS",
    "PFC.NS", "CANBK.NS", "BANKBARODA.NS", "IPCALAB.NS", "DRREDDY.NS",
    "BAJFINANCE.NS", "SBIN.NS", "HDFCBANK.NS", "INFY.NS", "TCS.NS",
    "WIPRO.NS", "HCLTECH.NS", "TECHM.NS", "LT.NS", "NTPC.NS",
    "POWERGRID.NS", "ONGC.NS", "COALINDIA.NS", "BPCL.NS", "GRASIM.NS"
]

INDIAN_STOCKS = list(set(INDIAN_STOCKS))

def fetch_yahoo_data(symbol: str, start: str, end: str):
    try:
        start_ts = int(datetime.strptime(start, "%Y-%m-%d").timestamp())
        end_ts = int(datetime.strptime(end, "%Y-%m-%d").timestamp())
        url = f"https://query1.finance.yahoo.com/v8/finance/chart/{symbol}?period1={start_ts}&period2={end_ts}&interval=1d"
        headers = {"User-Agent": "Mozilla/5.0"}
        r = requests.get(url, headers=headers, timeout=10)
        data = r.json()
        result = data["chart"]["result"][0]
        timestamps = result["timestamp"]
        ohlcv = result["indicators"]["quote"][0]
        rows = []
        for i, ts in enumerate(timestamps):
            rows.append({
                "date": date.fromtimestamp(ts),
                "open": ohlcv["open"][i],
                "high": ohlcv["high"][i],
                "low": ohlcv["low"][i],
                "close": ohlcv["close"][i],
                "volume": ohlcv["volume"][i],
            })
        return rows
    except:
        return []

@router.get("/fetch-stocks")
def fetch_and_store_stocks(db: Session = Depends(get_db)):
    added = 0
    for symbol in INDIAN_STOCKS:
        existing = db.query(Stock).filter(Stock.symbol == symbol).first()
        if not existing:
            stock = Stock(symbol=symbol, company_name=symbol.replace(".NS", ""), sector="", market_cap=None)
            db.add(stock)
            added += 1
    db.commit()
    return {"message": f"{added} stocks added"}

@router.get("/fetch-prices")
def fetch_and_store_prices(db: Session = Depends(get_db)):
    added = 0
    for symbol in INDIAN_STOCKS:
        rows = fetch_yahoo_data(symbol, "2018-01-01", "2024-12-31")
        for row in rows:
            if row["close"] is None:
                continue
            existing = db.query(StockPrice).filter(
                StockPrice.symbol == symbol,
                StockPrice.date == row["date"]
            ).first()
            if not existing:
                price = StockPrice(
                    symbol=symbol,
                    date=row["date"],
                    open=row["open"],
                    high=row["high"],
                    low=row["low"],
                    close=row["close"],
                    volume=row["volume"]
                )
                db.add(price)
                added += 1
        db.commit()
        time.sleep(0.3)
    return {"message": f"{added} price records added"}

@router.get("/fetch-fundamentals")
def fetch_and_store_fundamentals(db: Session = Depends(get_db)):
    from models import Fundamental
    added = 0
    for symbol in INDIAN_STOCKS:
        try:
            url = f"https://query1.finance.yahoo.com/v10/finance/quoteSummary/{symbol}?modules=financialData,defaultKeyStatistics,incomeStatementHistory"
            headers = {"User-Agent": "Mozilla/5.0"}
            r = requests.get(url, headers=headers, timeout=10)
            data = r.json()
            result = data["quoteSummary"]["result"][0]

            fin = result.get("financialData", {})
            stats = result.get("defaultKeyStatistics", {})

            roe = fin.get("returnOnEquity", {}).get("raw", None)
            roce = fin.get("returnOnAssets", {}).get("raw", None)
            pe = fin.get("currentPrice", {}).get("raw", None)
            market_cap = fin.get("marketCap", {}).get("raw", None) if "marketCap" in fin else stats.get("marketCap", {}).get("raw", None)
            pe_ratio = stats.get("forwardPE", {}).get("raw", None)
            debt_to_equity = fin.get("debtToEquity", {}).get("raw", None)

            income = result.get("incomeStatementHistory", {}).get("incomeStatementHistory", [])
            pat = None
            revenue = None
            if income:
                pat = income[0].get("netIncome", {}).get("raw", None)
                revenue = income[0].get("totalRevenue", {}).get("raw", None)

            existing = db.query(Fundamental).filter(
                Fundamental.symbol == symbol,
                Fundamental.year == 2024,
                Fundamental.quarter == 0
            ).first()

            if not existing:
                fund = Fundamental(
                    symbol=symbol,
                    year=2024,
                    quarter=0,
                    revenue=revenue,
                    pat=pat,
                    roe=roe * 100 if roe else None,
                    roce=roce * 100 if roce else None,
                    pe_ratio=pe_ratio,
                    market_cap=market_cap,
                    debt_to_equity=debt_to_equity
                )
                db.add(fund)
                added += 1
            db.commit()
            time.sleep(0.3)
        except:
            continue
    return {"message": f"{added} fundamental records added"}

@router.get("/fetch-nifty")
def fetch_and_store_nifty(db: Session = Depends(get_db)):
    rows = fetch_yahoo_data("^NSEI", "2018-01-01", "2024-12-31")
    added = 0
    
    # Add Nifty as a stock first
    existing_stock = db.query(Stock).filter(Stock.symbol == "^NSEI").first()
    if not existing_stock:
        nifty_stock = Stock(symbol="^NSEI", company_name="Nifty 50 Index", sector="Index", market_cap=None)
        db.add(nifty_stock)
        db.commit()
    
    for row in rows:
        if row["close"] is None:
            continue
        existing = db.query(StockPrice).filter(
            StockPrice.symbol == "^NSEI",
            StockPrice.date == row["date"]
        ).first()
        if not existing:
            price = StockPrice(
                symbol="^NSEI",
                date=row["date"],
                open=row["open"],
                high=row["high"],
                low=row["low"],
                close=row["close"],
                volume=row["volume"] if row["volume"] else 0
            )
            db.add(price)
            added += 1
    db.commit()
    return {"message": f"{added} Nifty 50 records added"}