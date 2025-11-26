// src/app/api/cron/route.ts
import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';
import { getCryptoPrices } from '@/lib/crypto';

export async function GET() {
  try {
    // 1. Fetch latest data
    const data = await getCryptoPrices();
    
    // 2. Connect to DB
    const sql = neon(process.env.DATABASE_URL!);

    // 3. Insert Data (Batch insert)
    // We use a loop or multiple insert statements. 
    // Here is a simple explicit way:
    await sql`
      INSERT INTO crypto_prices (symbol, price_usd)
      VALUES 
      ('BTC', ${data.bitcoin.usd}),
      ('ETH', ${data.ethereum.usd}),
      ('SOL', ${data.solana.usd})
    `;

    return NextResponse.json({ message: 'Data successfully scraped and stored!' });
  } catch (error) {
    console.error('Cron job failed:', error);
    return NextResponse.json({ error: 'Failed to run cron' }, { status: 500 });
  }
}