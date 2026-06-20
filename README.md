<div align="center">

<img src="https://readme-typing-svg.demolab.com?font=Fira+Code&size=32&duration=3000&pause=1000&color=00D084&center=true&vCenter=true&width=600&lines=BacktestIQ;Equity+Backtesting+Platform;Test+Your+Strategy+with+Real+Data" alt="Typing SVG" />

<br/>

![Platform](https://img.shields.io/badge/Platform-Indian%20Equity-00D084?style=for-the-badge&logo=trending-up&logoColor=white)
![Backend](https://img.shields.io/badge/Backend-FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![Frontend](https://img.shields.io/badge/Frontend-React.js-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Database](https://img.shields.io/badge/Database-PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

<br/>

> **Define filters. Rank stocks. Size positions. Run backtests on 100+ Indian listed companies with real OHLCV data.**

<br/>

[🚀 Run Backtest](#-quick-start) · [📊 View Features](#-features) · [🗄️ Database Schema](#️-database-schema) · [📡 API Reference](#-api-endpoints)

</div>

---

## 📸 Screenshots

<div align="center">

### 🏠 Homepage
![Homepage Hero](Images/img1.png)
![Homepage Features](Images/img2.png)
![Homepage Tech Stack](Images/img3.png)

### ⚙️ Backtest Configuration
![Backtest Form](Images/img4.png)

### 📊 Results Dashboard
![Results Dashboard](Images/img5.png)
![Portfolio Log](Images/img6.png)

</div>

---

## 🧭 Overview

**BacktestIQ** is a full-stack equity backtesting platform built for Indian markets. It lets you define a custom strategy — filters, ranking logic, and position sizing — and run it against historical price data for 100+ NSE-listed companies spanning 6 years.

The platform handles the entire pipeline: data ingestion from Yahoo Finance → storage in PostgreSQL → Python-based backtest engine → React dashboard with rich analytics.

Built as part of a Full Stack Developer assignment for **Qode Advisors LLP**.

---

## ⚡ Features

### 🔬 Backtest Engine
- User-defined **start and end date** range
- **Rebalancing frequency** — Monthly, Quarterly, or Yearly
- **Portfolio size** — pick top N stocks per rebalance period
- Automatic **compounding logic** at each rebalance
- Zero **future data leakage** — filters applied strictly per period

### 🧹 Stock Filtering
- Market Cap range filter (Min / Max in ₹ Cr)
- ROCE threshold filter (Min ROCE %)
- PAT positivity filter (only profitable companies)

### 🏆 Ranking System
- Rank by **ROE**, **ROCE**, **PE Ratio**, or **PAT Growth**
- Ascending or descending order
- Composite ranking support

### ⚖️ Position Sizing
- **Equal Weighted** — uniform allocation across selected stocks
- **Market Cap Weighted** — allocation proportional to market cap
- **Metric Weighted** — allocation proportional to ranking metric

### 📈 Analytics & Outputs
| Metric | Description |
|---|---|
| CAGR | Compounded Annual Growth Rate |
| Sharpe Ratio | Risk-adjusted return |
| Max Drawdown | Worst peak-to-trough loss |
| Total Return | Overall % gain |
| Equity Curve | Strategy vs Nifty 50 benchmark |
| Monthly Returns | Bar chart by rebalance period |
| Drawdown Chart | Visual of underwater periods |
| Portfolio Allocation | Pie chart of stock weights |
| Portfolio Log | Date-wise capital and return table |

### 📤 Export
- Download full portfolio log as **CSV**

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React.js, Tailwind CSS, Recharts |
| **Backend** | Python, FastAPI, SQLAlchemy |
| **Database** | PostgreSQL |
| **Data Source** | Yahoo Finance API (yfinance) |
| **Data Processing** | Pandas, NumPy |

---

## 🗄️ Database Schema

Three normalized tables power the entire platform:

```
stocks
├── id (PK)
├── symbol          -- NSE ticker (e.g. TCS.NS)
├── name            -- Company name
├── sector          -- Industry sector
└── market_cap      -- Market capitalization (₹ Cr)

stock_prices
├── id (PK)
├── symbol (FK)
├── date
├── open, high, low, close, volume   -- OHLCV
└── (148,000+ records)

fundamentals
├── id (PK)
├── symbol (FK)
├── year
├── roe             -- Return on Equity
├── roce            -- Return on Capital Employed
├── pe_ratio        -- Price to Earnings
├── pat             -- Profit After Tax
└── revenue
```

---

## 📁 Project Structure

```
BacktestIQ/
├── 📁 frontend/
│   ├── 📁 src/
│   │   ├── 📁 components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── BacktestForm.jsx
│   │   │   ├── MetricsCard.jsx
│   │   │   ├── EquityCurve.jsx
│   │   │   └── DrawdownChart.jsx
│   │   ├── 📁 pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Backtest.jsx
│   │   │   └── Results.jsx
│   │   └── App.js
│   └── package.json
│
├── 📁 backend/
│   ├── main.py
│   ├── database.py
│   ├── models.py
│   ├── .env
│   └── 📁 routers/
│       ├── data.py
│       └── backtest.py
│
├── 📁 Images/
│   ├── img1.png
│   ├── img2.png
│   ├── img3.png
│   ├── img4.png
│   ├── img5.png
│   └── img6.png
│
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js v18+
- Python 3.9+
- PostgreSQL 14+

---

### 1. Clone the Repository

```bash
git clone https://github.com/ShivrajGupta-2004/backtestiq.git
cd backtestiq
```

---

### 2. Database Setup

Install PostgreSQL and create the database:

```sql
CREATE DATABASE backtestiq;
```

Then run the table creation SQL for `stocks`, `stock_prices`, and `fundamentals`.

---

### 3. Backend Setup

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# macOS / Linux
source venv/bin/activate
```

Install dependencies:

```bash
pip install fastapi uvicorn sqlalchemy psycopg2-binary pandas numpy yfinance python-dotenv requests
```

Create a `.env` file in the `backend/` directory:

```env
DATABASE_URL=postgresql://postgres:YOURPASSWORD@localhost:5432/backtestiq
```

Start the backend server:

```bash
cd backend
venv\Scripts\activate
uvicorn main:app --reload
```

Backend runs at: `http://127.0.0.1:8000`


---

Start the frontend server:

```bash
cd frontend
npm install
npm start
```

Frontend runs at: `http://localhost:3000`

---

### 4. Fetch Market Data

With the backend running, hit these endpoints in your browser to populate the database:

```
http://127.0.0.1:8000/api/data/fetch-stocks     ← 100+ NSE listed companies
http://127.0.0.1:8000/api/data/fetch-prices      ← Historical OHLCV data
http://127.0.0.1:8000/api/data/fetch-nifty       ← Nifty 50 benchmark data
```

> ⚠️ This may take a few minutes. Wait for each endpoint to complete before moving to the next.

---

### 5. Frontend Setup

```bash
cd frontend
npm install
npm start
```

Frontend runs at: `http://localhost:3000`

---

## 🎯 How to Use

1. Navigate to the **Backtest** page
2. Set your **date range** (e.g. 2020-01-01 to 2023-12-31)
3. Choose **rebalance frequency** (Monthly / Quarterly / Yearly)
4. Set **portfolio size** (e.g. Top 20 stocks)
5. Set **filters** — Min/Max Market Cap, Min ROCE
6. Choose **ranking metric** and order (e.g. ROE Descending)
7. Set **position sizing** method
8. Enter your **initial capital** (₹)
9. Click **Run Backtest**
10. View the full **Results Dashboard** — charts, metrics, portfolio log
11. **Export** the portfolio log as CSV

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/data/fetch-stocks` | Fetch and store 100+ Indian stocks |
| `GET` | `/api/data/fetch-prices` | Fetch historical OHLCV data (2018–2024) |
| `GET` | `/api/data/fetch-nifty` | Fetch Nifty 50 benchmark data |
| `POST` | `/api/backtest/run` | Run backtest with given parameters |

Interactive API docs available at: `http://127.0.0.1:8000/docs`

---

## 📦 Data Coverage

| Attribute | Details |
|---|---|
| Companies | 100+ NSE-listed Indian companies |
| Price History | 2018 – 2024 (6 years) |
| Price Records | 148,000+ daily OHLCV entries |
| Fundamentals | ROE, ROCE, PE Ratio, PAT, Revenue |
| Benchmark | Nifty 50 Index |
| Data Source | Yahoo Finance API |

---

## 👨‍💻 Developer

<div align="center">

**Shivraj Gupta**

[![GitHub](https://img.shields.io/badge/GitHub-ShivrajGupta--2004-181717?style=flat-square&logo=github)](https://github.com/ShivrajGupta-2004)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-shivrajgupta2004-0A66C2?style=flat-square&logo=linkedin)](https://linkedin.com/in/shivrajgupta2004)
[![Email](https://img.shields.io/badge/Email-sivrjgupta2529%40gmail.com-EA4335?style=flat-square&logo=gmail&logoColor=white)](mailto:sivrjgupta2529@gmail.com)
<br/>

*Built as part of a Full Stack Developer assignment for **Qode Advisors LLP***

</div>

---

<div align="center">

Made with ❤️ and real market data &nbsp;·&nbsp; © 2026 BacktestIQ

</div>
