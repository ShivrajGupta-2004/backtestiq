from sqlalchemy import Column, Integer, String, Numeric, Date, BigInteger, TIMESTAMP, UniqueConstraint
from sqlalchemy.sql import func
from database import Base

class Stock(Base):
    __tablename__ = "stocks"

    id = Column(Integer, primary_key=True, index=True)
    symbol = Column(String(20), unique=True, nullable=False)
    company_name = Column(String(200))
    sector = Column(String(100))
    market_cap = Column(Numeric)
    created_at = Column(TIMESTAMP, server_default=func.now())


class StockPrice(Base):
    __tablename__ = "stock_prices"

    id = Column(Integer, primary_key=True, index=True)
    symbol = Column(String(20), nullable=False)
    date = Column(Date, nullable=False)
    open = Column(Numeric)
    high = Column(Numeric)
    low = Column(Numeric)
    close = Column(Numeric)
    volume = Column(BigInteger)

    __table_args__ = (UniqueConstraint('symbol', 'date'),)


class Fundamental(Base):
    __tablename__ = "fundamentals"

    id = Column(Integer, primary_key=True, index=True)
    symbol = Column(String(20), nullable=False)
    year = Column(Integer)
    quarter = Column(Integer)
    revenue = Column(Numeric)
    pat = Column(Numeric)
    roe = Column(Numeric)
    roce = Column(Numeric)
    pe_ratio = Column(Numeric)
    market_cap = Column(Numeric)
    debt_to_equity = Column(Numeric)

    __table_args__ = (UniqueConstraint('symbol', 'year', 'quarter'),)
    