import { Mic, MicOff, Send, SkipForward, Volume2 } from 'lucide-react';
import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

interface VoiceControlsProps {
  isListening: boolean;
  isSpeaking: boolean;
  onToggleListening: () => void;
  transcript: string;
  onSendMessage: () => void;
  onSkipAiSpeaking?: () => void;
}

const VoiceControls: React.FC<VoiceControlsProps> = ({
  isListening,
  isSpeaking,
  onToggleListening,
  transcript,
  onSendMessage,
  onSkipAiSpeaking
}) => {
  const { theme } = useTheme();
  
  return (
    <div className={`p-4 rounded-lg ${
      theme === 'dark' ? 'bg-slate-800' : 'bg-white bg-opacity-80 backdrop-blur-sm'
    } shadow-md flex flex-col md:flex-row items-center`}>
      <div className="flex items-center justify-center w-full md:w-auto mb-4 md:mb-0">
        <button
          onClick={onToggleListening}
          className={`p-6 rounded-full mx-4 transition-all duration-300 ${
            isListening 
              ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
              : 'bg-blue-500 hover:bg-blue-600'
          }`}
          aria-label={isListening ? 'Stop listening' : 'Start listening'}
        >
          {isListening ? (
            <MicOff className="w-8 h-8 text-white" />
          ) : (
            <Mic className="w-8 h-8 text-white" />
          )}
        </button>
        
        {isSpeaking && (
          <button 
            onClick={onSkipAiSpeaking}
            className="p-4 bg-green-500 hover:bg-green-600 rounded-full transition-colors flex items-center"
            aria-label="Skip AI speaking"
          >
            <Volume2 className="w-6 h-6 text-white mr-2" />
            <SkipForward className="w-5 h-5 text-white" />
          </button>
        )}
      </div>
      
      <div className="flex-grow w-full md:w-auto">
        <div className={`px-4 py-3 rounded-full ${
          theme === 'dark' ? 'bg-slate-700' : 'bg-gray-100'
        } text-sm md:text-base min-h-12 flex items-center justify-between`}>
          <p className="flex-grow">
            {transcript || (isListening 
              ? <span className="text-green-500 font-medium">Escuchando... Habla en español</span> 
              : <span className="text-gray-500">Presiona el micrófono para hablar</span>)}
          </p>
          
          {transcript && (
            <button
              onClick={onSendMessage}
              className="ml-2 p-2 bg-orange-500 hover:bg-orange-600 rounded-full transition-colors"
              aria-label="Send message"
            >
              <Send className="w-5 h-5 text-white" />
            </button>
          )}
        </div>
        
        {isListening && (
          <div className="mt-2 text-xs text-center">
            <div className="flex justify-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <div 
                  key={i} 
                  className="w-1 h-3 bg-blue-500 rounded-full animate-pulse" 
                  style={{ 
                    animationDelay: `${i * 0.1}s`,
                    animationDuration: '0.8s' 
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VoiceControls;
