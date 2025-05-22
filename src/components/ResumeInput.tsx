
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Upload } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface ResumeInputProps {
  onAnalyze: (text: string) => void;
  isLoading: boolean;
}

const ResumeInput: React.FC<ResumeInputProps> = ({ onAnalyze, isLoading }) => {
  const [resumeText, setResumeText] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setResumeText(e.target.value);
  };
  
  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!(file.type === 'application/pdf' || file.type.includes('word') || file.type === 'text/plain')) {
      toast.error('Please upload a PDF, DOCX, or TXT file');
      return;
    }

    try {
      // For PDF and DOCX, we'd normally use a dedicated library
      // For this demo, we'll handle text files only
      if (file.type === 'text/plain') {
        const text = await file.text();
        setResumeText(text);
        toast.success('Resume uploaded successfully');
      } else {
        // In a real implementation, we would use PDF.js or mammoth.js
        // For now, just show a message
        toast.info('PDF and DOCX parsing would be implemented in production');
        setResumeText(`[Content extracted from ${file.name}]`);
      }
    } catch (error) {
      toast.error('Failed to read file');
      console.error(error);
    }
  };
  
  const handleSubmit = () => {
    if (!resumeText.trim()) {
      toast.error('Please enter or upload your resume');
      return;
    }
    onAnalyze(resumeText);
  };

  return (
    <Card className="resume-card animate-in p-6">
      <h2 className="text-2xl font-bold mb-4">Upload or Paste Your Resume</h2>
      <div className="mb-4">
        <Textarea 
          placeholder="Paste your resume text here..." 
          className="min-h-[200px] resize-none mb-4"
          value={resumeText}
          onChange={handleTextChange}
        />
      </div>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={handleUploadClick}
          className="flex items-center gap-2"
        >
          <Upload size={16} />
          Upload Resume
        </Button>
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept=".pdf,.docx,.doc,.txt"
          onChange={handleFileChange}
        />
        <Button 
          type="button" 
          onClick={handleSubmit}
          disabled={!resumeText.trim() || isLoading}
        >
          {isLoading ? 'Analyzing...' : 'Analyze Resume'}
        </Button>
      </div>
    </Card>
  );
};

export default ResumeInput;
