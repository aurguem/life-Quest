import React, { useState, useEffect } from 'react';
import { 
  Home, 
  Map, 
  Flame, 
  User, 
  Sparkles,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';
import StatusBar from './components/StatusBar';
import StatRadar from './components/StatRadar';
import QuestCard from './components/QuestCard';
import Campfire from './components/Campfire';
import { analyzeMoodAndGetQuests } from './services/geminiService';
import { UserStats, Quest, StatType, TabView } from './types';

function App() {
  // --- State Management ---
  const [activeTab, setActiveTab] = useState<TabView>('HOME');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiMessage, setAiMessage] = useState<string>("준비되셨나요? 오늘의 모험이 기다리고 있습니다.");
  
  // Initial Mock Data
  const [stats, setStats] = useState<UserStats>({
    level: 3,
    currentXp: 450,
    nextLevelXp: 1000,
    hp: 80,
    maxHp: 100,
    streak: 5,
    attributes: {
      [StatType.STR]: 15,
      [StatType.INT]: 24,
      [StatType.CHA]: 12,
      [StatType.WIS]: 18,
    }
  });

  const [quests, setQuests] = useState<Quest[]>([
    {
      id: '1',
      title: "아침 수분 충전",
      description: "물 한 잔을 마셔 몸을 깨우세요.",
      type: StatType.STR,
      difficulty: 'Easy',
      xp: 20,
      completed: false
    },
    {
      id: '2',
      title: "책상 정리하기",
      description: "집중력을 위해 10분간 책상 위 불필요한 물건을 치우세요.",
      type: StatType.INT,
      difficulty: 'Medium',
      xp: 45,
      completed: false
    },
    {
      id: '3',
      title: "지식의 조각",
      description: "책을 5페이지 읽어 지능을 높이세요.",
      type: StatType.INT,
      difficulty: 'Easy',
      xp: 30,
      completed: true
    }
  ]);

  // --- Handlers ---

  const handleCompleteQuest = (id: string) => {
    setQuests(prev => prev.map(q => {
      if (q.id === id && !q.completed) {
        // Update Stats
        setStats(curr => {
          const newXp = curr.currentXp + q.xp;
          const leveledUp = newXp >= curr.nextLevelXp;
          
          return {
            ...curr,
            currentXp: leveledUp ? newXp - curr.nextLevelXp : newXp,
            level: leveledUp ? curr.level + 1 : curr.level,
            nextLevelXp: leveledUp ? Math.floor(curr.nextLevelXp * 1.2) : curr.nextLevelXp,
            attributes: {
              ...curr.attributes,
              [q.type]: curr.attributes[q.type] + (q.difficulty === 'Hard' ? 3 : q.difficulty === 'Medium' ? 2 : 1)
            }
          };
        });
        return { ...q, completed: true };
      }
      return q;
    }));
  };

  const handleGenerateQuests = async () => {
    setIsAnalyzing(true);
    setAiMessage("새로운 임무를 수신 중입니다...");
    
    try {
      // No input needed, just ask for quests
      const result = await analyzeMoodAndGetQuests();
      
      setAiMessage(result.analysis);
      
      // Convert suggested quests to actual quest objects
      const newQuests: Quest[] = result.suggestedQuests.map((sq, idx) => ({
        ...sq,
        id: Date.now().toString() + idx,
        completed: false
      }));

      // Add to quest board
      setQuests(prev => [...newQuests, ...prev]);
      setActiveTab('QUESTS'); // Switch to quest tab to show new quests
    } catch (error) {
      setAiMessage("통신 상태가 좋지 않습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // --- Render Helpers ---

  const renderContent = () => {
    switch (activeTab) {
      case 'HOME':
        return (
          <div className="p-4 space-y-6 pb-24 animate-in slide-in-from-right duration-300">
            {/* AI Interaction Area */}
            <div className="bg-slate-900/80 rounded-2xl p-6 border border-slate-800 shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Sparkles className="w-24 h-24 text-indigo-500" />
              </div>
              
              <div className="relative z-10">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center border border-indigo-500/50">
                    <Sparkles className="w-5 h-5 text-indigo-300" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-slate-300 leading-relaxed font-medium">
                      "{aiMessage}"
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={handleGenerateQuests}
                  disabled={isAnalyzing}
                  className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-xl text-white font-bold shadow-lg shadow-indigo-900/30 flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isAnalyzing ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      임무 생성 중...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      새로운 퀘스트 받기
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Stats Chart */}
            <div className="bg-slate-900/50 rounded-2xl p-4 border border-slate-800">
              <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">능력치 레이더</h3>
              <StatRadar stats={stats} />
              <div className="grid grid-cols-4 gap-2 mt-4 text-center">
                {(Object.keys(stats.attributes) as StatType[]).map(key => (
                  <div key={key} className="bg-slate-950 rounded p-1">
                    <div className="text-[10px] text-slate-500">{key}</div>
                    <div className="font-bold text-slate-200">{stats.attributes[key]}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent/Active Quest Teaser */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider">진행 중인 퀘스트</h3>
                <button onClick={() => setActiveTab('QUESTS')} className="text-xs text-indigo-400 hover:text-indigo-300">전체 보기</button>
              </div>
              {quests.filter(q => !q.completed)[0] ? (
                <QuestCard quest={quests.filter(q => !q.completed)[0]} onComplete={handleCompleteQuest} />
              ) : (
                <div className="text-center p-6 text-slate-600 text-sm border border-dashed border-slate-800 rounded-xl">
                  진행 중인 퀘스트가 없습니다. 위 버튼을 눌러 임무를 받으세요.
                </div>
              )}
            </div>
          </div>
        );

      case 'QUESTS':
        return (
          <div className="p-4 pb-24 animate-in slide-in-from-right duration-300">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Map className="w-5 h-5 text-indigo-400" />
              퀘스트 일지
            </h2>
            
            <div className="space-y-4">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">수락 가능</div>
              {quests.filter(q => !q.completed).length === 0 && (
                <div className="text-center py-8 px-4 bg-slate-900/50 rounded-xl border border-dashed border-slate-800">
                  <p className="text-slate-400 text-sm mb-2">현재 수행할 임무가 없습니다.</p>
                  <button 
                    onClick={handleGenerateQuests}
                    className="text-indigo-400 hover:text-indigo-300 text-sm font-medium flex items-center justify-center gap-1 mx-auto"
                  >
                    <RefreshCw className="w-3 h-3" />
                    새 임무 받기
                  </button>
                </div>
              )}
              {quests.filter(q => !q.completed).map(quest => (
                <QuestCard key={quest.id} quest={quest} onComplete={handleCompleteQuest} />
              ))}

              {quests.some(q => q.completed) && (
                <>
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-8">완료됨</div>
                  <div className="opacity-60">
                    {quests.filter(q => q.completed).map(quest => (
                      <QuestCard key={quest.id} quest={quest} onComplete={() => {}} />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        );

      case 'CAMPFIRE':
        return <Campfire />;
      
      case 'PROFILE':
        return (
          <div className="p-4 flex flex-col items-center justify-center h-[60vh] text-slate-400">
            <User className="w-16 h-16 mb-4 opacity-50" />
            <p>프로필 및 설정 (준비 중)</p>
            <div className="mt-8 p-4 bg-red-900/20 border border-red-900/50 rounded-lg max-w-xs text-center">
              <div className="flex justify-center mb-2"><AlertTriangle className="w-6 h-6 text-red-500" /></div>
              <p className="text-xs text-red-300">
                경고: 일일 퀘스트를 수행하지 않으면 체력이 감소합니다. 연속 기록을 유지하여 생존하세요.
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-purple-500/30">
      
      {/* Top Status Bar (Persistent) */}
      <StatusBar stats={stats} />

      {/* Main Content Area */}
      <main className="max-w-md mx-auto min-h-screen relative">
        {renderContent()}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-slate-900/90 backdrop-blur-md border-t border-slate-800 pb-safe z-50">
        <div className="max-w-md mx-auto flex justify-around items-center p-2">
          <button 
            onClick={() => setActiveTab('HOME')}
            className={`p-3 rounded-xl transition-all ${activeTab === 'HOME' ? 'text-indigo-400 bg-indigo-500/10' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <Home className="w-6 h-6" />
          </button>
          <button 
            onClick={() => setActiveTab('QUESTS')}
            className={`p-3 rounded-xl transition-all ${activeTab === 'QUESTS' ? 'text-indigo-400 bg-indigo-500/10' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <Map className="w-6 h-6" />
          </button>
          <button 
            onClick={() => setActiveTab('CAMPFIRE')}
            className={`p-3 rounded-xl transition-all ${activeTab === 'CAMPFIRE' ? 'text-orange-400 bg-orange-500/10' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <Flame className="w-6 h-6" />
          </button>
          <button 
            onClick={() => setActiveTab('PROFILE')}
            className={`p-3 rounded-xl transition-all ${activeTab === 'PROFILE' ? 'text-indigo-400 bg-indigo-500/10' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <User className="w-6 h-6" />
          </button>
        </div>
      </nav>
    </div>
  );
}

export default App;