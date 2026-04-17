import { GoogleGenAI, Type } from "@google/genai";
import { Task } from "../types";

// NOTE: In a production V2 env, this would be called via Cloud Functions.
// For this frontend-only generation, we initialize the client here.
const apiKey = process.env.GEMINI_API_KEY || ''; 
const ai = new GoogleGenAI({ apiKey });

export interface AnalysisResult {
  impactScore: number;
  effortScore: number;
  strategicTheme: string;
  rationale: string;
}

export const analyzeTaskWithGemini = async (title: string, description: string): Promise<AnalysisResult> => {
  if (!apiKey) {
    console.warn("No GEMINI_API_KEY found. Returning mock analysis.");
    return {
      impactScore: 85,
      effortScore: 4,
      strategicTheme: "Simulated Strategy",
      rationale: "API Key missing. This is a simulation."
    };
  }

  try {
    const prompt = `
      Analyze the following task for a project management system. 
      Task Title: "${title}"
      Task Description: "${description}"
      
      Output a JSON object with:
      - impactScore (0-100 integer): How critical is this?
      - effortScore (1-10 integer): How hard is this?
      - strategicTheme (string): A short category tag (e.g., Security, UI/UX, Infrastructure).
      - rationale (string): One sentence explaining the scores.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            impactScore: { type: Type.INTEGER },
            effortScore: { type: Type.INTEGER },
            strategicTheme: { type: Type.STRING },
            rationale: { type: Type.STRING }
          },
          required: ["impactScore", "effortScore", "strategicTheme", "rationale"]
        }
      }
    });

    const result = JSON.parse(response.text || '{}');
    return result as AnalysisResult;

  } catch (error) {
    console.error("Gemini Analysis Failed", error);
    return {
      impactScore: 0,
      effortScore: 0,
      strategicTheme: "Error",
      rationale: "Analysis failed due to API error."
    };
  }
};

export const smartCommandInterpreter = async (command: string): Promise<string> => {
  if (!apiKey) return "API Key missing.";
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Interpret this user command for a WorkOS: "${command}". 
      Available actions: CREATE_TASK, SEARCH, HELP, NAVIGATE. 
      Return just the action name suitable for internal routing.`,
    });
    return response.text.trim();
  } catch (e) {
    return "UNKNOWN_COMMAND";
  }
};