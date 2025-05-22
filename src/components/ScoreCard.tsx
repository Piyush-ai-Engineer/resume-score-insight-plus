
import React from 'react';
import { cn } from '@/lib/utils';
import { ScoreBadgeType } from '@/types';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface ScoreCardProps {
  score: number;
  type: ScoreBadgeType;
  title: string;
  description: string;
  className?: string;
}

const ScoreCard: React.FC<ScoreCardProps> = ({
  score,
  type,
  title,
  description,
  className,
}) => {
  const [isExpanded, setIsExpanded] = React.useState(false);

  const badgeClasses = {
    low: 'score-badge-low',
    medium: 'score-badge-medium',
    high: 'score-badge-high',
  };

  const getSuggestions = () => {
    switch (title) {
      case 'Experience':
        return type === 'low' 
          ? [
              "Quantify your achievements with metrics and results",
              "Use action verbs to describe your responsibilities",
              "Include relevant industry experience, even if unpaid"
            ] 
          : type === 'medium'
          ? [
              "Highlight promotions and career progression",
              "Focus on achievements rather than just responsibilities",
              "Add more context about the company size and industry"
            ]
          : [
              "Tailor your experience to match the specific job description",
              "Consider removing outdated or less relevant positions",
              "Emphasize leadership and management experience if applicable"
            ];
      case 'Projects':
        return type === 'low' 
          ? [
              "Add more detailed project descriptions with specific technologies",
              "Highlight the problem each project solved",
              "Include links to project repositories or demos"
            ] 
          : type === 'medium'
          ? [
              "Quantify the impact of your projects with metrics",
              "Emphasize your specific role and contributions",
              "Add more complex projects that demonstrate technical depth"
            ]
          : [
              "Focus on the most impressive or relevant projects",
              "Consider organizing projects by tech stack or industry",
              "Highlight collaborative projects showing teamwork skills"
            ];
      case 'Skills':
        return type === 'low' 
          ? [
              "Add more technical skills relevant to your target role",
              "Include soft skills like communication and teamwork",
              "Organize skills by proficiency level"
            ] 
          : type === 'medium'
          ? [
              "Add more specialized or in-demand skills",
              "Balance technical and soft skills",
              "Group skills by categories (languages, frameworks, tools)"
            ]
          : [
              "Focus on the most relevant skills for your target roles",
              "Consider adding certifications to validate your skills",
              "Remove outdated or basic skills that don't add value"
            ];
      case 'Education':
        return type === 'low' 
          ? [
              "Include relevant coursework or projects",
              "Add certifications or continuing education",
              "Highlight academic achievements or honors"
            ] 
          : type === 'medium'
          ? [
              "Emphasize specific courses relevant to your target role",
              "Include extracurricular activities showing leadership",
              "Add any research or teaching assistant roles"
            ]
          : [
              "Consider placing education after experience if you're not a recent graduate",
              "Focus only on the most relevant or highest education",
              "Add ongoing educational pursuits or professional development"
            ];
      default:
        return [];
    }
  };

  const suggestions = getSuggestions();

  return (
    <div 
      className={cn(
        'resume-card p-6 cursor-pointer hover:shadow-lg transition-all duration-300',
        className
      )}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
        <h3 className="text-xl font-bold">{title}</h3>
        <div className={cn('score-badge mt-2 md:mt-0 animate-pulse', badgeClasses[type])}>
          {score.toFixed(0)}/100
        </div>
      </div>
      <p className="text-muted-foreground">{description}</p>
      
      <div className="flex items-center mt-4 text-sm text-primary">
        <span className="mr-1">{isExpanded ? 'Hide' : 'View'} improvement suggestions</span>
        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </div>
      
      {isExpanded && (
        <div className="mt-4 animate-fade-in">
          <Separator className="mb-3" />
          <h4 className="font-medium mb-2">Suggestions to improve:</h4>
          <ul className="list-disc pl-5 space-y-2">
            {suggestions.map((suggestion, index) => (
              <li key={index} className="text-sm">{suggestion}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ScoreCard;
