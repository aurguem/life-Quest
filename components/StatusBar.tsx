import React from 'react';
import { UserStats } from '../types';
import { Heart, Flame, Shield } from 'lucide-react';

interface StatusBarProps {
  stats: UserStats;
}

const StatusBar: React.FC<StatusBarProps> = ({ stats }) => {
  const hpPercent = (stats.hp / stats.maxHp) * 100;
  const xpPercent = (stats.currentXp / stats.nextLevelXp) * 100;

  return (
    <div className="w-full bg-slate-900 border-b border-slate-800 p-4 sticky top-0 z-50 shadow-xl">
      <div className="max-w-md mx-auto">
        
        <div className="flex justify-between items-end mb-2">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center border-2 border-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.5)]">
                <span className="text-xl font-bold text-white">{stats.level}</span>
              </div>
              <div className="absolute -bottom-2 -right-2 bg-slate-800 text-xs px-1.5 py-0.5 rounded border border-slate-600 text-slate-300">
                LVL
              </div>
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-200">플레이어 1</h2>
              <div className="flex items-center gap-1 text-xs text-orange-400">
                <Flame className="w-3 h-3 fill-orange-500" />
                <span>{stats.streak}일 연속</span>
              </div>
            </div>
          </div>

          <div className="text-right">
            <div className="text-xs text-slate-400 mb-0.5">체력</div>
            <div className="w-32 h-3 bg-slate-800 rounded-full overflow-hidden border border-slate-700 relative">
               <div 
                 className="h-full bg-gradient-to-r from-red-600 to-red-400 transition-all duration-500 ease-out"
                 style={{ width: `${hpPercent}%` }}
               ></div>
               <div className="absolute inset-0 flex items-center justify-center text-[8px] font-bold text-white drop-shadow-md">
                 {stats.hp} / {stats.maxHp}
               </div>
            </div>
          </div>
        </div>

        {/* XP Bar */}
        <div className="relative w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mt-3">
          <div 
            className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]"
            style={{ width: `${xpPercent}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-[10px] text-slate-500 mt-1">
          <span>{stats.currentXp} XP</span>
          <span>다음 레벨: {stats.nextLevelXp} XP</span>
        </div>

      </div>
    </div>
  );
};

export default StatusBar;