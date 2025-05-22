
import { ResumeAnalysisResult } from '@/types';
import { pipeline } from '@huggingface/transformers';

// Mock NLP processing for demo
// In a real application, we would use proper NLP models
export const analyzeResume = async (text: string): Promise<ResumeAnalysisResult> => {
  try {
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Basic text analysis
    const lowercaseText = text.toLowerCase();
    
    // Extract years of experience (simple pattern matching)
    const yearsOfExperience = extractYearsOfExperience(text);
    const experienceScore = calculateExperienceScore(yearsOfExperience);
    
    // Extract projects
    const projects = extractProjects(text);
    const projectsScore = calculateProjectsScore(projects);
    
    // Extract skills
    const { technical, soft } = extractSkills(text);
    const skillsScore = calculateSkillsScore(technical, soft);
    
    // Extract education
    const educationLevel = extractEducationLevel(text);
    const educationScore = calculateEducationScore(educationLevel);
    
    // Calculate total score
    const totalScore = experienceScore + projectsScore + skillsScore + educationScore;
    
    // Generate feedback
    const feedback = generateFeedback(
      totalScore,
      experienceScore,
      projectsScore,
      skillsScore,
      educationScore,
      yearsOfExperience,
      projects,
      { technical, soft },
      educationLevel
    );
    
    return {
      experience: {
        years: yearsOfExperience,
        score: experienceScore
      },
      projects: {
        notable: projects,
        score: projectsScore
      },
      skills: {
        technical,
        soft,
        score: skillsScore
      },
      education: {
        level: educationLevel,
        score: educationScore
      },
      totalScore,
      feedback
    };
  } catch (error) {
    console.error('Error analyzing resume:', error);
    throw new Error('Failed to analyze resume');
  }
};

// Helper functions

function extractYearsOfExperience(text: string): number {
  // Basic regex to find patterns like "X years of experience" or "X+ years"
  const experiencePatterns = [
    /(\d+)(?:\+)?\s*(?:years|yrs)(?:\s+of)?\s+(?:experience|work)/i,
    /experience(?:\s+of)?\s+(\d+)(?:\+)?\s*(?:years|yrs)/i,
    /worked\s+(?:for\s+)?(\d+)(?:\+)?\s*(?:years|yrs)/i
  ];
  
  for (const pattern of experiencePatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      return parseInt(match[1], 10);
    }
  }
  
  // If no explicit mention, try to estimate from dates
  const years = estimateExperienceFromDates(text);
  return years > 0 ? years : 1; // Default to 1 if we can't detect
}

function estimateExperienceFromDates(text: string): number {
  const dateRanges = [];
  const datePattern = /(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|January|February|March|April|May|June|July|August|September|October|November|December)[a-z]*\.?\s+\d{4}\s*(?:-|–|to)\s*(?:(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|January|February|March|April|May|June|July|August|September|October|November|December)[a-z]*\.?\s+\d{4}|Present|Current)/gi;
  
  const matches = text.match(datePattern);
  
  if (!matches) return 0;
  
  let totalYears = 0;
  const currentYear = new Date().getFullYear();
  
  matches.forEach(match => {
    const parts = match.split(/\s*(?:-|–|to)\s*/i);
    if (parts.length === 2) {
      const startMatch = parts[0].match(/\d{4}/);
      const endMatch = parts[1].match(/\d{4}/);
      
      let startYear = startMatch ? parseInt(startMatch[0], 10) : 0;
      let endYear = endMatch ? parseInt(endMatch[0], 10) : 0;
      
      if (parts[1].toLowerCase().includes('present') || parts[1].toLowerCase().includes('current')) {
        endYear = currentYear;
      }
      
      if (startYear && endYear) {
        totalYears += (endYear - startYear);
      }
    }
  });
  
  return totalYears;
}

function extractProjects(text: string): string[] {
  // Look for project-related keywords followed by descriptions
  const projectKeywords = ['project', 'developed', 'created', 'built', 'implemented', 'architected', 'designed'];
  
  // Simplistic approach: look for sentences containing project keywords
  const sentences = text.split(/[.!?]+/).map(s => s.trim()).filter(s => s);
  
  const projects = sentences.filter(sentence => 
    projectKeywords.some(keyword => 
      sentence.toLowerCase().includes(keyword.toLowerCase())
    )
  );
  
  // Limit to 5 most significant projects (simulating NLP importance extraction)
  return projects.slice(0, 5);
}

function extractSkills(text: string): { technical: string[], soft: string[] } {
  // Common technical skills
  const technicalSkillsKeywords = [
    'javascript', 'python', 'java', 'c++', 'c#', 'ruby', 'php', 'typescript',
    'html', 'css', 'react', 'angular', 'vue', 'node', 'express', 'django', 'flask',
    'mongodb', 'postgresql', 'mysql', 'sql', 'nosql', 'aws', 'azure', 'gcp',
    'docker', 'kubernetes', 'ci/cd', 'git', 'agile', 'scrum', 'rest api',
    'graphql', 'machine learning', 'artificial intelligence', 'data science',
    'react native', 'flutter', 'swift', 'kotlin', 'ios', 'android'
  ];

  // Common soft skills
  const softSkillsKeywords = [
    'communication', 'teamwork', 'problem solving', 'problem-solving',
    'leadership', 'time management', 'creativity', 'adaptability', 'flexibility',
    'critical thinking', 'interpersonal', 'collaboration', 'organization',
    'presentation', 'negotiation', 'conflict resolution', 'decision making',
    'emotional intelligence', 'empathy', 'attention to detail', 'multitasking'
  ];

  const technical = [];
  const soft = [];
  const lowercaseText = text.toLowerCase();
  
  for (const skill of technicalSkillsKeywords) {
    if (lowercaseText.includes(skill)) {
      technical.push(skill);
    }
  }
  
  for (const skill of softSkillsKeywords) {
    if (lowercaseText.includes(skill)) {
      soft.push(skill);
    }
  }
  
  return { technical, soft };
}

function extractEducationLevel(text: string): string {
  const educationPatterns = {
    'PhD': /(ph\.?d|doctor of philosophy|doctoral)/i,
    'Masters': /(master'?s|mba|m\.s\.|m\.eng|master of)/i,
    'Bachelors': /(bachelor'?s|b\.s\.|b\.a\.|bachelor of)/i,
    'Associates': /(associate'?s|a\.s\.|a\.a\.|associate of)/i,
    'High School': /(high school|secondary school|diploma|ged)/i
  };
  
  const lowercaseText = text.toLowerCase();
  
  for (const [level, pattern] of Object.entries(educationPatterns)) {
    if (pattern.test(lowercaseText)) {
      return level;
    }
  }
  
  return 'Not Specified';
}

function calculateExperienceScore(years: number): number {
  // Experience is 40% of total score
  if (years >= 10) return 40;
  if (years >= 7) return 35;
  if (years >= 5) return 30;
  if (years >= 3) return 25;
  if (years >= 2) return 20;
  if (years >= 1) return 15;
  return 10;
}

function calculateProjectsScore(projects: string[]): number {
  // Projects are 25% of total score
  const projectCount = projects.length;
  
  if (projectCount >= 5) return 25;
  if (projectCount >= 4) return 20;
  if (projectCount >= 3) return 15;
  if (projectCount >= 2) return 10;
  if (projectCount >= 1) return 5;
  return 0;
}

function calculateSkillsScore(technical: string[], soft: string[]): number {
  // Skills are 20% of total score
  // Technical skills are weighted more than soft skills
  const technicalScore = Math.min(15, technical.length * 1.5);
  const softScore = Math.min(5, soft.length);
  
  return technicalScore + softScore;
}

function calculateEducationScore(level: string): number {
  // Education is 15% of total score
  switch (level) {
    case 'PhD': return 15;
    case 'Masters': return 13;
    case 'Bachelors': return 10;
    case 'Associates': return 7;
    case 'High School': return 5;
    default: return 3;
  }
}

function generateFeedback(
  totalScore: number,
  experienceScore: number, 
  projectsScore: number,
  skillsScore: number,
  educationScore: number,
  years: number,
  projects: string[],
  skills: { technical: string[], soft: string[] },
  education: string
): ResumeAnalysisResult['feedback'] {
  let type: 'low' | 'medium' | 'high' = 'low';
  let overall = '';
  let experienceFeedback = '';
  let projectsFeedback = '';
  let skillsFeedback = '';
  let educationFeedback = '';
  
  // Determine score category
  if (totalScore >= 80) {
    type = 'high';
  } else if (totalScore >= 60) {
    type = 'medium';
  }
  
  // Generate overall feedback
  if (type === 'low') {
    overall = 'Your resume needs significant improvements to stand out to employers. Focus on the specific suggestions below to strengthen your application.';
  } else if (type === 'medium') {
    overall = 'Your resume shows promise but has room for improvement. The suggestions below will help you create a stronger application.';
  } else {
    overall = 'Your resume is strong overall. Consider the minor suggestions below for further refinement, especially when targeting specific roles.';
  }
  
  // Experience feedback
  const expMax = 40;
  if (experienceScore < expMax * 0.6) {
    experienceFeedback = `Your ${years} year(s) of experience appears limited. Try to highlight relevant internships, freelance work, or volunteering to strengthen this section.`;
  } else if (experienceScore < expMax * 0.8) {
    experienceFeedback = `With ${years} year(s) of experience, try quantifying your accomplishments and highlighting specific achievements at each position.`;
  } else {
    experienceFeedback = `Your ${years} year(s) of experience is impressive. Consider tailoring it more specifically to your target roles.`;
  }
  
  // Projects feedback
  const projMax = 25;
  if (projectsScore < projMax * 0.6) {
    projectsFeedback = `Your resume lacks detailed project descriptions. Add more significant projects with technologies used and your specific contributions.`;
  } else if (projectsScore < projMax * 0.8) {
    projectsFeedback = `Your projects section is good but could include more metrics and outcomes. Quantify the impact of your work where possible.`;
  } else {
    projectsFeedback = `Your projects section is strong. Consider organizing them to highlight the most relevant ones for specific job applications.`;
  }
  
  // Skills feedback
  const skillMax = 20;
  if (skillsScore < skillMax * 0.6) {
    skillsFeedback = `Your resume needs more skills, particularly technical ones relevant to your field. Also consider adding soft skills that employers value.`;
  } else if (skillsScore < skillMax * 0.8) {
    skillsFeedback = `Your skills section is decent but could be more comprehensive. Group them by category and ensure they align with job requirements.`;
  } else {
    skillsFeedback = `Your skills section is comprehensive. Consider organizing them by proficiency level or relevance to your target roles.`;
  }
  
  // Education feedback
  const eduMax = 15;
  if (educationScore < eduMax * 0.6) {
    educationFeedback = `Your education section could be strengthened. Include relevant courses, academic achievements, or certifications.`;
  } else if (educationScore < eduMax * 0.8) {
    educationFeedback = `Your education credentials are good. Consider adding relevant coursework or academic projects if applicable.`;
  } else {
    educationFeedback = `Your education section is strong. Ensure it's properly positioned in your resume based on your career stage.`;
  }
  
  return {
    type,
    overall,
    experience: experienceFeedback,
    projects: projectsFeedback,
    skills: skillsFeedback,
    education: educationFeedback
  };
}
