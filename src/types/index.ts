
export interface ResumeAnalysisResult {
  experience: {
    years: number;
    score: number;
  };
  projects: {
    notable: string[];
    score: number;
  };
  skills: {
    technical: string[];
    soft: string[];
    score: number;
  };
  education: {
    level: string;
    score: number;
  };
  totalScore: number;
  feedback: {
    type: 'low' | 'medium' | 'high';
    overall: string;
    experience: string;
    projects: string;
    skills: string;
    education: string;
  };
}

export type ScoreBadgeType = 'low' | 'medium' | 'high';

export interface EvaluationResult {
  eligible: boolean;
  experienceMatch: boolean;
  requiredYears: number;
  candidateYears: number;
  educationMatch: boolean;
  requiredEducation: string;
  candidateEducation: string;
  skillsMatch: boolean;
  requiredSkills: string[];
  matchedSkills: string[];
  missingSkills: string[];
  suggestions: string[];
}
