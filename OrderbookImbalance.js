import React, { useState, useMemo, useRef, useEffect, useContext } from 'react';
import { OrderbookContext } from '../context/OrderbookContext';
import { callGemini } from '../utils/geminiApi';
import useGsap from '../hooks/useGsap';

function OrderbookImbalance() {
    const { state } = useContext(OrderbookContext);
    const { bids = [], asks = [] } = state.orderbooks[state.venue];
    const imbalanceRef = useRef(null);
    const aiBoxRef = useRef(null);
    const gsap = useGsap();
    
    const [sentimentLoading, setSentimentLoading] = useState(false);
    const [sentimentResult, setSentimentResult] = useState('');
    const [sentimentError, setSentimentError] = useState('');

    const imbalance = useMemo(() => {
        const totalBids = bids.slice(0, 15).reduce((acc, curr) => acc + curr.size, 0);
        const totalAsks = asks.slice(0, 15).reduce((acc, curr) => acc + curr.size, 0);
        if (totalBids + totalAsks === 0) return 0;
        return ((totalBids - totalAsks) / (totalBids + totalAsks)) * 100;
    }, [bids, asks]);

    useEffect(() => {
        if (gsap && imbalanceRef.current) {
            const width = Math.abs(imbalance);
            const left = imbalance > 0 ? 50 : 50 - width;
            gsap.to(imbalanceRef.current, {
                width: `${width}%`,
                left: `${left}%`,
                backgroundColor: imbalance > 0 ? '#d4d4d8' : '#737373',
                duration: 0.5,
                ease: 'power2.out'
            });
        }
    }, [imbalance, gsap]);

    useEffect(() => {
        if (gsap && (sentimentResult || sentimentError)) {
            gsap.fromTo(aiBoxRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' });
        }
    }, [sentimentResult, sentimentError, gsap]);

    const handleGetSentiment = () => {
        const prompt = `Analyze the current market sentiment for ${state.symbol}. The order book imbalance is ${imbalance.toFixed(2)}% (positive means buy pressure, negative means sell pressure). Provide a brief, 1-2 sentence market sentiment analysis explaining what this might mean for the short-term price.`;
        callGemini(prompt, setSentimentLoading, setSentimentResult, setSentimentError);
    };

    return (
        <div className="p-4 mt-6 border rounded-lg bg-[#111] border-gray-800">
            <h2 className="mb-2 text-xl font-bold text-white">Order Book Imbalance</h2>
            <div className="relative w-full h-6 my-2 overflow-hidden bg-black border border-gray-700 rounded-full">
                <div ref={imbalanceRef} className="absolute flex items-center justify-center h-full rounded-full">
                   <span className="text-xs font-bold text-black mix-blend-difference">{imbalance.toFixed(2)}%</span>
                </div>
            </div>
             <div className="flex justify-between mt-1 text-xs text-gray-500"><span>Sell Pressure</span><span>Buy Pressure</span></div>
             <div className="mt-6">
                <button onClick={handleGetSentiment} disabled={sentimentLoading} className="w-full px-4 py-2 font-bold text-black bg-white rounded-md hover:bg-gray-200 transition-colors duration-200 disabled:bg-gray-500 disabled:text-gray-800">
                    {sentimentLoading ? 'Getting Sentiment...' : 'Get Market Sentiment'}
                </button>
                {(sentimentResult || sentimentError) && (
                    <div ref={aiBoxRef} className={`mt-4 p-3 text-sm rounded-md ${sentimentError ? 'bg-red-900/50 text-red-300' : 'bg-white/5 text-gray-300'}`}>
                        {sentimentError || sentimentResult}
                    </div>
                )}
            </div>
        </div>
    );
}

export default OrderbookImbalance;
