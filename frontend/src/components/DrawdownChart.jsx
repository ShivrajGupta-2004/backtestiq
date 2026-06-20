import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

function DrawdownChart({ data }) {
  const chartData = (data || []).map((point, i, arr) => {
    const peak = Math.max(...arr.slice(0, i + 1).map(p => p.value));
    const drawdown = ((point.value - peak) / peak) * 100;
    return { date: point.date, drawdown: parseFloat(drawdown.toFixed(2)) };
  });

  return (
    <ResponsiveContainer width="100%" height={250}>
      <AreaChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
        <XAxis dataKey="date" stroke="#6b7280" tick={{ fontSize: 11 }} />
        <YAxis stroke="#6b7280" tick={{ fontSize: 11 }}
          tickFormatter={(v) => `${v}%`} />
        <Tooltip
          contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '8px' }}
          labelStyle={{ color: '#9ca3af' }}
          formatter={(value) => [`${value}%`, 'Drawdown']}
        />
        <Area type="monotone" dataKey="drawdown" stroke="#ef4444" fill="#ef444420" strokeWidth={2} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export default DrawdownChart;