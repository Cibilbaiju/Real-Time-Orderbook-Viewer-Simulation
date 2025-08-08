Real-Time Multi-Exchange Orderbook Viewer with AI Analysis
This project is a sophisticated financial data visualization tool built with Next.js. It provides a real-time view of cryptocurrency order books from multiple major exchanges, including OKX, Bybit, and Deribit.

The core feature of the application is its order simulation capability, which allows users to place hypothetical market or limit orders and instantly visualize their potential placement and impact on the order book. This is enhanced by an integrated AI-powered analysis feature, which uses the Google Gemini API to provide intelligent feedback on simulated trades and overall market sentiment.

The user interface is designed to be clean, responsive, and professional, featuring a minimalist black-and-white theme with fluid animations powered by GSAP.

Key Features
.Multi-Exchange Connectivity: View real-time order book data from OKX, Bybit, and Deribit.

.Live Data Streaming: Utilizes WebSocket connections for low-latency, real-time data updates.

.Order Simulation: A comprehensive form to simulate market and limit orders.

.Impact Visualization: Simulated orders are highlighted in the order book to show their potential placement and which existing orders they would fill.

.Advanced Financial Metrics:

 .Calculates and displays slippage, market impact, and estimated fill percentage.

 .Includes a market depth chart and an order book imbalance indicator.

.AI-Powered Insights:

 .Trade Analysis: Get an AI-generated analysis of your simulated trade's risks and effectiveness.

 .Market Sentiment: Request an AI-powered summary of the current market sentiment based on order book pressure.

.Modern UI/UX:

 .Sleek, responsive black-and-white theme.

 .Smooth animations and transitions powered by GSAP.

 .Live connection status indicator and loading skeletons for a seamless user experience.

Tech Stack
 .Framework: Next.js

 .Language: JavaScript

 .Styling: Tailwind CSS

 .Animation: GSAP (GreenSock Animation Platform)

 .Charting: Recharts

 .AI Integration: Google Gemini API

Getting Started
Follow these instructions to get the project running on your local machine.

Prerequisites
Node.js (v18 or later)

npm or yarn

Setup Instructions
Clone the repository:

git clone https://github.com/your-username/orderbook-viewer.git
cd orderbook-viewer

Install dependencies:

npm install

Set up your environment variables:

Create a new file in the root of the project named .env.local.

Get your free API key from Google AI Studio.

Add your API key to the .env.local file:

NEXT_PUBLIC_GEMINI_API_KEY=YOUR_API_KEY_HERE

Run the development server:

npm run dev

Open http://localhost:3000 in your browser to see the application.

Copyright and License
Copyright © 2024 cibilbaiju. All Rights Reserved.
