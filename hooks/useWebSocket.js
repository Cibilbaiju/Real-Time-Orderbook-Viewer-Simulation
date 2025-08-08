import { useEffect, useRef } from 'react';
import { API_URLS, VENUES, THROTTLE_INTERVAL } from '../config.js';

function useWebSocket(venue, symbol, dispatch) {
  const lastUpdateTime = useRef(0);

  useEffect(() => {
    dispatch({ type: 'SET_CONNECTION_STATUS', payload: 'Connecting' });
    const ws = new WebSocket(API_URLS[venue]);

    ws.onopen = () => {
      dispatch({ type: 'SET_CONNECTION_STATUS', payload: 'Live' });
      const subscriptions = {
        [VENUES.OKX]: { op: 'subscribe', args: [{ channel: 'books', instId: symbol }] },
        [VENUES.BYBIT]: { op: 'subscribe', args: [`orderbook.15.${symbol}`] },
        [VENUES.DERIBIT]: { jsonrpc: '2.0', method: 'public/subscribe', params: { channels: [`book.${symbol}.100ms`] } },
      };
      ws.send(JSON.stringify(subscriptions[venue]));
    };

    ws.onmessage = (event) => {
      const now = Date.now();
      if (now - lastUpdateTime.current < THROTTLE_INTERVAL) return;
      lastUpdateTime.current = now;

      const data = JSON.parse(event.data);
      let bids = [], asks = [];

      try {
        if (venue === VENUES.OKX && data.arg?.channel === 'books' && data.data) {
          const book = data.data[0];
          bids = book.bids.map(([p, s]) => ({ price: parseFloat(p), size: parseFloat(s) }));
          asks = book.asks.map(([p, s]) => ({ price: parseFloat(p), size: parseFloat(s) }));
        } else if (venue === VENUES.BYBIT && data.topic?.startsWith('orderbook') && data.data) {
          bids = data.data.b.map(([p, s]) => ({ price: parseFloat(p), size: parseFloat(s) }));
          asks = data.data.a.map(([p, s]) => ({ price: parseFloat(p), size: parseFloat(s) }));
        } else if (venue === VENUES.DERIBIT && data.params) {
          bids = data.params.data.bids.map(([p, s]) => ({ price: parseFloat(p), size: parseFloat(s) }));
          asks = data.params.data.asks.map(([p, s]) => ({ price: parseFloat(p), size: parseFloat(s) }));
        }

        if (bids.length > 0 || asks.length > 0) {
          dispatch({ type: 'SET_ORDERBOOK', payload: { venue, data: { bids, asks } } });
        }
      } catch (e) {
        console.error("Failed to parse websocket data:", e);
      }
    };

    ws.onerror = (error) => {
      console.error(`WebSocket Error (${venue}):`, error);
      dispatch({ type: 'SET_CONNECTION_STATUS', payload: 'Error' });
    };
    ws.onclose = () => dispatch({ type: 'SET_CONNECTION_STATUS', payload: 'Closed' });

    return () => ws.close();
  }, [venue, symbol, dispatch]);
}

export default useWebSocket;