import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Heart } from 'lucide-react';

const Footer: React.FC = () => {
  const { theme } = useTheme();
  
  return (
    <footer className={`py-6 px-6 ${
      theme === 'dark' ? 'bg-slate-800' : 'bg-white bg-opacity-80 backdrop-blur-sm'
    }`}>
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm mb-4 md:mb-0">
            © 2025 HablaConmigo. All rights reserved.
          </div>
          <div className="flex items-center text-sm">
            Made with <Heart className="w-4 h-4 mx-1 text-red-500 inline" /> for language learners
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;