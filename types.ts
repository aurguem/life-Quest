export enum StatType {
  STR = 'STR', // Health, Physical
  INT = 'INT', // Knowledge, Work
  CHA = 'CHA', // Social, Communication
  WIS = 'WIS', // Mental, Willpower
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  type: StatType;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  xp: number;
  completed: boolean;
}

export interface UserStats {
  level: number;
  currentXp: number;
  nextLevelXp: number;
  hp: number;
  maxHp: number;
  streak: number;
  attributes: {
    [key in StatType]: number;
  };
}

export interface MoodAnalysisResult {
  moodScore: number; // 1-10
  analysis: string;
  suggestedQuests: Omit<Quest, 'id' | 'completed'>[];
}

export type TabView = 'HOME' | 'QUESTS' | 'CAMPFIRE' | 'PROFILE';