
import { GoogleGenAI, Type } from "@google/genai";
import { VerificationResult, ContentType, RiskLevel } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

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
  // Using gemini-3-flash-preview as recommended for basic/intermediate text and multimodal tasks
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
        { inlineData: { mimeType: "image/jpeg", data: content.split(',')[1] } }
      ]
    };
  }

  const response = await ai.models.generateContent({
    model: modelName,
    contents,
    config: {
      responseMimeType: "application/json",
      responseSchema: RESPONSE_SCHEMA,
      systemInstruction: "You are a professional fact-checker and digital forensics expert. Your goal is to provide unbiased, explainable analysis of content for misinformation and deepfake manipulation. Provide JSON output following the schema strictly. Do not censor content, just analyze it."
    }
  });

  const rawResult = JSON.parse(response.text || "{}");
  
  return {
    id: Math.random().toString(36).substr(2, 9),
    timestamp: Date.now(),
    type,
    content: type === ContentType.TEXT ? content : (fileName || "media_file"),
    ...rawResult
  };
};
