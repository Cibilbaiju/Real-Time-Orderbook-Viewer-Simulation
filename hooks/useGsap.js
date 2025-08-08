import { useState, useEffect } from 'react';

const useGsap = () => {
    const [gsap, setGsap] = useState(null);
    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js';
        script.async = true;
        script.onload = () => {
            setGsap(window.gsap);
        };
        document.body.appendChild(script);
        return () => {
            if (script.parentNode) {
                document.body.removeChild(script);
            }
        };
    }, []);
    return gsap;
};

export default useGsap;
