import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="min-h-screen bg-gray-950">

      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
        <span className="bg-emerald-900 text-emerald-400 text-xs font-semibold px-3 py-1 rounded-full mb-6 tracking-widest uppercase">Equity Backtesting Platform</span>
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-5 leading-tight">
          Backtest Your <span className="text-emerald-400">Equity Strategy</span><br />with Real Market Data
        </h1>
        <p className="text-gray-400 text-lg mb-10 max-w-2xl">
          Define filters, ranking logic, and position sizing — then run a full historical backtest on 100+ Indian listed companies with real OHLCV data.
        </p>
        <div className="flex gap-4">
          <Link to="/backtest" className="bg-emerald-500 hover:bg-emerald-400 text-black font-semibold px-8 py-3 rounded-lg transition text-lg">
            Configure & Run Backtest
          </Link>
          <Link to="/results" className="border border-gray-700 hover:border-emerald-400 text-gray-300 hover:text-emerald-400 font-semibold px-8 py-3 rounded-lg transition text-lg">
            View Results
          </Link>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="border-y border-gray-800 bg-gray-900 py-8 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <p className="text-3xl font-bold text-emerald-400">100+</p>
            <p className="text-gray-400 text-sm mt-1">Indian Listed Companies</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-emerald-400">6 Years</p>
            <p className="text-gray-400 text-sm mt-1">Historical Price Data</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-emerald-400">1.4L+</p>
            <p className="text-gray-400 text-sm mt-1">Price Records in DB</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-emerald-400">Real-time</p>
            <p className="text-gray-400 text-sm mt-1">Backtest Engine</p>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-white text-center mb-12">Everything You Need to Test a Strategy</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <div className="text-emerald-400 text-2xl mb-3">📊</div>
            <h3 className="text-white font-semibold text-lg mb-2">Smart Filtering</h3>
            <p className="text-gray-400 text-sm">Filter stocks by Market Cap range, ROCE threshold, and PAT positivity to build a clean investable universe.</p>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <div className="text-emerald-400 text-2xl mb-3">🏆</div>
            <h3 className="text-white font-semibold text-lg mb-2">Ranking System</h3>
            <p className="text-gray-400 text-sm">Rank stocks by ROE, ROCE, PE Ratio, or PAT Growth in ascending or descending order to pick top performers.</p>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <div className="text-emerald-400 text-2xl mb-3">⚖️</div>
            <h3 className="text-white font-semibold text-lg mb-2">Position Sizing</h3>
            <p className="text-gray-400 text-sm">Choose Equal Weighted, Market Cap Weighted, or Metric Weighted allocation across your selected portfolio.</p>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <div className="text-emerald-400 text-2xl mb-3">🔄</div>
            <h3 className="text-white font-semibold text-lg mb-2">Rebalancing</h3>
            <p className="text-gray-400 text-sm">Rebalance your portfolio Monthly, Quarterly, or Yearly with automatic compounding logic at each period.</p>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <div className="text-emerald-400 text-2xl mb-3">📈</div>
            <h3 className="text-white font-semibold text-lg mb-2">Performance Metrics</h3>
            <p className="text-gray-400 text-sm">Get CAGR, Sharpe Ratio, Max Drawdown, and Total Return computed from real historical price data.</p>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <div className="text-emerald-400 text-2xl mb-3">💾</div>
            <h3 className="text-white font-semibold text-lg mb-2">Export Results</h3>
            <p className="text-gray-400 text-sm">Download your full portfolio log with dates, capital, and returns as a CSV file for further analysis.</p>
          </div>

        </div>
      </div>

      {/* How it Works */}
      <div className="bg-gray-900 border-t border-gray-800 py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="w-10 h-10 rounded-full bg-emerald-500 text-black font-bold flex items-center justify-center mx-auto mb-3">1</div>
              <h4 className="text-white font-semibold mb-1">Set Parameters</h4>
              <p className="text-gray-400 text-sm">Choose date range, rebalance frequency and initial capital</p>
            </div>
            <div>
              <div className="w-10 h-10 rounded-full bg-emerald-500 text-black font-bold flex items-center justify-center mx-auto mb-3">2</div>
              <h4 className="text-white font-semibold mb-1">Define Filters</h4>
              <p className="text-gray-400 text-sm">Filter by market cap, ROCE and rank by your preferred metric</p>
            </div>
            <div>
              <div className="w-10 h-10 rounded-full bg-emerald-500 text-black font-bold flex items-center justify-center mx-auto mb-3">3</div>
              <h4 className="text-white font-semibold mb-1">Run Backtest</h4>
              <p className="text-gray-400 text-sm">Engine runs on real OHLCV data from PostgreSQL database</p>
            </div>
            <div>
              <div className="w-10 h-10 rounded-full bg-emerald-500 text-black font-bold flex items-center justify-center mx-auto mb-3">4</div>
              <h4 className="text-white font-semibold mb-1">Analyze Results</h4>
              <p className="text-gray-400 text-sm">View charts, metrics and export portfolio log as CSV</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tech Stack */}
      <div className="max-w-4xl mx-auto px-6 py-16 text-center">
        <h2 className="text-2xl font-bold text-white mb-8">Built With</h2>
        <div className="flex flex-wrap justify-center gap-3">
          {['React.js', 'Tailwind CSS', 'Recharts', 'FastAPI', 'Python', 'PostgreSQL', 'SQLAlchemy', 'Yahoo Finance API', 'Pandas', 'NumPy'].map(tech => (
            <span key={tech} className="bg-gray-800 border border-gray-700 text-gray-300 px-4 py-2 rounded-full text-sm">{tech}</span>
          ))}
        </div>
        
      </div>
{/* Footer */}
<footer className="border-t border-gray-800 bg-gray-900 py-8 px-6">
  <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
    <div>
      <p className="text-emerald-400 font-bold text-lg">BacktestIQ</p>
      <p className="text-gray-500 text-xs mt-1">Equity Backtesting Platform for Indian Markets</p>
    </div>
    <div className="flex gap-6 text-gray-500 text-sm">
      <span>Built with FastAPI + React + PostgreSQL</span>
    </div>
    <div className="text-gray-600 text-xs text-center">
      © {new Date().getFullYear()} BacktestIQ. Built by Shivraj Gupta.<br />
      Data sourced from Yahoo Finance. For educational purposes only.
    </div>
  </div>
</footer>
    </div>
  );
  
}

export default Home;