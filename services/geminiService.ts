
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
              title: { type: Type.STRING },
              section: { type: Type.STRING },
              description: { type: Type.STRING },
              relevanceLevel: { type: Type.STRING }
            }
          }
        },
        investigativeIntel: {
          type: Type.OBJECT,
          properties: {
            radarTrends: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  label: { type: Type.STRING },
                  count: { type: Type.STRING },
                  region: { type: Type.STRING },
                  status: { type: Type.STRING }
                }
              }
            },
            timeline: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  label: { type: Type.STRING },
                  desc: { type: Type.STRING },
                  time: { type: Type.STRING },
                  stage: { type: Type.STRING }
                }
              }
            },
            impersonationHits: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  risk: { type: Type.STRING },
                  count: { type: Type.STRING }
                }
              }
            },
            crossCaseMatch: {
              type: Type.OBJECT,
              properties: {
                similarity: { type: Type.NUMBER },
                caseReference: { type: Type.STRING },
                description: { type: Type.STRING }
              }
            },
            jurisdictionalBriefs: {
              type: Type.OBJECT,
              properties: {
                India: { type: Type.STRING }
              }
            }
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

  // Robustly handle API key access to prevent 'process is not defined' crashes
  const apiKey = (typeof process !== 'undefined' && process.env && process.env.API_KEY) ? process.env.API_KEY : "";
  const ai = new GoogleGenAI({ apiKey });
  const modelName = "gemini-3-flash-preview";
  
  const modeInstructions = {
    [AnalysisMode.STANDARD]: "General verification for truth and manipulation.",
    [AnalysisMode.LEGAL]: "Evidence integrity mode for Indian legal workflows.",
    [AnalysisMode.FRAUD]: "Fraud risk intelligence. Focus on scams in Indian context.",
    [AnalysisMode.TRUTHLENS]: `TRUTHLENS / LAWYER'S EYE: Act as a Master Forensic Investigator & Cyber Law Scholar specializing in the Indian Legal System (IT Act, BNS). 
    Generate 'investigativeIntel' with:
    1. Cross-Case Pattern Intelligence: Identify if the manipulation style, voice signature, or facial artifacts match known organized cybercrime networks.
    2. Timeline Reconstruction: Source -> Modification -> Coordinated Spread.
    3. Impersonation Tracker: Detect repeated personation of Indian officials, CEOs, or celebrities.
    4. Jurisdictional Brief: Provide a legal summary strictly based on Indian Law (Section 66C/D, etc.).`
  };

  const prompt = `
    ACT AS: Advanced Forensic & Cyber Legal Intelligence Agent for India.
    MODE: ${modeInstructions[mode] || modeInstructions[AnalysisMode.STANDARD]}
    
    ANALYSIS REQUIREMENTS:
    1. Assess probability of AI generation or manual manipulation.
    2. Map manipulation to Indian cyber-laws only (IT Act, BNS).
    3. Generate 'investigativeIntel' including Cross-Case Intelligence (finding patterns like 'Same Voice', 'Same Face', 'Same Manipulation Style').
    
    CONTENT TYPE: ${type}
    ${type === ContentType.TEXT ? `TEXT CONTENT: "${content}"` : `MEDIA DATA ATTACHED.`}
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
        thinkingConfig: { thinkingBudget: 0 },
        systemInstruction: "You are the VeriTrust Lawyer's Eye Forensic Engine. Provide rigorous investigative metadata focused on India. Identify organized crime patterns. Return valid JSON only."
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
    throw new Error(error.message || "Failed to communicate with AI Forensic Engine.");
  }
};
