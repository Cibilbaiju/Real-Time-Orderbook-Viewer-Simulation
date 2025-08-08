import { createContext } from 'react';
import { VENUES, SYMBOLS } from '../config.js';

export const OrderbookContext = createContext();
export const OrderbookProvider = OrderbookContext.Provider;

export const initialState = {
  orderbooks: {
    [VENUES.OKX]: { bids: [], asks: [] },
    [VENUES.BYBIT]: { bids: [], asks: [] },
    [VENUES.DERIBIT]: { bids: [], asks: [] },
  },
  connectionStatus: 'Connecting',
  simulatedOrder: null,
  venue: VENUES.OKX,
  symbol: SYMBOLS[VENUES.OKX],
};

export function orderbookReducer(state, action) {
  switch (action.type) {
    case 'SET_ORDERBOOK':
      return {
        ...state,
        orderbooks: {
          ...state.orderbooks,
          [action.payload.venue]: action.payload.data,
        },
      };
    case 'SET_SIMULATED_ORDER':
      return { ...state, simulatedOrder: action.payload };
    case 'SET_VENUE':
      return {
        ...state,
        venue: action.payload,
        symbol: SYMBOLS[action.payload],
        simulatedOrder: null,
        connectionStatus: 'Connecting',
      };
    case 'SET_CONNECTION_STATUS':
      return { ...state, connectionStatus: action.payload };
    default:
      return state;
  }
}