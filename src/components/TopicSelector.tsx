import React from 'react';
import { Topic } from '../types/chat';
import { useTheme } from '../contexts/ThemeContext';

interface TopicSelectorProps {
  selectedTopic: Topic;
  onSelectTopic: (topic: Topic) => void;
}

const topics: { value: Topic; label: string; description: string }[] = [
  { value: 'general', label: 'General', description: 'Basic conversation practice' },
  { value: 'travel', label: 'Travel', description: 'Asking for directions, booking hotels' },
  { value: 'restaurant', label: 'Restaurant', description: 'Ordering food, making reservations' },
  { value: 'shopping', label: 'Shopping', description: 'Buying clothes, asking about prices' },
  { value: 'emergency', label: 'Emergency', description: 'Getting help, medical situations' }
];

const TopicSelector: React.FC<TopicSelectorProps> = ({ selectedTopic, onSelectTopic }) => {
  const { theme } = useTheme();
  
  return (
    <div className="w-full md:w-1/2">
      <label htmlFor="topic-selector" className="block text-sm font-medium mb-2">
        Conversation Topic
      </label>
      <select
        id="topic-selector"
        value={selectedTopic}
        onChange={(e) => onSelectTopic(e.target.value as Topic)}
        className={`w-full rounded-lg px-4 py-2 border focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
          theme === 'dark' 
            ? 'bg-slate-700 border-slate-600 text-white' 
            : 'bg-white border-gray-300'
        }`}
      >
        {topics.map((topic) => (
          <option key={topic.value} value={topic.value}>
            {topic.label} - {topic.description}
          </option>
        ))}
      </select>
    </div>
  );
};

export default TopicSelector;