
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle, AlertTriangle, X } from 'lucide-react';
import { EvaluationResult } from '@/types';
import { Separator } from '@/components/ui/separator';

interface HREvaluationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  resumeText: string;
  onEvaluate: (requirements: JobRequirements) => Promise<EvaluationResult>;
}

export interface JobRequirements {
  yearsRequired: number;
  skillsRequired: string[];
  educationRequired: string;
}

const HREvaluationModal: React.FC<HREvaluationModalProps> = ({
  open,
  onOpenChange,
  resumeText,
  onEvaluate,
}) => {
  const [yearsRequired, setYearsRequired] = useState<number>(2);
  const [skillsInput, setSkillsInput] = useState<string>('');
  const [skills, setSkills] = useState<string[]>([]);
  const [educationRequired, setEducationRequired] = useState<string>('Bachelors');
  const [currentSkill, setCurrentSkill] = useState<string>('');
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [result, setResult] = useState<EvaluationResult | null>(null);

  const addSkill = () => {
    if (currentSkill && !skills.includes(currentSkill)) {
      setSkills([...skills, currentSkill]);
      setCurrentSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  const handleSkillInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentSkill(e.target.value);
  };

  const handleSkillInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && currentSkill) {
      e.preventDefault();
      addSkill();
    } else if (e.key === ',' && currentSkill) {
      e.preventDefault();
      addSkill();
    }
  };

  const handleEvaluate = async () => {
    if (!resumeText) {
      return;
    }

    setIsEvaluating(true);
    try {
      const requirements: JobRequirements = {
        yearsRequired,
        skillsRequired: skills,
        educationRequired,
      };

      const evaluationResult = await onEvaluate(requirements);
      setResult(evaluationResult);
    } catch (error) {
      console.error('Error during evaluation:', error);
    } finally {
      setIsEvaluating(false);
    }
  };

  const reset = () => {
    setResult(null);
    setSkills([]);
    setCurrentSkill('');
    setYearsRequired(2);
    setEducationRequired('Bachelors');
  };

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      if (!newOpen) reset();
      onOpenChange(newOpen);
    }}>
      <DialogContent className="sm:max-w-[550px] modern-card animate-scale">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">HR Screening Assistant</DialogTitle>
          <DialogDescription>
            Define job requirements to evaluate candidate eligibility.
          </DialogDescription>
        </DialogHeader>

        {!result ? (
          <div className="space-y-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="years-required">Years of Experience Required</Label>
                <Input 
                  id="years-required"
                  type="number" 
                  min={0}
                  value={yearsRequired}
                  onChange={(e) => setYearsRequired(Number(e.target.value))}
                  className="w-full"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="education-required">Minimum Education</Label>
                <Select 
                  value={educationRequired} 
                  onValueChange={setEducationRequired}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select education level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="High School">High School</SelectItem>
                    <SelectItem value="Associates">Associates</SelectItem>
                    <SelectItem value="Bachelors">Bachelor's</SelectItem>
                    <SelectItem value="Masters">Master's</SelectItem>
                    <SelectItem value="PhD">PhD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="skills-required">Required Skills</Label>
              <div className="flex space-x-2">
                <Input
                  id="skills-required"
                  placeholder="Enter skills (press Enter or comma to add)"
                  value={currentSkill}
                  onChange={handleSkillInputChange}
                  onKeyDown={handleSkillInputKeyDown}
                  className="flex-1"
                />
                <Button type="button" onClick={addSkill} disabled={!currentSkill}>
                  Add
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-2">
                {skills.map((skill) => (
                  <Badge key={skill} variant="secondary" className="px-3 py-1 flex items-center gap-1">
                    {skill}
                    <X 
                      size={14} 
                      className="cursor-pointer hover:text-destructive" 
                      onClick={() => removeSkill(skill)}
                    />
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4 py-4 animate-fade-in">
            <div className="flex items-center gap-2">
              {result.eligible ? (
                <CheckCircle className="text-green-500 h-6 w-6 flex-shrink-0" />
              ) : (
                <AlertCircle className="text-destructive h-6 w-6 flex-shrink-0" />
              )}
              <h3 className="text-lg font-semibold">
                {result.eligible ? "Candidate meets the criteria" : "Candidate does not meet the criteria"}
              </h3>
            </div>
            
            <Separator />
            
            <div className="space-y-3">
              <div className="insight-tile">
                <h4 className="font-medium mb-1 flex items-center gap-2">
                  <span>Experience</span>
                  {result.experienceMatch ? (
                    <CheckCircle className="text-green-500" size={16} />
                  ) : (
                    <AlertTriangle className="text-amber-500" size={16} />
                  )}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {result.experienceMatch 
                    ? `Candidate has ${result.candidateYears} years of experience (Required: ${result.requiredYears}).`
                    : `Candidate has ${result.candidateYears} years of experience, but ${result.requiredYears} were required.`
                  }
                </p>
              </div>
              
              <div className="insight-tile">
                <h4 className="font-medium mb-1 flex items-center gap-2">
                  <span>Education</span>
                  {result.educationMatch ? (
                    <CheckCircle className="text-green-500" size={16} />
                  ) : (
                    <AlertTriangle className="text-amber-500" size={16} />
                  )}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {result.educationMatch 
                    ? `Education level: ${result.candidateEducation} (Required: ${result.requiredEducation}).` 
                    : `Education level: ${result.candidateEducation}, but ${result.requiredEducation} was required.`
                  }
                </p>
              </div>
              
              <div className="insight-tile">
                <h4 className="font-medium mb-1 flex items-center gap-2">
                  <span>Skills Match</span>
                  {result.skillsMatch ? (
                    <CheckCircle className="text-green-500" size={16} />
                  ) : (
                    <AlertTriangle className="text-amber-500" size={16} />
                  )}
                </h4>
                <p className="text-sm text-muted-foreground mb-2">
                  {result.matchedSkills.length}/{result.requiredSkills.length} required skills matched.
                </p>
                
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <h5 className="text-xs font-medium mb-1">Matched Skills:</h5>
                    <div className="flex flex-wrap gap-1">
                      {result.matchedSkills.map((skill) => (
                        <Badge key={skill} variant="outline" className="bg-green-500/10 text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {result.matchedSkills.length === 0 && (
                        <span className="text-xs text-muted-foreground">None matched</span>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h5 className="text-xs font-medium mb-1">Missing Skills:</h5>
                    <div className="flex flex-wrap gap-1">
                      {result.missingSkills.map((skill) => (
                        <Badge key={skill} variant="outline" className="bg-destructive/10 text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {result.missingSkills.length === 0 && (
                        <span className="text-xs text-muted-foreground">All skills matched</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              {result.suggestions && result.suggestions.length > 0 && (
                <div className="insight-tile bg-secondary/40">
                  <h4 className="font-medium mb-2">Suggestions for Manual Review:</h4>
                  <ul className="space-y-2">
                    {result.suggestions.map((suggestion, index) => (
                      <li key={index} className="text-sm flex items-start gap-2">
                        <AlertTriangle className="text-amber-500 mt-1 flex-shrink-0" size={14} />
                        <span>{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
        
        <DialogFooter>
          {result ? (
            <Button onClick={() => setResult(null)} className="mr-auto">
              Back to Requirements
            </Button>
          ) : (
            <Button 
              onClick={handleEvaluate} 
              disabled={isEvaluating || skills.length === 0}
              className="shine-effect"
            >
              {isEvaluating ? "Evaluating..." : "Evaluate Eligibility"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default HREvaluationModal;
