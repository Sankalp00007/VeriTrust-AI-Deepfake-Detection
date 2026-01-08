
import { GoogleGenAI, Type } from "@google/genai";
import { VerificationResult, ContentType, RiskLevel, AnalysisMode } from "../types";

const RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    fakeProbability: { type: Type.NUMBER },
    riskLevel: { type: Type.STRING },
    confidenceScore: { type: Type.NUMBER },
    reasoning: { type: Type.STRING },
    flaggedRegions: { type: Type.ARRAY, items: { type: Type.STRING } },
    isMisinformation: { type: Type.BOOLEAN },
    originLabel: { type: Type.STRING },
    fraudRisk: {
      type: Type.OBJECT,
      properties: {
        isScam: { type: Type.BOOLEAN },
        patterns: { type: Type.ARRAY, items: { type: Type.STRING } },
        urgencyLevel: { type: Type.STRING }
      }
    },
    emotionalSignals: {
      type: Type.OBJECT,
      properties: {
        fear: { type: Type.NUMBER },
        anger: { type: Type.NUMBER },
        urgency: { type: Type.NUMBER },
        manipulationTactic: { type: Type.STRING }
      }
    },
    culturalContext: { type: Type.STRING },
    fingerprint: { type: Type.STRING },
    publishRiskScore: { type: Type.NUMBER },
    literacyTip: { type: Type.STRING },
    verificationHash: { type: Type.STRING },
    legalAssessment: {
      type: Type.OBJECT,
      properties: {
        probativeValue: { type: Type.STRING },
        courtReadySummary: { type: Type.STRING },
        forensicRedFlags: { type: Type.ARRAY, items: { type: Type.STRING } },
        expertRecommendation: { type: Type.STRING },
        applicableLaws: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING, description: "Official title of the Act or Law" },
              section: { type: Type.STRING, description: "Specific section or clause number" },
              description: { type: Type.STRING, description: "Brief summary of why it applies to this specific content" },
              relevanceLevel: { type: Type.STRING, description: "Direct, Supporting, or Contextual" }
            },
            required: ["title", "section", "description", "relevanceLevel"]
          }
        }
      }
    }
  },
  required: ["fakeProbability", "riskLevel", "confidenceScore", "reasoning", "isMisinformation", "originLabel", "fingerprint", "publishRiskScore", "literacyTip", "verificationHash"]
};

export const analyzeContent = async (
  type: ContentType,
  content: string,
  mode: AnalysisMode = AnalysisMode.STANDARD,
  fileName?: string
): Promise<VerificationResult> => {
  if (!content) {
    throw new Error("Analysis failed: No content provided to engine.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
  const modelName = "gemini-3-flash-preview";
  
  const modeInstructions = {
    [AnalysisMode.STANDARD]: "General verification for truth and manipulation.",
    [AnalysisMode.LEGAL]: "Evidence integrity mode for standard legal workflows. Include preliminary legal tracing.",
    [AnalysisMode.EDITORIAL]: "Pre-publication review. Focus on source credibility.",
    [AnalysisMode.FRAUD]: "Fraud risk intelligence. Focus on scams.",
    [AnalysisMode.TRUTHLENS]: "TRUTHLENS MODE: Act as a Senior Digital Forensics & Cyber Law Consultant. For the 'applicableLaws' field, identify relevant global or regional cyber laws (e.g., IT Act, GDPR, US Cyber Fraud laws, Copyright acts for deepfakes) based on the manipulation type detected."
  };

  const prompt = `
    ACT AS: Advanced Forensic & Cyber Legal Intelligence Agent.
    MODE: ${modeInstructions[mode] || modeInstructions[AnalysisMode.STANDARD]}
    
    ANALYSIS REQUIREMENTS:
    1. Assess the probability of AI generation or manual manipulation.
    2. (If LEGAL/TRUTHLENS) Map the specific manipulation pattern (e.g., impersonation, forgery, defamation via deepfake) to applicable cyber-laws and legal sections.
    3. (If TRUTHLENS) Assess probative value and recommend deeper expert review.
    
    CONTENT TYPE: ${type}
    ${type === ContentType.TEXT ? `TEXT CONTENT TO ANALYZE: "${content}"` : `IMAGE/VIDEO MEDIA DATA IS ATTACHED.`}
  `;

  try {
    const contents: any = {
      parts: [
        { text: prompt }
      ]
    };

    if (type !== ContentType.TEXT) {
      const base64Data = content.includes('base64,') ? content.split('base64,')[1] : content;
      contents.parts.push({ 
        inlineData: { 
          mimeType: type === ContentType.IMAGE ? "image/jpeg" : "video/mp4", 
          data: base64Data 
        } 
      });
    }

    const response = await ai.models.generateContent({
      model: modelName,
      contents,
      config: {
        responseMimeType: "application/json",
        responseSchema: RESPONSE_SCHEMA,
        thinkingConfig: { thinkingBudget: 15000 },
        systemInstruction: "You are the TruthLens Forensic & Cyber-Legal Engine. Provide rigorous analysis for legal professionals. For legal citations, be specific about sections and act titles. Return valid JSON only."
      }
    });

    const responseText = response.text || "{}";
    const result = JSON.parse(responseText);
    
    return {
      id: Math.random().toString(36).substring(2, 11),
      timestamp: Date.now(),
      type,
      mode,
      content: type === ContentType.TEXT ? content.substring(0, 100) : (fileName || "forensic_exhibit"),
      ...result
    };
  } catch (error: any) {
    console.error("Gemini Analysis Error:", error);
    throw new Error(error.message || "Failed to communicate with AI Forensic Engine. Verify your connection.");
  }
};
