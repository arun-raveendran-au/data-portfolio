// src/app/page.tsx
import { getCryptoPrices } from "@/lib/crypto";

export default async function Home() {
  // Call our helper function directly in the component
  const data = await getCryptoPrices();

  // Helper function to color-code the percentage change
  const getColor = (change: number) => (change >= 0 ? "text-green-400" : "text-red-400");

  return (
    <main className="min-h-screen bg-slate-950 text-white p-12">
      {/* Header Section */}
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 text-transparent bg-clip-text">
          Arun's Data Portfolio
        </h1>
        <p className="text-slate-400 mt-2">Real-time Market Ingestion Pipeline</p>
      </header>

      {/* The Data Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        
        {/* BITCOIN CARD */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-blue-500 transition-all">
          <h2 className="text-xl font-semibold text-slate-300">Bitcoin (BTC)</h2>
          <div className="mt-4">
            <p className="text-3xl font-bold">${data.bitcoin.usd.toLocaleString()}</p>
            <p className={`text-sm mt-1 ${getColor(data.bitcoin.usd_24h_change)}`}>
              {data.bitcoin.usd_24h_change.toFixed(2)}% (24h)
            </p>
          </div>
        </div>

        {/* ETHEREUM CARD */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-purple-500 transition-all">
          <h2 className="text-xl font-semibold text-slate-300">Ethereum (ETH)</h2>
          <div className="mt-4">
            <p className="text-3xl font-bold">${data.ethereum.usd.toLocaleString()}</p>
            <p className={`text-sm mt-1 ${getColor(data.ethereum.usd_24h_change)}`}>
              {data.ethereum.usd_24h_change.toFixed(2)}% (24h)
            </p>
          </div>
        </div>

        {/* SOLANA CARD */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-emerald-500 transition-all">
          <h2 className="text-xl font-semibold text-slate-300">Solana (SOL)</h2>
          <div className="mt-4">
            <p className="text-3xl font-bold">${data.solana.usd.toLocaleString()}</p>
            <p className={`text-sm mt-1 ${getColor(data.solana.usd_24h_change)}`}>
              {data.solana.usd_24h_change.toFixed(2)}% (24h)
            </p>
          </div>
        </div>

      </div>
    </main>
  );
}