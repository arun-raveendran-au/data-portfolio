// src/app/page.tsx
import { neon } from "@neondatabase/serverless";
import PriceChart from "./components/PriceChart";
import ChatBot from "./components/ChatBot";

// 1. Fetch Unique Coins for the Dropdown
async function getAvailableCoins() {
  const sql = neon(process.env.DATABASE_URL!);
  // Get distinct symbols that we have data for
  const res = await sql`SELECT DISTINCT symbol FROM crypto_prices ORDER BY symbol`;
  return res.map(row => row.symbol);
}

// 2. Fetch History for the SELECTED coin
async function getHistory(symbol: string) {
  const sql = neon(process.env.DATABASE_URL!);
  const response = await sql`
    SELECT price_usd as price, recorded_at as time 
    FROM crypto_prices 
    WHERE symbol = ${symbol} 
    ORDER BY recorded_at ASC 
    LIMIT 24
  `;
  return response.map(row => ({
    ...row,
    time: row.time.toString(),
    price: Number(row.price)
  }));
}

// 3. Fetch News
async function getNews() {
  const sql = neon(process.env.DATABASE_URL!);
  return await sql`SELECT title, link, pub_date FROM news_articles ORDER BY pub_date DESC LIMIT 4`;
}

// The Page Component now accepts "searchParams" (URL parameters)
// 1. UPDATE the function signature to accept a Promise
export default async function Home({ 
  searchParams 
}: { 
  searchParams: Promise<{ coin?: string }> 
}) {
  
  // 2. AWAIT the params before reading the coin
  const params = await searchParams;
  const selectedCoin = (params.coin || 'BTC').toUpperCase();
  
  const [historyData, availableCoins, newsData] = await Promise.all([
    getHistory(selectedCoin),
    getAvailableCoins(),
    getNews()
  ]);

  return (
    <main className="min-h-screen bg-slate-950 text-white p-12">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 text-transparent bg-clip-text">
          Arun's Market Intelligence
        </h1>
      </header>

      {/* COIN SELECTOR */}
      <div className="max-w-5xl mx-auto mb-6 flex justify-end">
        <form className="flex gap-2 items-center">
          <label className="text-slate-400 text-sm">Select Asset:</label>
          <select 
            name="coin" 
            defaultValue={selectedCoin}
            // This little script submits the form instantly when you change the dropdown
            // It causes a page reload with the new ?coin=XYZ param
            className="bg-slate-900 border border-slate-700 rounded px-3 py-1 text-white"
            // In a real app we'd use a Client Component, but this works for SSR
          >
             {availableCoins.map((c) => (
               <option key={c} value={c}>{c}</option>
             ))}
          </select>
          <button type="submit" className="bg-blue-600 px-4 py-1 rounded text-sm">Update</button>
        </form>
      </div>

      {/* CHART */}
      <div className="max-w-5xl mx-auto mb-8">
        <h2 className="text-xl mb-4 font-semibold text-slate-300">24-Hour Trend: {selectedCoin}</h2>
        {historyData.length > 0 ? (
          <PriceChart data={historyData} />
        ) : (
          <div className="p-12 text-center border border-slate-800 rounded bg-slate-900 text-slate-500">
            No history data found for {selectedCoin}. (Run the Cron Job!)
          </div>
        )}
      </div>

      {/* AI CHAT */}
      <ChatBot />

      {/* NEWS TICKER */}
      <div className="max-w-5xl mx-auto mt-12">
        <h3 className="text-slate-400 mb-4 border-b border-slate-800 pb-2">Latest Headlines</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {newsData.map((n, i) => (
            <a key={i} href={n.link} target="_blank" className="p-4 bg-slate-900 border border-slate-800 rounded hover:border-blue-500 transition-all">
              <h4 className="font-medium text-blue-100">{n.title}</h4>
              <p className="text-xs text-slate-500 mt-2">{new Date(n.pub_date).toLocaleString()}</p>
            </a>
          ))}
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