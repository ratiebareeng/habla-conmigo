import { ChevronDown, ChevronUp, Pause, Play, RefreshCw } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import VoiceWaveform from './VoiceWaveForm';

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
  const [intervalId, setIntervalId] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (intervalId) clearInterval(intervalId);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
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
    if (isPlaying) {
      // If currently playing, stop playback
      if (intervalId) {
        clearInterval(intervalId);
        setIntervalId(null);
      }
      
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      
      setIsPlaying(false);
      return;
    }
    
    // Start playback
    setIsPlaying(true);
    
    // Try to use speech synthesis directly
    if (onRetryPlayback) {
      onRetryPlayback();
    }
    
    // Simulate progress for visual feedback
    const interval = window.setInterval(() => {
      setPlaybackProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsPlaying(false);
          return 0;
        }
        return prev + 1;
      });
    }, duration * 10); // Speed up for demo purposes
    
    setIntervalId(interval);
    
    // Listen for speech synthesis ending
    if (window.speechSynthesis) {
      const checkSpeechEnd = window.setInterval(() => {
        if (!window.speechSynthesis.speaking) {
          clearInterval(checkSpeechEnd);
          setIsPlaying(false);
          setPlaybackProgress(0);
          if (intervalId) {
            clearInterval(intervalId);
            setIntervalId(null);
          }
        }
      }, 500);
    }
  };
  
  // Toggle text visibility
  const toggleTextVisibility = () => {
    setShowText(!showText);
  };
  
  return (
    <div className={`max-w-full p-3 rounded-lg ${
      isAi 
        ? 'bg-orange-100 text-slate-800 rounded-tl-none' 
        : 'bg-blue-600 text-white rounded-br-none'
    }`}>
      <div className="flex items-center mb-1">
        <span className="font-medium">
          {isAi ? 'Tutor' : 'Tú'}
        </span>
        
        {isAi && onRetryPlayback && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRetryPlayback();
              // Reset and start progress animation
              setPlaybackProgress(0);
              setIsPlaying(true);
              
              // Simulate progress with intervals
              const interval = window.setInterval(() => {
                setPlaybackProgress(prev => {
                  if (prev >= 100) {
                    clearInterval(interval);
                    setIsPlaying(false);
                    return 0;
                  }
                  return prev + 1;
                });
              }, duration * 10);
              
              setIntervalId(interval);
            }}
            className="ml-2 text-xs flex items-center text-orange-600"
            title="Play speech again"
          >
            <RefreshCw className="w-3 h-3 mr-1" />
            Speak
          </button>
        )}
      </div>
      
      <div className="flex items-center mb-2">
        <button 
          onClick={togglePlayback} 
          className={`p-2 rounded-full ${isAi ? 'bg-orange-400' : 'bg-blue-400'} mr-3`}
          aria-label={isPlaying ? 'Pause voice message' : 'Play voice message'}
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