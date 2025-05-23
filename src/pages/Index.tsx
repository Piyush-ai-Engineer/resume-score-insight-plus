
import { useState } from 'react';
import ResumeInput from '@/components/ResumeInput';
import ResumeAnalysis from '@/components/ResumeAnalysis';
import ThemeToggle from '@/components/ThemeToggle';
import Logo from '@/components/Logo';
import { ResumeAnalysisResult, EvaluationResult } from '@/types';
import { analyzeResume } from '@/utils/resumeAnalyzer';
import { evaluateCandidate } from '@/utils/hrEvaluator';
import { toast } from 'sonner';
import { Star, FileSearch } from 'lucide-react';
import { Button } from '@/components/ui/button';
import HREvaluationModal, { JobRequirements } from '@/components/HREvaluationModal';

const Index = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<ResumeAnalysisResult | null>(null);
  const [resumeText, setResumeText] = useState<string>('');
  const [isHREvaluationOpen, setIsHREvaluationOpen] = useState(false);

  const handleAnalyzeResume = async (text: string) => {
    setResumeText(text);
    setIsAnalyzing(true);
    try {
      const result = await analyzeResume(text);
      setAnalysisResult(result);
      
      // Show appropriate toast based on score
      if (result.totalScore < 60) {
        toast.error("Your resume needs significant improvement");
      } else if (result.totalScore < 80) {
        toast.warning("Your resume shows promise but has room for improvement");
      } else {
        toast.success("Your resume is strong overall");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to analyze resume. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleEvaluateCandidate = async (requirements: JobRequirements): Promise<EvaluationResult> => {
    // Add a small delay to simulate processing
    await new Promise(resolve => setTimeout(resolve, 1200));
    return evaluateCandidate(resumeText, requirements);
  };

  return (
    <div className="page-container theme-transition">
      <header className="flex justify-between items-center mb-8">
        <Logo />
        <ThemeToggle />
      </header>
      <div className="space-y-6">
        <ResumeInput onAnalyze={handleAnalyzeResume} isLoading={isAnalyzing} />
        
        {isAnalyzing && (
          <div className="flex justify-center items-center p-12 animate-pulse">
            <div className="flex flex-col items-center gap-4">
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping"></div>
                <div className="relative flex items-center justify-center w-16 h-16 bg-primary rounded-full">
                  <Star className="text-primary-foreground" size={32} />
                </div>
              </div>
              <div className="text-xl font-medium">Analyzing your resume...</div>
            </div>
          </div>
        )}
        
        {!isAnalyzing && analysisResult && (
          <>
            <div className="flex justify-end mb-4">
              <Button 
                onClick={() => setIsHREvaluationOpen(true)}
                className="flex items-center gap-2 hover:shadow-md transition-all duration-200 shine-effect"
                disabled={!resumeText}
              >
                <FileSearch size={18} />
                Evaluate for Job Role
              </Button>
            </div>
            <ResumeAnalysis result={analysisResult} />
          </>
        )}
      </div>
      
      <HREvaluationModal 
        open={isHREvaluationOpen}
        onOpenChange={setIsHREvaluationOpen}
        resumeText={resumeText}
        onEvaluate={handleEvaluateCandidate}
      />
      
      <footer className="mt-12 text-center text-sm text-muted-foreground">
        <p>Resume Analyzer © {new Date().getFullYear()}</p>
        <p className="mt-1">Powered by AI | All data processed locally</p>
      </footer>
    </div>
  );
};

export default Index;
