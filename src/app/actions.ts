// src/app/actions.ts
"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { neon } from "@neondatabase/serverless";

export async function askAI(userQuestion: string) {
  // The API Key check is important for future debugging.
  if (!process.env.GEMINI_API_KEY) {
    console.error("GEMINI_API_KEY is not set in the environment.");
    return "Sorry, the AI service is not configured correctly.";
  }

  try {
    // 1. Fetch the Context (Data from your DB)
    const sql = neon(process.env.DATABASE_URL!);
    const data = await sql`
      SELECT symbol, price_usd, recorded_at 
      FROM crypto_prices 
      WHERE recorded_at > NOW() - INTERVAL '24 hours'
      ORDER BY recorded_at DESC
      LIMIT 30
    `;

    // 2. Format the data as a string for the AI
    const dataContext = data.map(row => 
      `${row.symbol}: $${Number(row.price_usd).toFixed(2)} at ${new Date(row.recorded_at).getHours()}:00`
    ).join('\n');

    // 3. Call Gemini with the standard model.
    // After the user enables the API and billing in their Google Cloud project,
    // this model will be available.
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
      You are a crypto analyst. Here is the last 24 hours of pricing data from my database:
      
      ${dataContext}

      User Question: "${userQuestion}"

      Answer briefly based ONLY on the data provided above. Mention trends if you see them.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    return response.text();
    
  } catch (error: any) {
    // Log the detailed error for debugging, but return a simple message to the user.
    console.error("AI Error:", error);
    return "Sorry, I couldn't analyze the market right now.";
  }
}
