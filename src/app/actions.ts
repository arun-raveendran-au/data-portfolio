// src/app/actions.ts
"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { neon } from "@neondatabase/serverless";

export async function askAI(userQuestion: string) {
  try {
    const sql = neon(process.env.DATABASE_URL!);

    // Fetch News Context
    const newsData = await sql`SELECT title, pub_date FROM news_articles ORDER BY pub_date DESC LIMIT 5`;
    const headlines = newsData.map(r => `- ${r.title}`).join('\n');

    // Fetch Price Context (General Market Overview)
    const prices = await sql`
        SELECT symbol, price_usd FROM crypto_prices 
        WHERE recorded_at > NOW() - INTERVAL '1 hour' 
        ORDER BY recorded_at DESC LIMIT 10
    `;
    const marketData = prices.map(r => `${r.symbol}: $${Number(r.price_usd).toFixed(2)}`).join(', ');

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
      Current Market Data: ${marketData}
      Latest News: ${headlines}
      User Question: "${userQuestion}"
      
      Answer as a senior crypto analyst. Use the news to explain price movements if relevant.
    `;

    const result = await model.generateContent(prompt);
    return (await result.response).text();
    
  } catch (error) {
    console.error("AI Error:", error);
    return "I can't analyze the market right now.";
  }
}