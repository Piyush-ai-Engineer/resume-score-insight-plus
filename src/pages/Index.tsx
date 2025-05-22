
import { useState } from 'react';
import ResumeInput from '@/components/ResumeInput';
import ResumeAnalysis from '@/components/ResumeAnalysis';
import ThemeToggle from '@/components/ThemeToggle';
import Logo from '@/components/Logo';
import { ResumeAnalysisResult } from '@/types';
import { analyzeResume } from '@/utils/resumeAnalyzer';
import { toast } from 'sonner';
import { FileText } from 'lucide-react';

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
                  <FileText className="text-primary-foreground" size={32} />
                </div>
              </div>
              <div className="text-xl font-medium">Analyzing your resume...</div>
            </div>
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
