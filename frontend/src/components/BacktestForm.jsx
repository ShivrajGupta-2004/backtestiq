import React, { useState } from 'react';

function BacktestForm({ onSubmit }) {
  const [form, setForm] = useState({
    startDate: '',
    endDate: '',
    rebalanceFreq: 'monthly',
    portfolioSize: 20,
    positionSizing: 'equal',
    minMarketCap: 1000,
    maxMarketCap: 10000,
    minROCE: 15,
    rankMetric: 'roe',
    rankOrder: 'descending',
    initialCapital: 100000,
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">

      {/* Date Range */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-gray-400 text-sm mb-1 block">Start Date</label>
          <input type="date" name="startDate" value={form.startDate}
            onChange={handleChange}
            className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:border-emerald-400" />
        </div>
        <div>
          <label className="text-gray-400 text-sm mb-1 block">End Date</label>
          <input type="date" name="endDate" value={form.endDate}
            onChange={handleChange}
            className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:border-emerald-400" />
        </div>
      </div>

      {/* Rebalance + Portfolio Size */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-gray-400 text-sm mb-1 block">Rebalance Frequency</label>
          <select name="rebalanceFreq" value={form.rebalanceFreq} onChange={handleChange}
            className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:border-emerald-400">
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>
        <div>
          <label className="text-gray-400 text-sm mb-1 block">Portfolio Size (Top N stocks)</label>
          <input type="number" name="portfolioSize" value={form.portfolioSize}
            onChange={handleChange}
            className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:border-emerald-400" />
        </div>
      </div>

      {/* Position Sizing */}
      <div>
        <label className="text-gray-400 text-sm mb-1 block">Position Sizing</label>
        <select name="positionSizing" value={form.positionSizing} onChange={handleChange}
          className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:border-emerald-400">
          <option value="equal">Equal Weighted</option>
          <option value="marketcap">Market Cap Weighted</option>
          <option value="metric">Metric Weighted (ROCE)</option>
        </select>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-gray-400 text-sm mb-1 block">Min Market Cap (₹ Cr)</label>
          <input type="number" name="minMarketCap" value={form.minMarketCap}
            onChange={handleChange}
            className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:border-emerald-400" />
        </div>
        <div>
          <label className="text-gray-400 text-sm mb-1 block">Max Market Cap (₹ Cr)</label>
          <input type="number" name="maxMarketCap" value={form.maxMarketCap}
            onChange={handleChange}
            className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:border-emerald-400" />
        </div>
      </div>

      <div>
        <label className="text-gray-400 text-sm mb-1 block">Min ROCE (%)</label>
        <input type="number" name="minROCE" value={form.minROCE}
          onChange={handleChange}
          className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:border-emerald-400" />
      </div>

      {/* Ranking */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-gray-400 text-sm mb-1 block">Rank By</label>
          <select name="rankMetric" value={form.rankMetric} onChange={handleChange}
            className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:border-emerald-400">
            <option value="roe">ROE</option>
            <option value="pe">PE Ratio</option>
            <option value="roce">ROCE</option>
            <option value="pat">PAT Growth</option>
          </select>
        </div>
        <div>
          <label className="text-gray-400 text-sm mb-1 block">Rank Order</label>
          <select name="rankOrder" value={form.rankOrder} onChange={handleChange}
            className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:border-emerald-400">
            <option value="descending">Descending</option>
            <option value="ascending">Ascending</option>
          </select>
        </div>
      </div>

      {/* Initial Capital */}
      <div>
        <label className="text-gray-400 text-sm mb-1 block">Initial Capital (₹)</label>
        <input type="number" name="initialCapital" value={form.initialCapital}
          onChange={handleChange}
          className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:border-emerald-400" />
      </div>

      <button type="submit"
        className="bg-emerald-500 hover:bg-emerald-400 text-black font-semibold px-8 py-3 rounded-lg transition text-lg mt-2">
        Run Backtest
      </button>

    </form>
  );
}

export default BacktestForm;