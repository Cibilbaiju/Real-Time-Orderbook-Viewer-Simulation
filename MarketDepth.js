import React, { useMemo, useContext } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { OrderbookContext } from '../context/OrderbookContext';

function MarketDepth() {
  const { state } = useContext(OrderbookContext);
  const { bids = [], asks = [] } = state.orderbooks[state.venue];

  const chartData = useMemo(() => {
    if (!bids.length || !asks.length) return [];
    let bidTotal = 0;
    const bidData = bids.slice(0, 15).map(bid => { bidTotal += bid.size; return { price: bid.price, Bids: bidTotal }; }).reverse();
    let askTotal = 0;
    const askData = asks.slice(0, 15).map(ask => { askTotal += ask.size; return { price: ask.price, Asks: askTotal }; });
    return [...bidData, ...askData];
  }, [bids, asks]);

  return (
    <div className="p-4 mt-6 border rounded-lg bg-[#111] border-gray-800">
      <h2 className="mb-4 text-xl font-bold text-white">Market Depth</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }} barGap={0} barCategoryGap={0}>
          <XAxis dataKey="price" stroke="#6b7280" fontSize={12} />
          <YAxis stroke="#6b7280" fontSize={12} />
          <Tooltip contentStyle={{ backgroundColor: '#111', border: '1px solid #374151', borderRadius: '0.5rem' }} labelStyle={{ color: '#d1d5db' }} cursor={{ fill: 'rgba(255,255,255,0.1)' }} />
          <Legend />
          <Bar dataKey="Bids" fill="#9ca3af" />
          <Bar dataKey="Asks" fill="#4b5563" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default MarketDepth;