/**
 * Skincare Service - Routines, directions, and coaching
 * Handles: getSkincareDirection, getPersonalizedSkincareRoutine, generateCustomRoutine, getCoachingAdvice
 */

import { getGeminiClient } from './core.service';
import {
  skincareDirectionSchema,
  personalizedRoutineSchema,
  coachingResultSchema,
} from './schemas/skincare.schemas';
import { logger } from '../../config/logger.config';
import { SkinType, AnalysisResult } from './analysis.service';

// Type definitions (will be moved to types/ later)
export interface SkincareDirection {
  summary: string;
  priorityGoals: string[];
}

export interface RoutineStep {
  step: number;
  name: string;
  productType: string;
  instructions: string;
  frequency: string;
}

export interface PersonalizedRoutine {
  morning: RoutineStep[];
  evening: RoutineStep[];
  weekly: RoutineStep[];
  tips: string[];
  warnings: string[];
}

export interface DirectionInput {
  skinType: string;
  conditions: string[];
  goals: string[];
}

export interface RoutineForCoach {
  created: boolean;
  morning: RoutineStep[];
  night: RoutineStep[];
}

export interface CoachingResult {
  coach_message: string;
  explanation: string;
  escalation: boolean;
  routine: RoutineForCoach;
  micro_education: string;
  follow_up: string;
}

/**
 * Get skincare direction based on analysis
 */
export const getSkincareDirection = async (
  analysis: AnalysisResult
): Promise<SkincareDirection> => {
  try {
    const ai = getGeminiClient();

    // Create summarized version to avoid token limit
    const analysisSummary = {
      skinType: analysis.skinType,
      overallSummary: analysis.overallSummary,
      zones: analysis.zones.map((z) => ({
        zone: z.zone,
        condition: z.condition,
        riskLevel: z.riskLevel,
        explanation: z.explanation,
      })),
      isUncertain: analysis.isUncertain,
      confidenceScore: analysis.confidenceScore,
    };

    const prompt = `
You are a dermatologist AI. Based on the following skin analysis, determine the primary skincare direction.
The user is Vietnamese. Please respond in Vietnamese.

Skin Analysis: ${JSON.stringify(analysisSummary, null, 2)}

Tasks:
1.  Analyze the 'zones' and 'overallSummary' to identify the most critical issues.
2.  Create a short, actionable summary sentence for the main skincare focus.
3.  List the top 2-3 priority goals for the user's skincare routine.

Output a single JSON object that adheres to the provided schema.
`;

    logger.info('Getting skincare direction');

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: skincareDirectionSchema,
      },
    });

    if (!response.text) {
      throw new Error('No response from Gemini');
    }

    const jsonText = response.text.trim();
    const result = JSON.parse(jsonText) as SkincareDirection;

    logger.info('Skincare direction generated successfully');
    return result;
  } catch (error) {
    logger.error('Error getting skincare direction:', error);
    throw new Error('Không thể xác định định hướng chăm sóc da. Vui lòng thử lại.');
  }
};

/**
 * Get personalized skincare routine
 */
export const getPersonalizedSkincareRoutine = async (
  direction: SkincareDirection,
  skinType: SkinType | null
): Promise<PersonalizedRoutine> => {
  try {
    const ai = getGeminiClient();

    const prompt = `
You are a dermatologist AI. Create a detailed, personalized skincare routine based on the user's skin type and priority goals.
The user is Vietnamese. Respond in Vietnamese.

- **Skin Type:** ${skinType || 'Unknown'}
- **Skincare Direction Summary:** ${direction.summary}
- **Priority Goals:** ${direction.priorityGoals.join(', ')}

Tasks:
1.  Create a simple but effective step-by-step routine for morning, evening, and weekly care.
2.  For each step, provide the step number, a clear name, a suggested product type (generic, no brands), simple instructions, and frequency.
3.  Include a list of helpful tips related to their goals (e.g., diet, hydration, sun protection).
4.  Include a list of important warnings (e.g., potential for irritation, ingredient conflicts).

Output a single JSON object that adheres to the provided schema.
`;

    logger.info('Generating personalized skincare routine');

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: personalizedRoutineSchema,
      },
    });

    if (!response.text) {
      throw new Error('No response from Gemini');
    }

    const jsonText = response.text.trim();
    const result = JSON.parse(jsonText) as PersonalizedRoutine;

    logger.info('Personalized routine generated successfully');
    return result;
  } catch (error) {
    logger.error('Error generating personalized routine:', error);
    throw new Error('Không thể tạo chu trình chăm sóc. Vui lòng thử lại.');
  }
};

/**
 * Get AI coaching advice based on analysis
 */
export const getCoachingAdvice = async (analysis: AnalysisResult): Promise<CoachingResult> => {
  try {
    const ai = getGeminiClient();

    // Create simplified analysis for coaching
    const analysisSummary = {
      skinType: analysis.skinType,
      overallSummary: analysis.overallSummary,
      zones: analysis.zones.map((z) => ({
        zone: z.zone,
        condition: z.condition,
        riskLevel: z.riskLevel,
      })),
      recommendations: analysis.recommendations,
    };

    const prompt = `
You are "DermaCoach AI". Analyze the skin condition and provide coaching advice.

Skin Analysis Summary:
${JSON.stringify(analysisSummary, null, 2)}

Provide coaching based on the analysis. Use a friendly, encouraging tone in Vietnamese.
`;

    logger.info('Getting coaching advice');

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: prompt,
      config: {
        systemInstruction: `[System Instruction – Derma Coach AI "Playful & Positive"]
You are Derma Coach AI — a cute, cheerful, slightly sassy skincare buddy for teenagers, speaking Vietnamese. 
Your tone is sweet, fun, and uplifting (like a caring Gen Z friend). 
Use gentle slang and light emojis (✨💅🥰😚). Always motivate, never judge.
You speak like a bestie who loves skincare — supportive, chill, and affirming.

⚠️ SAFETY RULES:
- Never prescribe medication or mention dosage.
- If serious symptoms appear (bleeding, ulcer, severe irritation), stay gentle but clearly advise seeing a dermatologist in your 'explanation' message.

[TASK]
Based on the skin analysis provided, you will populate the JSON output:
1️⃣ Create a 'coach_message': Greet warmly and give a small, fun compliment.
2️⃣ Create an 'explanation': Explain the skin condition positively (e.g., "Da hơi dầu xíu hoy nhưng mà glowy căng bóng như ánh mặt trời ✨").
3️⃣ Set 'escalation': Set to true if any zone risk is 'High'.
4️⃣ If 'escalation' is false: Create a simple morning & night routine (3–5 steps each) with encouraging comments inside the 'routine' object. Set 'routine.created' to true. The routine steps should be short and clear.
5️⃣ If 'escalation' is true: Do NOT create a routine. Set 'routine.created' to false and leave 'morning'/'night' arrays empty. Your 'explanation' must gently guide the user to see a dermatologist.
6️⃣ Create a 'micro_education': Add 1 cute, short, educational tip (e.g., "Tới giờ apply serum rùi! Tưởng tượng nó như một ly sinh tố cho da của bồ á 🍓").
7️⃣ Create a 'follow_up': Add a final encouraging message like "Nhắn tui sau 3 ngày để tui zô hype bồ tiếp nha ✨".

[Tone & Personality]
- Fun but respectful.
- Always encouraging.
- Short, friendly phrases.
- Make the user smile.
- ALWAYS respond in Vietnamese.

[Output JSON]
Produce a JSON object that adheres to the provided schema. Do not output anything else.`,
        responseMimeType: 'application/json',
        responseSchema: coachingResultSchema,
      },
    });

    if (!response.text) {
      throw new Error('No response from Gemini');
    }

    const jsonText = response.text.trim();
    const result = JSON.parse(jsonText) as CoachingResult;

    logger.info('Coaching advice generated successfully', {
      escalation: result.escalation,
      routineCreated: result.routine.created,
    });

    return result;
  } catch (error) {
    logger.error('Error getting coaching advice:', error);
    throw new Error('Không thể nhận lời khuyên từ AI Coach. Vui lòng thử lại.');
  }
};
