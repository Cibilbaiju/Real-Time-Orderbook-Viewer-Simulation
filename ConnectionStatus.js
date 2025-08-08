import React, { useContext } from 'react';
import { OrderbookContext } from '../context/OrderbookContext';

const ConnectionStatus = () => {
    const { state } = useContext(OrderbookContext);
    const { connectionStatus } = state;
    const statusColor = {
        'Live': 'bg-green-500',
        'Connecting': 'bg-yellow-500',
        'Error': 'bg-red-500',
        'Closed': 'bg-gray-500',
    }[connectionStatus];

    return (
        <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${statusColor} animate-pulse`}></div>
            <span className="text-sm text-gray-400">{connectionStatus}</span>
        </div>
    );
};

export default ConnectionStatus;

