import React from 'react';

function MetricsCard({ title, value }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl px-6 py-5">
      <p className="text-gray-400 text-sm mb-1">{title}</p>
      <p className="text-2xl font-bold text-emerald-400">{value}</p>
    </div>
  );
}

export default MetricsCard;
