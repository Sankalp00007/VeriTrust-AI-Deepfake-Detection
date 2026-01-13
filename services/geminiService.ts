
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
        probativeValue: { type: Type.STRING, description: "Low, Moderate, or High" },
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
              relevanceLevel: { type: Type.STRING },
              category: { type: Type.STRING }
            },
            required: ["title", "section", "description", "relevanceLevel", "category"]
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
      },
      required: ["probativeValue", "courtReadySummary", "forensicRedFlags", "applicableLaws"]
    }
  },
  required: [
    "fakeProbability", 
    "riskLevel", 
    "confidenceScore", 
    "reasoning", 
    "isMisinformation", 
    "originLabel", 
    "fingerprint", 
    "publishRiskScore", 
    "literacyTip", 
    "verificationHash",
    "legalAssessment"
  ]
};

export const analyzeContent = async (
  type: ContentType,
  content: string,
  mode: AnalysisMode = AnalysisMode.STANDARD,
  fileName?: string
): Promise<VerificationResult> => {
  if (!content || typeof content !== 'string') {
    throw new Error("Analysis failed: Content is missing or invalid.");
  }

  const apiKey = process.env.API_KEY;
  if (!apiKey || apiKey === "undefined") {
    throw new Error("API Key is missing. Ensure the API_KEY variable is correctly configured in your environment.");
  }

  const ai = new GoogleGenAI({ apiKey });
  const modelName = "gemini-3-flash-preview";
  
  const modeInstructions = {
    [AnalysisMode.STANDARD]: "General verification for truth and manipulation.",
    [AnalysisMode.LEGAL]: "Evidence integrity mode for Indian legal workflows.",
    [AnalysisMode.EDITORIAL]: "Editorial fact-checking and source verification.",
    [AnalysisMode.FRAUD]: "Fraud risk intelligence. Focus on scams and financial manipulation.",
    [AnalysisMode.TRUTHLENS]: `TRUTHLENS / LAWYER'S EYE: Act as a Master Forensic Investigator & Cyber Law Scholar specializing in the Indian Legal System (IT Act 2000, BNS). 
    YOU MUST:
    1. Identify specific sections of the Indian IT Act (e.g. 66C, 66D, 67A) relevant to the evidence.
    2. Provide 'investigativeIntel' including Cross-Case Pattern Intelligence.
    3. Generate a 'courtReadySummary' that a lawyer could use in a deposition.
    4. Highlight forensic red flags like pixel inconsistency, adversarial noise, or synthetic texture markers in images.`
  };

  const prompt = `
    ACT AS: Advanced Forensic & Cyber Legal Intelligence Agent for the Indian Judiciary.
    MODE: ${modeInstructions[mode] || modeInstructions[AnalysisMode.STANDARD]}
    
    ANALYSIS REQUIREMENTS:
    1. Assess probability of AI generation or manual manipulation.
    2. For IMAGES: Look for sub-pixel anomalies, JPEG compression artifacts, and GAN-specific lighting inconsistencies.
    3. For LEGAL: Citations MUST be based on the Indian Information Technology Act 2000 and the Bhartiya Nyaya Sanhita (BNS).
    
    CONTENT TYPE: ${type}
    ${type === ContentType.TEXT ? `TEXT CONTENT TO ANALYZE: "${content}"` : `MEDIA ASSET ATTACHED. ANALYZE FOR DEEPFAKE MARKERS.`}
  `;

  try {
    const contents: any = {
      parts: [
        { text: prompt }
      ]
    };

    if (type !== ContentType.TEXT) {
      let base64Data = content;
      let mimeType = type === ContentType.IMAGE ? "image/jpeg" : "video/mp4";

      if (content.includes('base64,')) {
        const parts = content.split('base64,');
        base64Data = parts[1];
        const match = parts[0].match(/data:(.*?);/);
        if (match) mimeType = match[1];
      }
      
      contents.parts.push({ 
        inlineData: { 
          mimeType: mimeType, 
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
        systemInstruction: "You are the VeriTrust AI Forensic Engine. You provide rigorous, evidence-based analysis for legal and security professionals in India. You must strictly follow the JSON schema provided and include detailed legal citations in legal modes. Do not return any text outside of the JSON."
      }
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error("The AI model returned an empty response. Verify your API key and input content.");
    }

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
    
    if (error.message?.includes("API key") || error.status === 401) {
      throw new Error("Authentication Failed: The provided Gemini API Key is invalid or has insufficient permissions.");
    }
    
    throw new Error(error.message || "Forensic engine communication failed. Please ensure your image is clear and try again.");
  }
};
