import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="bg-gray-900 border-b border-gray-800 px-8 py-4 flex items-center justify-between">
      <div className="text-xl font-bold text-emerald-400">BacktestIQ</div>
      <div className="flex gap-8">
        <Link to="/" className="text-gray-300 hover:text-emerald-400 transition">Home</Link>
        <Link to="/backtest" className="text-gray-300 hover:text-emerald-400 transition">Backtest</Link>
        <Link to="/results" className="text-gray-300 hover:text-emerald-400 transition">Results</Link>
      </div>
    </nav>
  );
}

export default Navbar;
