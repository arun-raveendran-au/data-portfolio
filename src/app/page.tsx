// src/app/page.tsx
import { getCryptoPrices } from "@/lib/crypto";
import { neon } from "@neondatabase/serverless";
import PriceChart from "./components/PriceChart"; // Import the chart
import ChatBot from "./components/ChatBot";

// Helper to fetch history
async function getHistory() {
  const sql = neon(process.env.DATABASE_URL!);
  // Get last 24 records for BTC, ordered by time
  const response = await sql`
    SELECT price_usd as price, recorded_at as time 
    FROM crypto_prices 
    WHERE symbol = 'BTC' 
    ORDER BY recorded_at ASC 
    LIMIT 24
  `;
  // Convert dates to strings to avoid Next.js serialization warnings
  return response.map(row => ({
    ...row,
    time: row.time.toString(),
    price: Number(row.price)
  }));
}

export default async function Home() {
  // Fetch live data AND history in parallel (Faster!)
  const [liveData, historyData] = await Promise.all([
    getCryptoPrices(),
    getHistory()
  ]);

  const getColor = (change: number) => (change >= 0 ? "text-green-400" : "text-red-400");

  return (
    <main className="min-h-screen bg-slate-950 text-white p-12">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 text-transparent bg-clip-text">
          Arun's Data Portfolio
        </h1>
        <p className="text-slate-400 mt-2">Real-time Ingestion & Historical Analysis</p>
      </header>

      {/* The Chart Section */}
      <div className="max-w-5xl mx-auto mb-8">
        <PriceChart data={historyData} />
      </div>

      {/* The AI Analyst Section */}
      <ChatBot />

      {/* The Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-slate-300">Bitcoin (BTC)</h2>
          <div className="mt-4">
            <p className="text-3xl font-bold">${liveData.bitcoin.usd.toLocaleString()}</p>
            <p className={`text-sm mt-1 ${getColor(liveData.bitcoin.usd_24h_change)}`}>
              {liveData.bitcoin.usd_24h_change.toFixed(2)}% (24h)
            </p>
          </div>
        </div>
        
        {/* (Keep the other cards for ETH and SOL if you want) */}
         <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-slate-300">Ethereum (ETH)</h2>
          <div className="mt-4">
            <p className="text-3xl font-bold">${liveData.ethereum.usd.toLocaleString()}</p>
          </div>
        </div>
      </div>
      {/* NEW FOOTER */}
      <AboutMe />
    </main>
  );
}

function AboutMe() {
  return (
    <div className="mt-24 border-t border-slate-800 pt-12 text-center">
      <h2 className="text-2xl font-bold text-slate-200">Built by Arun Raveendran</h2>
      <p className="text-slate-400 mt-2 mb-6">Senior Data Engineer & Full Stack Developer</p>
      
      <div className="flex justify-center gap-4 text-sm text-slate-500">
        <span className="px-3 py-1 bg-slate-900 rounded border border-slate-800">Next.js 14</span>
        <span className="px-3 py-1 bg-slate-900 rounded border border-slate-800">Neon Postgres</span>
        <span className="px-3 py-1 bg-slate-900 rounded border border-slate-800">Google Gemini AI</span>
        <span className="px-3 py-1 bg-slate-900 rounded border border-slate-800">Tailwind CSS</span>
      </div>

      <div className="mt-8 flex justify-center gap-6">
        <a href="https://github.com/arun-raveendran-au/data-portfolio" target="_blank" className="text-blue-400 hover:text-blue-300 transition-colors">
          View Source Code
        </a>
        <a href="https://www.linkedin.com/in/raveendran-arun" target="_blank" className="text-blue-400 hover:text-blue-300 transition-colors">
          LinkedIn
        </a>
      </div>
    </div>
  );
}