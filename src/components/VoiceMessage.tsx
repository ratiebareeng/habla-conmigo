import { ChevronDown, ChevronUp, Pause, Play, RefreshCw, Volume2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import VoiceWaveform from './VoiceWaveForm'; // Ensure this file exists or create a placeholder component

interface VoiceMessageProps {
  text: string;
  duration: number;
  isAi: boolean;
  onRetryPlayback?: () => void;
}

const VoiceMessage: React.FC<VoiceMessageProps> = ({ text, duration, isAi, onRetryPlayback }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showText, setShowText] = useState(false);
  const [playbackProgress, setPlaybackProgress] = useState(0);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
  
  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [intervalId]);
  
  // Convert seconds to MM:SS format
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  // Handle play/pause toggle
  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
    
    // If currently playing, clear the interval
    if (isPlaying && intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
      return;
    }
    
    // Otherwise start playback simulation
    const interval = setInterval(() => {
      setPlaybackProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsPlaying(false);
          setIntervalId(null);
          return 0;
        }
        return prev + 1;
      });
    }, duration * 10); // Speed up for demo purposes
    
    setIntervalId(interval);
  };
  
  // Toggle text visibility
  const toggleTextVisibility = () => {
    setShowText(!showText);
  };
  
  return (
    <div className={`max-w-full p-3 rounded-lg ${
      isAi 
        ? 'bg-orange-100 text-slate-800' 
        : 'bg-blue-600 text-white'
    }`}>
      <div className="flex items-center mb-1">
        {isAi ? (
          <Volume2 className="w-4 h-4 mr-2" />
        ) : (
          <div className="w-4 h-4 mr-2" />
        )}
        <span className="font-medium">
          {isAi ? 'Tutor' : 'Tú'}
        </span>
      </div>
      
      <div className="flex items-center mb-2">
        <button 
          onClick={togglePlayback} 
          className={`p-2 rounded-full ${isAi ? 'bg-orange-400' : 'bg-blue-400'} mr-3`}
        >
          {isPlaying ? (
            <Pause className="w-4 h-4 text-white" />
          ) : (
            <Play className="w-4 h-4 text-white" />
          )}
        </button>
        
        {/* Audio waveform visualization */}
        <div className="flex-grow">
          <VoiceWaveform 
            progress={playbackProgress} 
            isAi={isAi} 
            isPlaying={isPlaying} 
          />
        </div>
        
        <span className="ml-3 text-xs">
          {formatTime(Math.floor(duration * playbackProgress / 100))} / {formatTime(duration)}
        </span>
      </div>
      
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <button 
            onClick={toggleTextVisibility}
            className={`text-xs flex items-center ${isAi ? 'text-orange-600' : 'text-blue-200'}`}
          >
            {showText ? 'Hide text' : 'Show text'}
            {showText ? (
              <ChevronUp className="w-3 h-3 ml-1" />
            ) : (
              <ChevronDown className="w-3 h-3 ml-1" />
            )}
          </button>
          
          {isAi && onRetryPlayback && (
            <button
              onClick={onRetryPlayback}
              className="text-xs flex items-center text-orange-600 ml-3"
              title="Retry speech"
            >
              <RefreshCw className="w-3 h-3 mr-1" />
              Speak again
            </button>
          )}
        </div>
        
        <span className={`text-xs ${isAi ? 'text-slate-500' : 'text-blue-100'}`}>
          {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
      
      {showText && (
        <div className={`mt-3 pt-3 border-t ${isAi ? 'border-orange-200' : 'border-blue-500'}`}>
          <p>{text}</p>
        </div>
      )}
    </div>
  );
};

export default VoiceMessage;