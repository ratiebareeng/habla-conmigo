import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Sun, Moon, Menu, X, Languages } from 'lucide-react';

const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className={`py-4 px-6 ${
      theme === 'dark' ? 'bg-slate-800' : 'bg-white bg-opacity-90 backdrop-blur-sm'
    } shadow-md sticky top-0 z-50`}>
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Languages className="w-8 h-8 text-orange-500" />
          <span className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
            HablaConmigo
          </span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <a href="#" className="hover:text-orange-500 transition-colors font-medium">Home</a>
          <a href="#" className="hover:text-orange-500 transition-colors font-medium">Topics</a>
          <a href="#" className="hover:text-orange-500 transition-colors font-medium">Progress</a>
          <a href="#" className="hover:text-orange-500 transition-colors font-medium">About</a>
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Navigation Button */}
        <button 
          className="md:hidden p-2 rounded-md hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className={`md:hidden absolute top-full left-0 right-0 ${
          theme === 'dark' ? 'bg-slate-800' : 'bg-white'
        } shadow-md`}>
          <div className="container mx-auto py-4 flex flex-col space-y-4 px-6">
            <a href="#" className="hover:text-orange-500 transition-colors py-2 font-medium">Home</a>
            <a href="#" className="hover:text-orange-500 transition-colors py-2 font-medium">Topics</a>
            <a href="#" className="hover:text-orange-500 transition-colors py-2 font-medium">Progress</a>
            <a href="#" className="hover:text-orange-500 transition-colors py-2 font-medium">About</a>
            <button 
              onClick={toggleTheme}
              className="flex items-center space-x-2 py-2"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-5 h-5" />
                  <span>Light Mode</span>
                </>
              ) : (
                <>
                  <Moon className="w-5 h-5" />
                  <span>Dark Mode</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;