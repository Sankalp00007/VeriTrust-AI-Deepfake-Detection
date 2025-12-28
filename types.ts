
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

export interface VerificationResult {
  id: string;
  timestamp: number;
  type: ContentType;
  content: string;
  fakeProbability: number;
  riskLevel: RiskLevel;
  confidenceScore: number;
  reasoning: string;
  flaggedRegions?: string[];
  isMisinformation: boolean;
  userEmail?: string; // For Admin view
}

export interface UserStats {
  totalVerifications: number;
  highRiskCount: number;
  history: VerificationResult[];
}

export interface UserProfile {
  id: string;
  email: string;
  role: 'user' | 'admin';
  created_at: string;
  reportCount?: number;
}
