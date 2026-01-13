
export enum RiskLevel {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High'
}

export enum ContentType {
  TEXT = 'text',
  IMAGE = 'image',
  VIDEO = 'video'
}

export enum AnalysisMode {
  STANDARD = 'standard',
  LEGAL = 'legal',
  EDITORIAL = 'editorial',
  FRAUD = 'fraud',
  TRUTHLENS = 'truthlens'
}

export interface ApplicableLaw {
  title: string;
  section: string;
  description: string;
  relevanceLevel: 'Direct' | 'Supporting' | 'Contextual';
  category: 'Fraud' | 'Privacy' | 'Defamation' | 'Identity' | 'Copyright' | 'Evidence';
}

export interface LawyerProfile {
  id: string;
  name: string;
  specialization: string;
  experience: string;
  location: string;
  image: string;
  verified: boolean;
  activeNow: boolean;
  matchingStatutes: string[];
}

export interface InvestigativeIntelligence {
  radarTrends: Array<{ label: string; count: string; region: string; status: 'Monitor' | 'Alert' | 'Critical' }>;
  timeline: Array<{ label: string; desc: string; time: string; stage: 'Authentic' | 'Manipulated' | 'Coordinated' }>;
  impersonationHits: Array<{ name: string; risk: string; count: string }>;
  crossCaseMatch?: {
    similarity: number;
    caseReference: string;
    description: string;
  };
  jurisdictionalBriefs: {
    [key: string]: string;
  };
}

export interface VerificationResult {
  id: string;
  timestamp: number;
  type: ContentType;
  mode: AnalysisMode;
  content: string;
  fakeProbability: number;
  riskLevel: RiskLevel;
  confidenceScore: number;
  reasoning: string;
  flaggedRegions?: string[];
  isMisinformation: boolean;
  
  // Advanced Features
  originLabel: 'Human-Created' | 'AI-Generated' | 'Mixed/Modified';
  fraudRisk?: {
    isScam: boolean;
    patterns: string[];
    urgencyLevel: 'Low' | 'Medium' | 'High';
  };
  emotionalSignals?: {
    fear: number;
    anger: number;
    urgency: number;
    manipulationTactic: string;
  };
  culturalContext?: string;
  fingerprint: string;
  publishRiskScore: number;
  literacyTip: string;
  verificationHash: string;
  userEmail?: string;
  
  // Lawyer's Eye / TruthLens Specifics
  legalAssessment?: {
    probativeValue: 'Low' | 'Moderate' | 'High';
    courtReadySummary: string;
    forensicRedFlags: string[];
    expertRecommendation: string;
    applicableLaws: ApplicableLaw[];
    investigativeIntel?: InvestigativeIntelligence;
  };
}

export interface UserStats {
  totalVerifications: number;
  highRiskCount: number;
  history: VerificationResult[];
}

export interface UserProfile {
  id: string;
  email: string;
  role: 'user' | 'lawyer';
  created_at: string;
  reportCount?: number;
}
