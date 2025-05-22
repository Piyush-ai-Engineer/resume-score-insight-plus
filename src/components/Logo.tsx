
import React from 'react';
import { Star } from 'lucide-react';

const Logo = () => {
  return (
    <div className="flex items-center gap-2">
      <div className="bg-gradient-to-r from-primary to-purple-600 p-2 rounded-lg shadow-md animate-pulse">
        <Star className="text-white" size={24} />
      </div>
      <div>
        <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">ResumeAI</h1>
        <p className="text-xs text-muted-foreground">Resume Analysis Tool</p>
      </div>
    </div>
  );
};

export default Logo;
