import React from 'react';

interface WaveformProps {
  progress: number;
  isAi: boolean;
  isPlaying: boolean;
}

const VoiceWaveform: React.FC<WaveformProps> = ({ progress, isAi, isPlaying }) => {
  // Generate bars for the waveform visualization
  // Number of bars to display
  const numBars = 30;
  
  // Generate random but consistent heights for the bars
  const generateBars = () => {
    const bars = [];
    for (let i = 0; i < numBars; i++) {
      // Create pattern-based heights with some randomness to make it look like speech
      // Using sine functions with different frequencies creates a natural wave pattern
      const height = 30 + Math.sin(i * 0.5) * 25 + Math.sin(i * 0.2) * 15 + Math.random() * 15;
      bars.push(Math.max(15, Math.min(90, height))); // Clamp between 15% and 90%
    }
    return bars;
  };
  
  // We use a ref to memoize the bar heights so they don't change on re-render
  const barHeightsRef = React.useRef<number[]>(generateBars());
  
  // Calculate which bars should be highlighted based on progress
  const progressIndex = Math.floor((progress / 100) * numBars);
  
  return (
    <div className="flex items-center h-8 space-x-0.5">
      {barHeightsRef.current.map((height, index) => (
        <div
          key={index}
          className={`w-1 rounded-full transition-all duration-100 ${
            isPlaying ? 'animate-pulse' : ''
          } ${
            index <= progressIndex 
              ? isAi ? 'bg-orange-500' : 'bg-blue-300' 
              : 'bg-gray-300 dark:bg-gray-600'
          }`}
          style={{ 
            height: `${height}%`,
            animationDelay: `${index * 0.05}s`,
            animationDuration: '0.8s'
          }}
        />
      ))}
    </div>
  );
};

export default VoiceWaveform;