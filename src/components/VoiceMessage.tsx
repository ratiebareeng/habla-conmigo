import React, { useEffect, useRef, useState } from 'react';

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
  
  useEffect(() => {
    // Create audio context and element when component mounts
    if (typeof window !== 'undefined') {
      audioRef.current = new Audio();
    }
    
    // Clean up on unmount
    return () => {
      if (intervalId) clearInterval(intervalId);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);
  
  // Convert seconds to MM:SS format
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  // Handle play/pause toggle with fallback to visual simulation
  const togglePlayback = () => {
    if (isPlaying) {
      // If currently playing, stop playback
      if (intervalId) {
        clearInterval(intervalId);
        setIntervalId(null);
      }
      
      if (audioRef.current) {
        audioRef.current.pause();
      }
      
      setIsPlaying(false);
      return;
    }
    
    // Start playback
    setIsPlaying(true);
    
    // Try to use speech synthesis directly
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        // Call the parent's retry playback function which handles speech synthesis
        if (onRetryPlayback) {
          onRetryPlayback();
        }
        
        // Simulate progress with intervals for visual feedback
        // This is a fallback in case the speech synthesis doesn't properly trigger events
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
        
        // Listen for speech synthesis ending (this may not always work)
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
        
      } catch (error) {
        console.error('Error starting speech playback:', error);
        // Fall back to visual simulation
        simulatePlayback();
      }
    } else {
      // If speech synthesis is not available, simulate playback
      simulatePlayback();
    }
  };
  
  // Function to simulate audio playback with visual progress
  const simulatePlayback = () => {
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
  };
  
  // Toggle text visibility
  const toggleTextVisibility = () => {
    setShowText(!showText);
  };
  
  return (
    <div className={`max-w-[300px] p-3 rounded-lg ${
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
              simulatePlayback();
            }}
            className="ml-2 text-xs flex items-center text-orange-600"
            title="Retry speech"
          >
            <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38" />
            </svg>
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
            <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="6" y="4" width="4" height="16" />
              <rect x="14" y="4" width="4" height="16" />
            </svg>
          ) : (
            <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          )}
        </button>
        
        {/* Audio waveform visualization */}
        <div className="flex-grow h-8 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
          <div 
            className={`h-full ${isAi ? 'bg-orange-500' : 'bg-blue-500'} rounded-full transition-all duration-300 ${isPlaying ? 'animate-pulse' : ''}`}
            style={{ width: `${playbackProgress}%` }}
          ></div>
        </div>
        
        <span className="ml-3 text-xs">
          {formatTime(Math.floor(duration * playbackProgress / 100))}/{formatTime(duration)}
        </span>
      </div>
      
      <div className="flex justify-between items-center">
        <button 
          onClick={toggleTextVisibility}
          className={`text-xs flex items-center ${isAi ? 'text-orange-600' : 'text-blue-200'}`}
        >
          {showText ? 'Hide text' : 'Show text'}
          <svg 
            className="w-3 h-3 ml-1" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            {showText ? (
              <polyline points="18 15 12 9 6 15" />
            ) : (
              <polyline points="6 9 12 15 18 9" />
            )}
          </svg>
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