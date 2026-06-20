import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899', '#84cc16', '#f97316', '#a78bfa'];

function exportCSV(portfolioLog) {
  const headers = "Date,Capital,Return\n";
  const rows = portfolioLog.map((log, i, arr) => {
    const prev = i > 0 ? arr[i - 1].capital : arr[0].capital;
    const ret = ((log.capital - prev) / prev * 100).toFixed(2);
    return `${log.date},${log.capital},${ret}%`;
  }).join("\n");
  const blob = new Blob([headers + rows], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "backtest_results.csv";
  a.click();
}

function MetricCard({ title, value, sub }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl px-5 py-4">
      <p className="text-gray-400 text-xs mb-1">{title}</p>
      <p className="text-2xl font-bold text-emerald-400">{value}</p>
      {sub && <p className="text-gray-500 text-xs mt-1">{sub}</p>}
    </div>
  );
}

function Results() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const params = JSON.parse(localStorage.getItem('backtestParams'));
    if (!params) { setError("No backtest params found."); setLoading(false); return; }
    axios.post('http://127.0.0.1:8000/api/backtest/run', params)
      .then(res => { setResult(res.data); setLoading(false); })
      .catch(() => { setError("Backtest failed. Check backend."); setLoading(false); });
  }, []);

  if (loading) return <div className="flex items-center justify-center min-h-screen text-emerald-400 text-xl">Running backtest...</div>;
  if (error) return <div className="flex items-center justify-center min-h-screen text-red-400 text-xl">{error}</div>;
  if (result?.error) return <div className="flex items-center justify-center min-h-screen text-red-400 text-xl">{result.error}</div>;

  const monthlyNifty = (result.niftyCurve || []).filter((_, i) => i % 21 === 0);

  const combinedData = result.equityCurve.map((point, i) => ({
    date: point.date,
    strategy: point.value,
    nifty: monthlyNifty[i] ? monthlyNifty[i].nifty : null
  }));

  const monthlyReturns = result.equityCurve.map((point, i, arr) => {
    if (i === 0) return null;
    const ret = ((point.value - arr[i - 1].value) / arr[i - 1].value * 100).toFixed(2);
    return { date: point.date.slice(0, 7), return: parseFloat(ret) };
  }).filter(Boolean).slice(-24);

  const drawdownData = result.equityCurve.map((point, i, arr) => {
    const peak = Math.max(...arr.slice(0, i + 1).map(p => p.value));
    return { date: point.date, drawdown: parseFloat(((point.value - peak) / peak * 100).toFixed(2)) };
  });

  const pieData = result.topStocks.map((s) => ({
    name: s.replace('.NS', ''),
    value: parseFloat((100 / result.topStocks.length).toFixed(2))
  }));

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Backtest Results Dashboard</h2>
        <button
          onClick={() => exportCSV(result.portfolioLog)}
          className="bg-emerald-500 hover:bg-emerald-400 text-black font-semibold px-5 py-2 rounded-lg transition text-sm">
          Export CSV
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <MetricCard title="CAGR" value={`${result.metrics.cagr}%`} sub="Annualized Return" />
        <MetricCard title="Sharpe Ratio" value={result.metrics.sharpe} sub="Risk-adjusted Return" />
        <MetricCard title="Max Drawdown" value={`${result.metrics.maxDrawdown}%`} sub="Worst Peak-to-Trough" />
        <MetricCard title="Total Return" value={`${result.metrics.totalReturn}%`} sub="Overall Gain" />
      </div>

      {/* Row 1: Equity Curve + Pie */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="col-span-2 bg-gray-900 border border-gray-800 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-gray-300 mb-4">Equity Curve vs Nifty 50</h3>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={combinedData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis dataKey="date" stroke="#4b5563" tick={{ fontSize: 10 }} tickFormatter={v => v.slice(0, 7)} />
              <YAxis stroke="#4b5563" tick={{ fontSize: 10 }} tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} />
              <Tooltip contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '8px' }} formatter={v => [`₹${Number(v).toLocaleString()}`]} />
              <Legend wrapperStyle={{ color: '#9ca3af', fontSize: '12px' }} />
              <Line type="monotone" dataKey="strategy" stroke="#10b981" strokeWidth={2} dot={false} name="Strategy" />
              <Line type="monotone" dataKey="nifty" stroke="#3b82f6" strokeWidth={2} dot={false} name="Nifty 50" connectNulls />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-gray-300 mb-4">Portfolio Allocation</h3>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={90} dataKey="value" label={({ name }) => name}>
                {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '8px' }} formatter={v => [`${v}%`, 'Weight']} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Row 2: Drawdown + Monthly Returns */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-gray-300 mb-4">Drawdown</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={drawdownData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis dataKey="date" stroke="#4b5563" tick={{ fontSize: 10 }} tickFormatter={v => v.slice(0, 7)} />
              <YAxis stroke="#4b5563" tick={{ fontSize: 10 }} tickFormatter={v => `${v}%`} />
              <Tooltip contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '8px' }} formatter={v => [`${v}%`, 'Drawdown']} />
              <Area type="monotone" dataKey="drawdown" stroke="#ef4444" fill="#ef444420" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-gray-300 mb-4">Monthly Returns</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthlyReturns}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis dataKey="date" stroke="#4b5563" tick={{ fontSize: 9 }} />
              <YAxis stroke="#4b5563" tick={{ fontSize: 10 }} tickFormatter={v => `${v}%`} />
              <Tooltip contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '8px' }} formatter={v => [`${v}%`, 'Return']} />
              <Bar dataKey="return" radius={[3, 3, 0, 0]} isAnimationActive={true}>
                {monthlyReturns.map((entry, i) => (
                  <Cell key={i} fill={entry.return >= 0 ? '#10b981' : '#ef4444'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Row 3: Top Stocks + Portfolio Log */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-gray-300 mb-4">Top Stocks Selected</h3>
          <div className="flex flex-col gap-2">
            {result.topStocks.map((s, i) => (
              <div key={s} className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                <span className="text-gray-300 text-sm">{s.replace('.NS', '')}</span>
                <span className="ml-auto text-emerald-400 text-xs">{(100 / result.topStocks.length).toFixed(1)}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="col-span-2 bg-gray-900 border border-gray-800 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-gray-300 mb-4">Portfolio Log</h3>
          <div className="overflow-y-auto max-h-64">
            <table className="w-full text-sm text-gray-300">
              <thead className="sticky top-0 bg-gray-900">
                <tr className="border-b border-gray-700">
                  <th className="text-left py-2 text-gray-400">Date</th>
                  <th className="text-left py-2 text-gray-400">Capital</th>
                  <th className="text-left py-2 text-gray-400">Return</th>
                </tr>
              </thead>
              <tbody>
                {result.portfolioLog.map((log, i) => {
                  const prev = i > 0 ? result.portfolioLog[i - 1].capital : result.portfolioLog[0].capital;
                  const ret = ((log.capital - prev) / prev * 100).toFixed(2);
                  return (
                    <tr key={i} className="border-b border-gray-800 hover:bg-gray-800">
                      <td className="py-2">{log.date}</td>
                      <td className="py-2">₹{log.capital.toLocaleString()}</td>
                      <td className={`py-2 ${parseFloat(ret) >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>{ret}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Results;