import React, { useReducer, useEffect, useRef } from 'react';
import { OrderbookProvider, orderbookReducer, initialState } from '../context/OrderbookContext';
import useWebSocket from '../hooks/useWebSocket';
import useGsap from '../hooks/useGsap';

import OrderForm from '../components/OrderForm';
import ImpactMetrics from '../components/ImpactMetrics';
import Orderbook from '../components/Orderbook';
import MarketDepth from '../components/MarketDepth';
import OrderbookImbalance from '../components/OrderbookImbalance';
import ConnectionStatus from '../components/ConnectionStatus';

function HomePage() {
  const [state, dispatch] = useReducer(orderbookReducer, initialState);
  const gsap = useGsap();
  const mainRef = useRef(null);

  useEffect(() => {
    if (gsap && mainRef.current) {
        gsap.from(mainRef.current.children, {
            y: 30,
            opacity: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: 'power3.out'
        });
    }
  }, [gsap]);

  useWebSocket(state.venue, state.symbol, dispatch);

  return (
    <OrderbookProvider value={{ state, dispatch }}>
      <div className="min-h-screen bg-black text-gray-200 p-4 sm:p-6 lg:p-8 font-sans">
        <header ref={mainRef} className="mb-8 text-center">
          <div className="flex justify-center items-center mb-2"><ConnectionStatus /></div>
          <h1 className="text-4xl lg:text-5xl font-extrabold text-white">
            Real-Time Orderbook Viewer
          </h1>
          <p className="mt-2 text-gray-400">
            Simulate trades and get AI-powered analysis across multiple exchanges.
          </p>
        </header>
        <main className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <OrderForm />
            <ImpactMetrics />
          </div>
          <div className="lg:col-span-2 space-y-6">
            <Orderbook />
            <MarketDepth />
            <OrderbookImbalance />
          </div>
        </main>
        <footer className="text-center text-gray-600 mt-12 text-sm">
          <p>Data sourced from OKX, Bybit, and Deribit. Copyright © 2025 cibilbaiju.</p>
        </footer>
      </div>
    </OrderbookProvider>
  );
}

export default HomePage;