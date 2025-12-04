import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { UserStats, StatType } from '../types';

interface StatRadarProps {
  stats: UserStats;
}

const StatRadar: React.FC<StatRadarProps> = ({ stats }) => {
  const data = [
    { subject: 'STR', A: stats.attributes[StatType.STR], fullMark: 100 },
    { subject: 'INT', A: stats.attributes[StatType.INT], fullMark: 100 },
    { subject: 'CHA', A: stats.attributes[StatType.CHA], fullMark: 100 },
    { subject: 'WIS', A: stats.attributes[StatType.WIS], fullMark: 100 },
  ];

  return (
    <div className="w-full h-64 relative">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
          <PolarGrid stroke="#475569" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 'bold' }} />
          <PolarRadiusAxis angle={30} domain={[0, 'auto']} tick={false} axisLine={false} />
          <Radar
            name="Stats"
            dataKey="A"
            stroke="#8b5cf6"
            strokeWidth={3}
            fill="#8b5cf6"
            fillOpacity={0.4}
          />
        </RadarChart>
      </ResponsiveContainer>
      
      {/* Decorative center glow */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-purple-500 rounded-full blur-md opacity-50 pointer-events-none"></div>
    </div>
  );
};

export default StatRadar;