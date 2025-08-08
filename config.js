export const VENUES = { OKX: 'OKX', BYBIT: 'Bybit', DERIBIT: 'Deribit' };

export const API_URLS = {
  [VENUES.OKX]: 'wss://ws.okx.com:8443/ws/v5/public',
  [VENUES.BYBIT]: 'wss://stream.bybit.com/v5/public/spot',
  [VENUES.DERIBIT]: 'wss://www.deribit.com/ws/api/v2',
};

export const SYMBOLS = {
  [VENUES.OKX]: 'BTC-USDT',
  [VENUES.BYBIT]: 'BTCUSDT',
  [VENUES.DERIBIT]: 'BTC-PERPETUAL',
};

export const THROTTLE_INTERVAL = 500; // ms