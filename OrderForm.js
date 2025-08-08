import React, { useState, useContext } from 'react';
import { OrderbookContext } from '../context/OrderbookContext';
import { VENUES } from '../config.js';

function OrderForm() {
  const { state, dispatch } = useContext(OrderbookContext);
  const [order, setOrder] = useState({ type: 'Limit', side: 'Buy', price: '', quantity: '' });

  const handleChange = (e) => setOrder({ ...order, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    const price = parseFloat(order.price) || 0;
    const quantity = parseFloat(order.quantity) || 0;
    if (quantity <= 0) return; // Prevent simulation with no quantity

    dispatch({ type: 'SET_SIMULATED_ORDER', payload: { ...order, price, quantity } });
    setOrder(o => ({ ...o, price: '', quantity: '' }));
  };
  
  const isSubmitDisabled = !order.quantity || parseFloat(order.quantity) <= 0;

  return (
    <div className="p-4 border rounded-lg bg-[#111] border-gray-800">
      <h2 className="mb-4 text-xl font-bold text-white">Simulate Order</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-400">Venue</label>
          <select name="venue" value={state.venue} onChange={(e) => dispatch({ type: 'SET_VENUE', payload: e.target.value })} className="w-full p-2 mt-1 text-white bg-gray-800 border border-gray-700 rounded-md focus:ring-2 focus:ring-white/50">
            {Object.values(VENUES).map(v => <option key={v}>{v}</option>)}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-400">Type</label>
            <select name="type" value={order.type} onChange={handleChange} className="w-full p-2 mt-1 text-white bg-gray-800 border border-gray-700 rounded-md focus:ring-2 focus:ring-white/50">
              <option>Limit</option>
              <option>Market</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400">Side</label>
            <select name="side" value={order.side} onChange={handleChange} className="w-full p-2 mt-1 text-white bg-gray-800 border border-gray-700 rounded-md focus:ring-2 focus:ring-white/50">
              <option>Buy</option>
              <option>Sell</option>
            </select>
          </div>
        </div>
        {order.type === 'Limit' && (
          <div>
            <label className="block text-sm font-medium text-gray-400">Price</label>
            <input type="number" name="price" value={order.price} onChange={handleChange} required step="any" className="w-full p-2 mt-1 text-white bg-gray-800 border border-gray-700 rounded-md focus:ring-2 focus:ring-white/50" />
          </div>
        )}
        <div>
          <label className="block text-sm font-medium text-gray-400">Quantity</label>
          <input type="number" name="quantity" value={order.quantity} onChange={handleChange} required step="any" className="w-full p-2 mt-1 text-white bg-gray-800 border border-gray-700 rounded-md focus:ring-2 focus:ring-white/50" />
        </div>
        <button type="submit" disabled={isSubmitDisabled} className="w-full px-4 py-2 font-bold text-black bg-white rounded-md hover:bg-gray-200 transition-colors duration-200 disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed">
            Simulate Order
        </button>
      </form>
    </div>
  );
}

export default OrderForm;
