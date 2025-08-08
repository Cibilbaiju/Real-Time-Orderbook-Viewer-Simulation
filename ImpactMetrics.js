import React, { useState, useEffect, useMemo, useRef, useContext } from 'react';
import { OrderbookContext } from '../context/OrderbookContext';
import { callGemini } from '../utils/geminiApi';
import useGsap from '../hooks/useGsap';
import AnimatedMetric from './AnimatedMetric';

function ImpactMetrics() {
    const { state } = useContext(OrderbookContext);
    const { simulatedOrder, orderbooks, venue, symbol } = state;
    const orderbook = orderbooks[venue];
    const aiBoxRef = useRef(null);
    const gsap = useGsap();

    const [analysisLoading, setAnalysisLoading] = useState(false);
    const [analysisResult, setAnalysisResult] = useState('');
    const [analysisError, setAnalysisError] = useState('');

    const metrics = useMemo(() => {
        // Don't calculate until we have a simulated order AND the orderbook data is ready.
        if (!simulatedOrder || !orderbook.bids?.length || !orderbook.asks?.length) {
            return null;
        }
        
        const { type, side, price, quantity } = simulatedOrder;
        
        // Final validation to prevent NaN errors
        if (isNaN(quantity) || quantity <= 0) {
            return { fill: 0, impact: 0, slippage: 0, time: "N/A" };
        }

        let fill = 0, impact = 0, slippage = 0, time = "N/A";
        
        if (type === 'Limit') {
            if (side === 'Buy' && price >= orderbook.asks[0].price) { fill = 100; time = "Immediate"; }
            else if (side === 'Sell' && price <= orderbook.bids[0].price) { fill = 100; time = "Immediate"; }
            else { time = "Uncertain"; }
        } else { // Market Order
            let filledQty = 0, totalCost = 0;
            const bookSide = side === 'Buy' ? orderbook.asks : orderbook.bids;
            
            if (!bookSide || bookSide.length === 0) return null;

            const expectedPrice = bookSide[0].price;
            if (isNaN(expectedPrice) || expectedPrice <= 0) return null;

            for (const level of bookSide) {
                const canFill = Math.min(quantity - filledQty, level.size);
                filledQty += canFill;
                totalCost += canFill * level.price;
                if (filledQty >= quantity) break;
            }

            fill = (filledQty / quantity) * 100;
            if (filledQty > 0) {
                const avgPrice = totalCost / filledQty;
                slippage = ((avgPrice - expectedPrice) / expectedPrice) * 100;
                impact = Math.abs(slippage);
            }
            time = "Immediate";
        }
        
        // Final check for any NaN values before returning
        return { 
            fill: isNaN(fill) ? 0 : fill,
            impact: isNaN(impact) ? 0 : impact,
            slippage: isNaN(slippage) ? 0 : slippage,
            time 
        };
    }, [simulatedOrder, orderbook]);
    
    useEffect(() => {
        setAnalysisResult('');
        setAnalysisError('');
    }, [simulatedOrder]);

    useEffect(() => {
        if (gsap && (analysisResult || analysisError)) {
            gsap.fromTo(aiBoxRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' });
        }
    }, [analysisResult, analysisError, gsap]);

    const handleAnalyzeTrade = () => {
        if (!metrics) return;
        const prompt = `Analyze this simulated trade for ${symbol} on ${venue}: A ${simulatedOrder.side} ${simulatedOrder.type} order for ${simulatedOrder.quantity} units. Resulting slippage was ${metrics.slippage.toFixed(4)}% and market impact was ${metrics.impact.toFixed(4)}%. Provide a 2-3 sentence analysis of the trade's potential risks and effectiveness.`;
        callGemini(prompt, setAnalysisLoading, setAnalysisResult, setAnalysisError);
    };
    
    const slippageIsHigh = metrics && Math.abs(metrics.slippage) > 1;

    return (
        <div className="p-4 mt-6 border rounded-lg bg-[#111] border-gray-800">
            <h2 className="mb-4 text-xl font-bold text-white">Order Impact</h2>
            
            {/* Conditional rendering logic to provide clear user feedback */}
            {!simulatedOrder && <p className="text-gray-500">Simulate an order to see its impact.</p>}
            {simulatedOrder && !metrics && <p className="text-gray-500">Waiting for order book data...</p>}
            
            {metrics && (
            <>
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 rounded-md bg-white/5"><p className="text-sm text-gray-400">Est. Fill %</p><AnimatedMetric value={metrics.fill} suffix="%" /></div>
                    <div className="p-3 rounded-md bg-white/5"><p className="text-sm text-gray-400">Market Impact</p><AnimatedMetric value={metrics.impact} suffix="%" /></div>
                    <div className={`p-3 rounded-md bg-white/5 transition-all ${slippageIsHigh ? 'ring-2 ring-yellow-400' : ''}`}><p className="text-sm text-gray-400">Slippage</p><AnimatedMetric value={metrics.slippage} suffix="%" /></div>
                    <div className="p-3 rounded-md bg-white/5"><p className="text-sm text-gray-400">Time to Fill</p><p className="text-lg font-semibold text-white">{metrics.time}</p></div>
                </div>
                {slippageIsHigh && <p className="mt-4 text-sm font-semibold text-yellow-400">Warning: This order may cause significant slippage.</p>}
                <div className="mt-6">
                    <button onClick={handleAnalyzeTrade} disabled={analysisLoading || !simulatedOrder} className="w-full px-4 py-2 font-bold text-black bg-white rounded-md hover:bg-gray-200 transition-colors duration-200 disabled:bg-gray-500 disabled:text-gray-800">
                        {analysisLoading ? 'Analyzing...' : 'Analyze My Trade'}
                    </button>
                    {(analysisResult || analysisError) && (
                        <div ref={aiBoxRef} className={`mt-4 p-3 text-sm rounded-md ${analysisError ? 'bg-red-900/50 text-red-300' : 'bg-white/5 text-gray-300'}`}>
                            {analysisError || analysisResult}
                        </div>
                    )}
                </div>
            </>
            )}
        </div>
    );
}

export default ImpactMetrics;
