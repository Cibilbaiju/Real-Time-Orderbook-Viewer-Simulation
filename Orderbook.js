import React, { useContext } from 'react';
import { OrderbookContext } from '../context/OrderbookContext';
import OrderRow from './OrderRow';
import LoadingSkeleton from './LoadingSkeleton';

function Orderbook() {
  const { state } = useContext(OrderbookContext);
  const { bids = [], asks = [] } = state.orderbooks[state.venue];
  const { simulatedOrder } = state;

  const getFormattedData = (data, sideToCompare) => {
    const slicedData = data.slice(0, 15);
    if (!simulatedOrder) return slicedData.map(d => ({ ...d, isSimulated: false }));
    
    const { side, type, price, quantity } = simulatedOrder;
    if (side !== sideToCompare) return slicedData.map(d => ({ ...d, isSimulated: false }));

    if (type === 'Limit') {
        return slicedData.map(d => ({ ...d, isSimulated: side === 'Sell' ? d.price >= price : d.price <= price }));
    }
    if (type === 'Market') {
        let cumulativeSize = 0;
        return slicedData.map(d => {
            const shouldHighlight = cumulativeSize < quantity;
            if (shouldHighlight) cumulativeSize += d.size;
            return { ...d, isSimulated: shouldHighlight };
        });
    }
    return slicedData.map(d => ({ ...d, isSimulated: false }));
  };

  const formattedBids = getFormattedData(bids, 'Sell');
  const formattedAsks = getFormattedData(asks, 'Buy').reverse();
  const isDataReady = bids.length > 0 && asks.length > 0;

  return (
    <div className="p-4 border rounded-lg bg-[#111] border-gray-800">
      <h2 className="mb-4 text-xl font-bold text-white">Order Book: {state.venue} - {state.symbol}</h2>
      <div className="grid grid-cols-2 gap-6">
        <div>
          <h3 className="mb-2 text-lg font-semibold text-center text-gray-400">Bids</h3>
          {isDataReady ? <div className="space-y-1.5">{formattedBids.map((bid, i) => <OrderRow key={`bid-${bid.price}-${i}`} {...bid} />)}</div> : <LoadingSkeleton />}
        </div>
        <div>
          <h3 className="mb-2 text-lg font-semibold text-center text-gray-400">Asks</h3>
          {isDataReady ? <div className="space-y-1.5">{formattedAsks.map((ask, i) => <OrderRow key={`ask-${ask.price}-${i}`} {...ask} />)}</div> : <LoadingSkeleton />}
        </div>
      </div>
    </div>
  );
}

export default Orderbook;
