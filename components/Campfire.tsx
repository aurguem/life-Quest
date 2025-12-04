import React, { useEffect, useState } from 'react';
import { Users, Tent, Sparkles } from 'lucide-react';

const Campfire: React.FC = () => {
  const [onlineCount, setOnlineCount] = useState(1);
  const [messages, setMessages] = useState<string[]>([]);

  // Simulate "Online" presence
  useEffect(() => {
    // Initial random count
    setOnlineCount(Math.floor(Math.random() * 20) + 5);

    const interval = setInterval(() => {
      setOnlineCount(prev => {
        const change = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
        return Math.max(1, prev + change);
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // System messages (no user chat, just ambient notifications)
  useEffect(() => {
    const ambientMessages = [
      "여행자가 모닥불 옆에 앉았습니다.",
      "누군가 불 속으로 장작을 던져넣었습니다.",
      "따스한 온기가 마음을 편안하게 합니다...",
      "어디선가 희미한 콧노래 소리가 들립니다.",
      "불티가 밤하늘 위로 춤추며 날아오릅니다.",
      "당신은 혼자가 아닙니다.",
      "또 다른 모험가가 여기서 휴식을 취하고 있습니다."
    ];

    const messageInterval = setInterval(() => {
      const randomMsg = ambientMessages[Math.floor(Math.random() * ambientMessages.length)];
      setMessages(prev => [randomMsg, ...prev].slice(0, 3));
    }, 8000);

    return () => clearInterval(messageInterval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full p-6 text-center animate-in fade-in duration-700">
      
      {/* Campfire Visuals */}
      <div className="relative mb-12 mt-8">
        {/* Glow effect */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-orange-600 rounded-full blur-[60px] opacity-20 fire-glow"></div>
        
        {/* Fire Icon / Animation */}
        <div className="relative z-10 text-orange-500 fire-glow">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="80"
            height="80"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="drop-shadow-[0_0_15px_rgba(234,88,12,0.8)]"
          >
            <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.115.385-2.256 1-3.25" />
            <path d="M12 10v4" className="text-yellow-400" />
          </svg>
        </div>
        
        {/* Logs */}
        <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 flex gap-1">
          <div className="w-12 h-3 bg-amber-900 rounded-full rotate-12"></div>
          <div className="w-12 h-3 bg-amber-900 rounded-full -rotate-12"></div>
        </div>
      </div>

      <h2 className="text-2xl font-serif text-orange-100 mb-2">고요한 모닥불</h2>
      <p className="text-orange-200/60 max-w-xs mx-auto mb-8 text-sm">
        이곳에서는 말이 필요 없습니다. 그저 존재만으로 충분합니다. 
        자신만의 싸움을 이어가는 다른 모험가들과 함께 휴식을 취하세요.
      </p>

      {/* Online Counter */}
      <div className="flex items-center gap-2 bg-slate-900/50 px-4 py-2 rounded-full border border-orange-900/30 text-orange-300 mb-8">
        <Users className="w-4 h-4" />
        <span className="font-mono">{onlineCount}명의 모험가가 휴식 중</span>
      </div>

      {/* Ambient Feed */}
      <div className="w-full max-w-sm space-y-3">
        {messages.map((msg, i) => (
          <div key={i} className={`text-sm text-slate-400 italic transition-all duration-1000 ${i === 0 ? 'opacity-100' : 'opacity-40'}`}>
            "{msg}"
          </div>
        ))}
      </div>

      {/* Action Button */}
      <button className="mt-12 group flex items-center gap-2 text-slate-500 hover:text-orange-400 transition-colors">
        <Tent className="w-5 h-5" />
        <span className="text-sm">텐트 치기</span>
      </button>
    </div>
  );
};

export default Campfire;