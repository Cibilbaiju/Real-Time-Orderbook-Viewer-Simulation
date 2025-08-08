import React, { useState, useEffect, useRef } from 'react';
import useGsap from '../hooks/useGsap';

const AnimatedMetric = ({ value, suffix }) => {
    const [displayValue, setDisplayValue] = useState(0);
    const gsap = useGsap();
    const valRef = useRef({ val: 0 });

    useEffect(() => {
        if (!gsap || typeof value !== 'number') return;
        gsap.to(valRef.current, {
            val: value,
            duration: 1,
            ease: 'power2.out',
            onUpdate: () => setDisplayValue(valRef.current.val)
        });
    }, [value, gsap]);

    return <span className="font-mono text-lg font-semibold text-white">{displayValue.toFixed(value > 1 ? 2 : 4)}{suffix}</span>;
};

export default AnimatedMetric;
