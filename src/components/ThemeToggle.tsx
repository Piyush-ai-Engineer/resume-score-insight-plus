
import { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';
import { cn } from '@/lib/utils';

const ThemeToggle = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check if user has a theme preference in localStorage
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
    
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        "p-2 rounded-full transition-colors duration-300",
        isDarkMode ? "bg-secondary text-secondary-foreground" : "bg-secondary text-secondary-foreground"
      )}
      aria-label="Toggle theme"
    >
      {isDarkMode ? (
        <Sun size={20} className="text-yellow-500" />
      ) : (
        <Moon size={20} className="text-blue-700" />
      )}
    </button>
  );
};

export default ThemeToggle;
