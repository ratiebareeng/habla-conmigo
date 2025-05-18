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
  
  // Generate random heights for the bars (would be based on actual audio data in a real app)
  const generateBars = () => {
    const bars = [];
    for (let i = 0; i < numBars; i++) {
      // Create random heights with some patterns to make it look like speech
      const height = 30 + Math.sin(i * 0.5) * 25 + Math.random() * 25;
      bars.push(Math.max(15, Math.min(90, height))); // Clamp between 15% and 90%
    }
    return bars;
  };
  
  const barHeights = generateBars();
  
  // Calculate which bars should be highlighted based on progress
  const progressIndex = Math.floor((progress / 100) * numBars);
  
  return (
    <div className="flex items-center h-8 space-x-1">
      {barHeights.map((height, index) => (
        <div
          key={index}
          className={`w-1 rounded-full transition-all duration-300 ${
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