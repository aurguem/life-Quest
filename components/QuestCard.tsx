import React from 'react';
import { Quest, StatType } from '../types';
import { CheckCircle2, Circle, Dumbbell, Brain, Zap, Sparkles } from 'lucide-react';

interface QuestCardProps {
  quest: Quest;
  onComplete: (id: string) => void;
}

const QuestCard: React.FC<QuestCardProps> = ({ quest, onComplete }) => {
  const getIcon = (type: StatType) => {
    switch (type) {
      case StatType.STR: return <Dumbbell className="w-4 h-4 text-red-400" />;
      case StatType.INT: return <Brain className="w-4 h-4 text-blue-400" />;
      case StatType.CHA: return <Sparkles className="w-4 h-4 text-yellow-400" />;
      case StatType.WIS: return <Zap className="w-4 h-4 text-emerald-400" />;
    }
  };

  const getBorderColor = (type: StatType) => {
    switch (type) {
      case StatType.STR: return 'border-red-900/50 hover:border-red-500/50';
      case StatType.INT: return 'border-blue-900/50 hover:border-blue-500/50';
      case StatType.CHA: return 'border-yellow-900/50 hover:border-yellow-500/50';
      case StatType.WIS: return 'border-emerald-900/50 hover:border-emerald-500/50';
    }
  };

  const getBadgeColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-slate-700 text-slate-300';
      case 'Medium': return 'bg-indigo-900 text-indigo-200';
      case 'Hard': return 'bg-orange-900 text-orange-200';
      default: return 'bg-slate-700';
    }
  };

  const difficultyMap: Record<string, string> = {
    'Easy': '쉬움',
    'Medium': '보통',
    'Hard': '어려움'
  };

  return (
    <div 
      className={`relative group p-4 mb-3 rounded-xl border-2 ${getBorderColor(quest.type)} bg-slate-900/50 backdrop-blur-sm transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg hover:shadow-purple-900/20 cursor-pointer overflow-hidden`}
      onClick={() => !quest.completed && onComplete(quest.id)}
    >
      <div className="flex items-start justify-between z-10 relative">
        <div className="flex-1 pr-4">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1 bg-slate-800 border border-slate-700`}>
              {getIcon(quest.type)} {quest.type}
            </span>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getBadgeColor(quest.difficulty)}`}>
              {difficultyMap[quest.difficulty] || quest.difficulty}
            </span>
            <span className="text-xs text-purple-300 font-bold">+{quest.xp} XP</span>
          </div>
          <h3 className={`font-semibold text-lg ${quest.completed ? 'text-slate-500 line-through' : 'text-slate-100'}`}>
            {quest.title}
          </h3>
          <p className={`text-sm mt-1 ${quest.completed ? 'text-slate-600' : 'text-slate-400'}`}>
            {quest.description}
          </p>
        </div>
        
        <div className="mt-1">
          {quest.completed ? (
            <CheckCircle2 className="w-6 h-6 text-green-500" />
          ) : (
            <Circle className="w-6 h-6 text-slate-600 group-hover:text-purple-400 transition-colors" />
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestCard;