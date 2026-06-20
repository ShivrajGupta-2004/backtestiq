import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BacktestForm from '../components/BacktestForm';

function Backtest() {
  const navigate = useNavigate();

  const handleSubmit = (formData) => {
    localStorage.setItem('backtestParams', JSON.stringify(formData));
    navigate('/results');
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <h2 className="text-3xl font-bold text-white mb-2">Configure Backtest</h2>
      <p className="text-gray-400 mb-8">Set your filters, ranking logic and position sizing.</p>
      <BacktestForm onSubmit={handleSubmit} />
    </div>
  );
}

export default Backtest;
