# 🚀 Real-Time Crypto Intelligence Platform

A Full-Stack Data Engineering project that ingests, stores, and analyzes market data in real-time.

## 🏗 Architecture

```mermaid
graph TD
    subgraph Ingestion_Layer
        Cron[Hourly Cron Job] -->|Fetch Prices| CG[CoinGecko API]
        Cron -->|Fetch News| RSS[CoinDesk RSS]
    end

    subgraph Storage_Layer
        Cron -->|Write Data| DB[(Neon Postgres DB)]
        DB -->|Normalized Tables| Prices[Table: crypto_prices]
        DB -->|Unstructured Text| News[Table: news_articles]
    end

    subgraph Application_Layer
        User[User Interface] -->|Query| NextJS[Next.js 15 App]
        NextJS -->|Read History| DB
        NextJS -->|Context Injection| AI[Gemini 2.5 AI]
    end

    subgraph AI_Analysis
        AI -->|RAG Response| User
    end

The fix we just applied (await searchParams) solves a specific Next.js 15 Breaking Change. In the newest version, URL parameters are "Promises" (asynchronous), meaning the page has to "wait" to read them. Without await, the code saw "Nothing" and defaulted to BTC.

Here is your Roadmap for what comes next.

Step 1: Verify & Deploy (The "Finish Line")
First, let's make sure this version is live on the internet so you can show it off.

Verify Locally:

Run npm run dev.

Change the dropdown to ETH. Click Update.

Success Check: Does the heading say "24-Hour Trend: ETH"? Does the graph change?

Deploy to Vercel:

Run the "Save Point" commands in your terminal:

Bash

git add .
git commit -m "fix: Resolve Next.js 15 searchParams promise await issue"
git push
Go to your Vercel Dashboard. You will see it "Building". When it turns Green, your live link is updated.

Step 2: The "Professional Polish" (Documentation)
Recruiters often look at the README before looking at the code. A generic README is a red flag. A README with an Architecture Diagram is a "Senior Engineer" signal.

Action: Create a README.md file in your root folder and paste this code block. GitHub renders this text as a flowchart automatically.

Markdown

# 🚀 Real-Time Crypto Intelligence Platform

A Full-Stack Data Engineering project that ingests, stores, and analyzes market data in real-time.

## 🏗 Architecture

```mermaid
graph TD
    subgraph Ingestion_Layer
        Cron[Hourly Cron Job] -->|Fetch Prices| CG[CoinGecko API]
        Cron -->|Fetch News| RSS[CoinDesk RSS]
    end

    subgraph Storage_Layer
        Cron -->|Write Data| DB[(Neon Postgres DB)]
        DB -->|Normalized Tables| Prices[Table: crypto_prices]
        DB -->|Unstructured Text| News[Table: news_articles]
    end

    subgraph Application_Layer
        User[User Interface] -->|Query| NextJS[Next.js 15 App]
        NextJS -->|Read History| DB
        NextJS -->|Context Injection| AI[Gemini 2.5 AI]
    end

    subgraph AI_Analysis
        AI -->|RAG Response| User
    end

Key Features:

ELT Pipeline: Automated serverless ingestion of structured (price) and unstructured (news) data.

RAG Architecture: Retrieval-Augmented Generation using Google Gemini 2.5.

Tech Stack: Next.js 15, TypeScript, PostgreSQL, Tailwind CSS.