
import React from 'react';
import { cn } from '@/lib/utils';
import { ScoreBadgeType } from '@/types';

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
  const badgeClasses = {
    low: 'score-badge-low',
    medium: 'score-badge-medium',
    high: 'score-badge-high',
  };

  return (
    <div className={cn('resume-card p-6', className)}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
        <h3 className="text-xl font-bold">{title}</h3>
        <div className={cn('score-badge mt-2 md:mt-0', badgeClasses[type])}>
          {score.toFixed(0)}/100
        </div>
      </div>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};

export default ScoreCard;
