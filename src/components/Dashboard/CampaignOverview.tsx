import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowRight } from 'lucide-react';

const data = [
  { name: 'Aug 1', emails: 145, sms: 82, calls: 63 },
  { name: 'Aug 8', emails: 165, sms: 95, calls: 78 },
  { name: 'Aug 15', emails: 158, sms: 88, calls: 72 },
  { name: 'Aug 22', emails: 175, sms: 102, calls: 85 },
  { name: 'Aug 29', emails: 188, sms: 115, calls: 92 },
  { name: 'Sep 5', emails: 195, sms: 125, calls: 98 },
  { name: 'Sep 12', emails: 186, sms: 118, calls: 89 },
];

export function CampaignOverview() {
  // Custom tooltip for the chart
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-zinc-900 border border-[#B38B3F]/20 p-3 rounded-lg shadow-lg">
          <p className="text-white font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {`${entry.name}: ${entry.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div 
      className="bg-gradient-to-br from-zinc-900 to-black border border-[#B38B3F]/20 rounded-xl overflow-hidden transition-all duration-300 hover:border-[#B38B3F]/40 hover:shadow-lg hover:shadow-[#B38B3F]/5 card-gold-glow"
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <h2 className="text-xl font-bold text-white">Campaign Overview</h2>
          </div>
          <div className="flex space-x-2">
            <button className="bg-white/5 hover:bg-white/10 text-white/70 hover:text-[#FFD700] px-3 py-1.5 rounded-lg text-sm font-medium transition-colors">
              Daily
            </button>
            <button className="bg-white/5 hover:bg-white/10 text-white/70 hover:text-[#FFD700] px-3 py-1.5 rounded-lg text-sm font-medium transition-colors">
              Weekly
            </button>
            <button className="bg-white/5 hover:bg-white/10 text-white/70 hover:text-[#FFD700] px-3 py-1.5 rounded-lg text-sm font-medium transition-colors">
              Monthly
            </button>
          </div>
        </div>
        
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="name" tick={{ fill: '#999' }} />
              <YAxis tick={{ fill: '#999' }} />
              <Tooltip 
                content={<CustomTooltip />} 
                cursor={{ fill: 'transparent' }} // Remove the white highlight
              />
              <Bar dataKey="emails" name="Email" fill="#B38B3F" radius={[4, 4, 0, 0]} />
              <Bar dataKey="sms" name="SMS" fill="#FFD700" radius={[4, 4, 0, 0]} />
              <Bar dataKey="calls" name="Calls" fill="#6366F1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}