// src/app/components/ChatBot.tsx
"use client";

import { useState } from "react";
import { askAI } from "../actions"; // Import the server action

export default function ChatBot() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question) return;

    setLoading(true);
    setAnswer("");
    
    // Call the server action
    const response = await askAI(question);
    
    setAnswer(response);
    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto mt-12 mb-20">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-slate-300 mb-4">Ask the AI Analyst</h3>
        
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="e.g., What is the trend for Bitcoin?"
            className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
          />
          <button 
            type="submit" 
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? "Analyzing..." : "Ask"}
          </button>
        </form>

        {answer && (
          <div className="mt-6 p-4 bg-slate-950 rounded-lg border border-slate-800">
            <p className="text-slate-300 leading-relaxed">{answer}</p>
          </div>
        )}
      </div>
    </div>
  );
}