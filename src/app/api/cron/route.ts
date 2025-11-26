// src/app/api/cron/route.ts
import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';
import Parser from 'rss-parser';

export async function GET() {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    
    // 1. FETCH TOP 10 COINS
    // We use the 'markets' endpoint which gives us ranked data
    const coinsRes = await fetch(
      'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false', 
      { cache: 'no-store' }
    );
    const coinsData = await coinsRes.json();

    // 2. FETCH NEWS
    const parser = new Parser();
    const feed = await parser.parseURL('https://www.coindesk.com/arc/outboundfeeds/rss/');
    const newsItems = feed.items.slice(0, 5); // Top 5 headlines

    // 3. INSERT COINS (Batch Insert)
    for (const coin of coinsData) {
      await sql`
        INSERT INTO crypto_prices (symbol, price_usd)
        VALUES (${coin.symbol.toUpperCase()}, ${coin.current_price})
      `;
    }

    // 4. INSERT NEWS (Skip duplicates)
    for (const article of newsItems) {
      const existing = await sql`SELECT id FROM news_articles WHERE title = ${article.title} LIMIT 1`;
      if (existing.length === 0) {
        await sql`
          INSERT INTO news_articles (title, link, pub_date)
          VALUES (${article.title || 'No Title'}, ${article.link || '#'}, ${article.pubDate || new Date().toISOString()})
        `;
      }
    }

    return NextResponse.json({ message: 'Top 10 Coins & News Ingested!' });
  } catch (error) {
    console.error('Cron job failed:', error);
    return NextResponse.json({ error: 'Failed to run cron' }, { status: 500 });
  }
}