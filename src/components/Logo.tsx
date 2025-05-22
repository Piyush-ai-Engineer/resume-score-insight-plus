
import React from 'react';
import { FileText } from 'lucide-react';

const Logo = () => {
  return (
    <div className="flex items-center gap-2">
      <div className="bg-gradient-to-r from-primary to-blue-600 p-2 rounded-lg shadow-md animate-pulse">
        <FileText className="text-white" size={24} />
      </div>
      <div>
        <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">ResumeAI</h1>
        <p className="text-xs text-muted-foreground">Resume Analysis Tool</p>
      </div>
    </div>
  );
};

export default Logo;
