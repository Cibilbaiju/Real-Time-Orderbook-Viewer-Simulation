import React, { useEffect, useRef } from 'react';
import useGsap from '../hooks/useGsap';

const OrderRow = ({ price, size, isSimulated }) => {
    const rowRef = useRef(null);
    const gsap = useGsap();

    if (typeof price !== 'number' || typeof size !== 'number') return null;

    useEffect(() => {
        if (gsap && isSimulated && rowRef.current) {
            gsap.fromTo(rowRef.current, 
                { backgroundColor: '#facc15', color: '#000', scale: 1.05 }, 
                { backgroundColor: 'rgba(255,255,255,0.05)', color: '#e5e7eb', scale: 1, duration: 0.7, ease: 'power2.out' }
            );
        }
    }, [isSimulated, gsap]);

    return (
        <div ref={rowRef} className="flex justify-between p-1.5 rounded-md bg-white/5">
            <span className="text-gray-300">{price.toFixed(2)}</span>
            <span className="font-mono text-gray-100">{size.toFixed(4)}</span>
        </div>
    );
};

export default OrderRow;
