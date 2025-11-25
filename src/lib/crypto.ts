// src/lib/crypto.ts

// 1. Define the "Shape" of the data (TypeScript Interface)
// This tells code editors exactly what data to expect, preventing bugs.
export interface CoinData {
    usd: number;
    usd_24h_change: number;
  }
  
  // This matches the structure returned by CoinGecko
  export interface MarketResponse {
    [key: string]: CoinData; 
  }
  
  // 2. The Fetch Function
  export async function getCryptoPrices(): Promise<MarketResponse> {
    // We are fetching Bitcoin, Ethereum, and Solana
    const url = 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd&include_24hr_change=true';
    
    // 'no-store' ensures Next.js fetches fresh data every time the page loads
    // (Critical for real-time data like crypto)
    const res = await fetch(url, { cache: 'no-store' });
  
    if (!res.ok) {
      throw new Error('Failed to fetch coin data');
    }
  
    return res.json();
  }