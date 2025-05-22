
import { useState } from 'react';
import ResumeInput from '@/components/ResumeInput';
import ResumeAnalysis from '@/components/ResumeAnalysis';
import ThemeToggle from '@/components/ThemeToggle';
import { ResumeAnalysisResult } from '@/types';
import { analyzeResume } from '@/utils/resumeAnalyzer';
import { toast } from 'sonner';

const Index = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<ResumeAnalysisResult | null>(null);

  const handleAnalyzeResume = async (text: string) => {
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

  return (
    <div className="page-container theme-transition">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Resume Analyzer</h1>
        <ThemeToggle />
      </header>
      <div className="space-y-6">
        <ResumeInput onAnalyze={handleAnalyzeResume} isLoading={isAnalyzing} />
        
        {isAnalyzing && (
          <div className="flex justify-center items-center p-12">
            <div className="animate-pulse text-xl">Analyzing your resume...</div>
          </div>
        )}
        
        {!isAnalyzing && analysisResult && (
          <ResumeAnalysis result={analysisResult} />
        )}
      </div>
      
      <footer className="mt-12 text-center text-sm text-muted-foreground">
        <p>Resume Analyzer © {new Date().getFullYear()}</p>
        <p className="mt-1">Powered by AI | All data processed locally</p>
      </footer>
    </div>
  );
};

export default Index;
