
import React from 'react';
import { ResumeAnalysisResult, ScoreBadgeType } from '@/types';
import ScoreCard from './ScoreCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

interface ResumeAnalysisProps {
  result: ResumeAnalysisResult;
}

const ResumeAnalysis: React.FC<ResumeAnalysisProps> = ({ result }) => {
  const { experience, projects, skills, education, totalScore, feedback } = result;

  const getScoreType = (score: number): ScoreBadgeType => {
    if (score < 60) return 'low';
    if (score < 80) return 'medium';
    return 'high';
  };

  const scoreType = getScoreType(totalScore);
  
  return (
    <div className="space-y-6 animate-slide-in">
      <Card className="resume-card">
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <CardTitle className="text-2xl font-bold">Resume Analysis</CardTitle>
            <div className={`score-badge score-badge-${scoreType}`}>
              {totalScore.toFixed(0)}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-lg mb-4">{feedback.overall}</p>
          
          <h3 className="text-xl font-semibold mb-2">Summary</h3>
          <div className="score-section mb-6">
            <div className="score-box">
              <span className="text-sm font-medium text-muted-foreground">Experience</span>
              <span className="text-2xl font-bold mt-1">{experience.score}</span>
            </div>
            <div className="score-box">
              <span className="text-sm font-medium text-muted-foreground">Projects</span>
              <span className="text-2xl font-bold mt-1">{projects.score}</span>
            </div>
            <div className="score-box">
              <span className="text-sm font-medium text-muted-foreground">Skills</span>
              <span className="text-2xl font-bold mt-1">{skills.score}</span>
            </div>
            <div className="score-box">
              <span className="text-sm font-medium text-muted-foreground">Education</span>
              <span className="text-2xl font-bold mt-1">{education.score}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ScoreCard 
          title="Experience" 
          score={experience.score} 
          type={getScoreType(experience.score / 0.4)}
          description={feedback.experience}
        />
        <ScoreCard 
          title="Projects" 
          score={projects.score} 
          type={getScoreType(projects.score / 0.25)}
          description={feedback.projects}
        />
        <ScoreCard 
          title="Skills" 
          score={skills.score} 
          type={getScoreType(skills.score / 0.2)}
          description={feedback.skills}
        />
        <ScoreCard 
          title="Education" 
          score={education.score} 
          type={getScoreType(education.score / 0.15)}
          description={feedback.education}
        />
      </div>

      <Card className="resume-card">
        <CardHeader>
          <CardTitle>Detailed Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="gradient-tile gradient-tile-blue">
                <h3 className="text-lg font-semibold mb-2">Experience</h3>
                <p>Years of Experience: {experience.years}</p>
              </div>
              
              <div className="gradient-tile gradient-tile-purple">
                <h3 className="text-lg font-semibold mb-2">Education</h3>
                <p>Education Level: {education.level}</p>
              </div>
              
              <div className="gradient-tile gradient-tile-green md:col-span-2">
                <h3 className="text-lg font-semibold mb-2">Notable Projects</h3>
                {projects.notable.length > 0 ? (
                  <ul className="list-disc pl-5 space-y-1">
                    {projects.notable.map((project, index) => (
                      <li key={index}>{project}</li>
                    ))}
                  </ul>
                ) : (
                  <p>No notable projects detected.</p>
                )}
              </div>
              
              <div className="gradient-tile gradient-tile-amber md:col-span-2">
                <h3 className="text-lg font-semibold mb-2">Skills</h3>
                <div className="space-y-3">
                  <div>
                    <h4 className="text-md font-medium mb-1">Technical Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {skills.technical.map((skill, index) => (
                        <Badge key={index} variant="secondary">{skill}</Badge>
                      ))}
                      {skills.technical.length === 0 && <p>No technical skills detected.</p>}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-md font-medium mb-1">Soft Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {skills.soft.map((skill, index) => (
                        <Badge key={index} variant="outline">{skill}</Badge>
                      ))}
                      {skills.soft.length === 0 && <p>No soft skills detected.</p>}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResumeAnalysis;
