import React from 'react';

const LoadingSkeleton = () => (
    <div className="space-y-1.5 animate-pulse">
        {[...Array(15)].map((_, i) => <div key={i} className="h-8 rounded-md bg-gray-800"></div>)}
    </div>
);

export default LoadingSkeleton;
