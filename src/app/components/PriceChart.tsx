// src/app/components/PriceChart.tsx
"use client"; // <--- This magic line tells Next.js this runs in the browser

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface ChartProps {
  data: any[]; // In a real job, define a proper interface
}

export default function PriceChart({ data }: ChartProps) {
  return (
    <div className="h-[300px] w-full bg-slate-900 rounded-xl p-4 border border-slate-800">
      <h3 className="text-slate-400 mb-4 text-sm">24-Hour Bitcoin Trend</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis 
            dataKey="time" 
            stroke="#94a3b8" 
            fontSize={12}
            tickFormatter={(str) => new Date(str).getHours() + ":00"} 
          />
          <YAxis stroke="#94a3b8" fontSize={12} domain={['auto', 'auto']} />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1e293b', border: 'none' }}
            itemStyle={{ color: '#fff' }}
            labelStyle={{ color: '#94a3b8' }}
          />
          <Line 
            type="monotone" 
            dataKey="price" 
            stroke="#3b82f6" 
            strokeWidth={2} 
            dot={false} 
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}