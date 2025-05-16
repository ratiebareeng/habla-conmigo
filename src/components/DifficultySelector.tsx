import React from 'react';
import { Difficulty } from '../types/chat';
import { useTheme } from '../contexts/ThemeContext';

interface DifficultySelectorProps {
  difficulty: Difficulty;
  onSelectDifficulty: (difficulty: Difficulty) => void;
}

const difficulties: { value: Difficulty; label: string }[] = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
];

const DifficultySelector: React.FC<DifficultySelectorProps> = ({ 
  difficulty, 
  onSelectDifficulty 
}) => {
  const { theme } = useTheme();
  
  return (
    <div className="w-full md:w-1/2">
      <label htmlFor="difficulty-selector" className="block text-sm font-medium mb-2">
        Difficulty Level
      </label>
      <div className="grid grid-cols-3 gap-2">
        {difficulties.map((level) => (
          <button
            key={level.value}
            onClick={() => onSelectDifficulty(level.value)}
            className={`py-2 rounded-lg transition-colors ${
              difficulty === level.value
                ? 'bg-orange-500 text-white'
                : theme === 'dark'
                  ? 'bg-slate-700 hover:bg-slate-600 text-white'
                  : 'bg-white hover:bg-gray-100 border border-gray-300'
            }`}
          >
            {level.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default DifficultySelector;