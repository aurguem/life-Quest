import { GoogleGenAI, Type, Schema } from "@google/genai";
import { MoodAnalysisResult, StatType } from "../types";

const MODEL_NAME = 'gemini-2.5-flash';

const moodAnalysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    moodScore: {
      type: Type.NUMBER,
      description: "1점(매우 우울/에너지 낮음)에서 10점(매우 행복/에너지 높음) 사이의 점수.",
    },
    analysis: {
      type: Type.STRING,
      description: "사용자에게 전하는 짧고 동기부여가 되는 RPG 멘토의 조언 (최대 2문장). 한국어로 작성하세요.",
    },
    suggestedQuests: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING, description: "퀘스트 제목 (한국어)" },
          description: { type: Type.STRING, description: "퀘스트 설명 (한국어)" },
          type: {
            type: Type.STRING,
            enum: [StatType.STR, StatType.INT, StatType.CHA, StatType.WIS],
          },
          difficulty: {
            type: Type.STRING,
            enum: ['Easy', 'Medium', 'Hard'],
          },
          xp: { type: Type.NUMBER },
        },
        required: ['title', 'description', 'type', 'difficulty', 'xp'],
      },
    },
  },
  required: ['moodScore', 'analysis', 'suggestedQuests'],
};

// Lazy initialization holder
let ai: GoogleGenAI | null = null;

const getAiClient = () => {
  if (!ai) {
    // Initialize only when needed to prevent "process is not defined" error on initial page load
    // in environments where process.env might be unstable at boot time.
    ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  return ai;
};

export const analyzeMoodAndGetQuests = async (context?: string): Promise<MoodAnalysisResult> => {
  try {
    const client = getAiClient();
    
    const prompt = `
      당신은 "라이프 RPG"의 게임 마스터입니다. 사용자에게 오늘 수행할 퀘스트를 부여하세요.
      
      사용자 상황/요청: "${context || "균형 잡힌 하루를 위한 퀘스트를 주세요."}"
      
      1. 사용자의 기분 점수(1-10)를 추정하거나 랜덤하게 부여하여 활력을 불어넣으세요.
      2. 3가지 퀘스트를 생성하세요. 
         - 난이도는 'Easy'(쉬움), 'Medium'(보통), 'Hard'(어려움)를 적절히 섞어서 구성하세요.
         - 'Easy': 5분 이내로 할 수 있는 가벼운 활동.
         - 'Medium': 15~30분 정도 집중이 필요한 활동. (예: 방 청소하기, 20분 독서, 가벼운 산책)
         - 'Hard': 1시간 이상 또는 큰 용기가 필요한 활동.
      
      반드시 한국어로 응답하세요.
    `;

    const response = await client.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: moodAnalysisSchema,
      },
    });

    if (response.text) {
      const data = JSON.parse(response.text) as MoodAnalysisResult;
      return data;
    } else {
      throw new Error("No response from AI");
    }
  } catch (error) {
    console.error("Gemini API Error:", error);
    
    // Check if error is related to API Key
    if (error instanceof Error && (error.message.includes("API key") || error.message.includes("process"))) {
       return {
        moodScore: 0,
        analysis: "API 키 설정 오류: Vercel 환경 변수에 API_KEY가 설정되어 있는지 확인해주세요.",
        suggestedQuests: []
      };
    }

    // Fallback if API fails
    return {
      moodScore: 5,
      analysis: "서버와의 연결이 불안정합니다. 하지만 당신의 모험은 계속되어야 합니다.",
      suggestedQuests: [
        {
          title: "잠시 휴식하기",
          description: "창밖을 바라보며 5분간 눈을 쉬게 해주세요.",
          type: StatType.WIS,
          difficulty: 'Easy',
          xp: 10
        },
        {
          title: "주변 정리정돈",
          description: "책상 위나 주변을 10분간 깨끗이 정리하세요.",
          type: StatType.STR,
          difficulty: 'Medium',
          xp: 25
        }
      ]
    };
  }
};