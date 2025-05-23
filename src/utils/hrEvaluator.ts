
import { EvaluationResult } from '@/types';
import { extractYearsOfExperience, extractEducationLevel, extractSkills } from '@/utils/resumeAnalyzer';

export interface JobRequirements {
  yearsRequired: number;
  skillsRequired: string[];
  educationRequired: string;
}

// Education levels in ascending order
const educationLevels = ['High School', 'Associates', 'Bachelors', 'Masters', 'PhD'];

// Function to check if candidate's education meets or exceeds the required level
const isEducationSufficient = (candidateEducation: string, requiredEducation: string): boolean => {
  const candidateIndex = educationLevels.indexOf(candidateEducation);
  const requiredIndex = educationLevels.indexOf(requiredEducation);
  
  // If either education level is not found, return false
  if (candidateIndex === -1 || requiredIndex === -1) return false;
  
  // Return true if candidate's education is at or above required level
  return candidateIndex >= requiredIndex;
};

// Function to find matching skills (basic implementation, could be enhanced with NLP)
const findMatchingSkills = (
  candidateSkills: string[], 
  requiredSkills: string[]
): { matched: string[], missing: string[] } => {
  const matched: string[] = [];
  const missing: string[] = [];
  
  // Convert all skills to lowercase for case-insensitive comparison
  const normalizedCandidateSkills = candidateSkills.map(skill => skill.toLowerCase());
  
  for (const requiredSkill of requiredSkills) {
    const normalizedRequiredSkill = requiredSkill.toLowerCase();
    
    // Check if the candidate has the required skill (simple exact match)
    if (normalizedCandidateSkills.includes(normalizedRequiredSkill)) {
      matched.push(requiredSkill);
    } else {
      // Check for partial matches (e.g. "javascript" matches "javascript programming")
      const partialMatch = normalizedCandidateSkills.some(
        skill => skill.includes(normalizedRequiredSkill) || normalizedRequiredSkill.includes(skill)
      );
      
      if (partialMatch) {
        matched.push(requiredSkill);
      } else {
        missing.push(requiredSkill);
      }
    }
  }
  
  return { matched, missing };
};

// Generate suggestions for borderline cases
const generateSuggestions = (
  candidateYears: number,
  requiredYears: number,
  candidateEducation: string,
  requiredEducation: string,
  matchedSkillsCount: number,
  requiredSkillsCount: number
): string[] => {
  const suggestions: string[] = [];
  
  // Experience is close to required
  if (candidateYears < requiredYears && candidateYears >= requiredYears * 0.75) {
    suggestions.push(
      `Candidate's experience (${candidateYears} years) is slightly below the requirement (${requiredYears} years), but may have quality experience worth considering.`
    );
  }
  
  // Education is one level below required
  const candidateEducIndex = educationLevels.indexOf(candidateEducation);
  const requiredEducIndex = educationLevels.indexOf(requiredEducation);
  
  if (candidateEducIndex !== -1 && requiredEducIndex !== -1 && 
      candidateEducIndex === requiredEducIndex - 1) {
    suggestions.push(
      `Candidate has ${candidateEducation} degree instead of ${requiredEducation}, but may have equivalent practical experience.`
    );
  }
  
  // Most but not all skills matched
  const skillMatchRate = matchedSkillsCount / requiredSkillsCount;
  if (skillMatchRate >= 0.7 && skillMatchRate < 1) {
    suggestions.push(
      `Candidate has ${matchedSkillsCount} out of ${requiredSkillsCount} required skills. Missing skills might be trainable or compensated with other strengths.`
    );
  }
  
  return suggestions;
};

export const evaluateCandidate = (resumeText: string, requirements: JobRequirements): EvaluationResult => {
  // Extract candidate information from resume
  const candidateYears = extractYearsOfExperience(resumeText);
  const candidateEducation = extractEducationLevel(resumeText);
  const { technical: techSkills, soft: softSkills } = extractSkills(resumeText);
  const candidateSkills = [...techSkills, ...softSkills];
  
  // Compare requirements with candidate's qualifications
  const experienceMatch = candidateYears >= requirements.yearsRequired;
  const educationMatch = isEducationSufficient(candidateEducation, requirements.educationRequired);
  
  const { matched: matchedSkills, missing: missingSkills } = findMatchingSkills(
    candidateSkills, 
    requirements.skillsRequired
  );
  
  const skillsMatch = missingSkills.length === 0;
  
  // Determine overall eligibility
  const eligible = experienceMatch && educationMatch && skillsMatch;
  
  // Generate suggestions for borderline cases
  const suggestions = generateSuggestions(
    candidateYears,
    requirements.yearsRequired,
    candidateEducation,
    requirements.educationRequired,
    matchedSkills.length,
    requirements.skillsRequired.length
  );
  
  return {
    eligible,
    experienceMatch,
    requiredYears: requirements.yearsRequired,
    candidateYears,
    educationMatch,
    requiredEducation: requirements.educationRequired,
    candidateEducation,
    skillsMatch,
    requiredSkills: requirements.skillsRequired,
    matchedSkills,
    missingSkills,
    suggestions
  };
};
