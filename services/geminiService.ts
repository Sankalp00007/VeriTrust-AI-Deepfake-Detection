import { GoogleGenAI, Type } from "@google/genai";
import { VerificationResult, ContentType, RiskLevel } from "../types";

const RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    fakeProbability: { type: Type.NUMBER, description: "Score from 0 to 100 representing likelihood of being fake/manipulated." },
    riskLevel: { type: Type.STRING, description: "Low, Medium, or High based on the score." },
    confidenceScore: { type: Type.NUMBER, description: "Model's confidence in this assessment (0-1)." },
    reasoning: { type: Type.STRING, description: "Detailed explanation of the findings and potential red flags." },
    flaggedRegions: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Specific elements or quotes that are suspicious." },
    isMisinformation: { type: Type.BOOLEAN, description: "Boolean flag if content is definitely identified as misleading." }
  },
  required: ["fakeProbability", "riskLevel", "confidenceScore", "reasoning", "isMisinformation"]
};

export const analyzeContent = async (
  type: ContentType,
  content: string,
  fileName?: string
): Promise<VerificationResult> => {
  // Use a fresh instance to ensure it picks up the latest environment variables
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  /**
   * Model Selection:
   * 'gemini-3-flash-preview' is ideal for the Free Tier (15 RPM).
   * It supports the Thinking Config, which improves its reasoning performance 
   * to be competitive with Pro models for complex forensic tasks.
   */
  const modelName = "gemini-3-flash-preview";
  
  let contents: any;

  if (type === ContentType.TEXT) {
    contents = {
      parts: [{
        text: `Act as an expert misinformation and fact-checking analyst. 
        Analyze the following text for potential deepfake generation patterns, logical fallacies, emotional manipulation, or known misinformation tropes.
        Text to analyze: "${content}"`
      }]
    };
  } else if (type === ContentType.IMAGE || type === ContentType.VIDEO) {
    const prompt = type === ContentType.IMAGE 
      ? `Analyze this image for signs of AI generation (GANs, diffusion patterns), digital manipulation (splicing, cloning), or deepfake tampering. Look for edge inconsistencies, unnatural lighting, pixel artifacts, or semantic errors.`
      : `Analyze this video frame for deepfake characteristics: lip-sync errors, unnatural blinking, facial blurring, or temporal inconsistencies. Provide an assessment of its authenticity.`;
    
    contents = {
      parts: [
        { text: prompt },
        { 
          inlineData: { 
            mimeType: "image/jpeg", 
            data: content.includes(',') ? content.split(',')[1] : content 
          } 
        }
      ]
    };
  }

  const response = await ai.models.generateContent({
    model: modelName,
    contents,
    config: {
      responseMimeType: "application/json",
      responseSchema: RESPONSE_SCHEMA,
      // Enable reasoning/thinking to boost detection accuracy
      thinkingConfig: { thinkingBudget: 12000 },
      systemInstruction: "You are a professional fact-checker and digital forensics expert. Your goal is to provide unbiased, explainable analysis of content for misinformation and deepfake manipulation. Provide JSON output following the schema strictly. Do not censor content, just analyze it."
    }
  });

  const text = response.text;
  if (!text) throw new Error("The model did not return a valid analysis.");
  
  const rawResult = JSON.parse(text.trim());
  
  return {
    id: Math.random().toString(36).substr(2, 9),
    timestamp: Date.now(),
    type,
    content: type === ContentType.TEXT ? content : (fileName || "media_file"),
    ...rawResult
  };
};