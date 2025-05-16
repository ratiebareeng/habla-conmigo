import React from 'react';
import { Mic, MicOff, Send, Volume2 } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface VoiceControlsProps {
  isListening: boolean;
  isSpeaking: boolean;
  onToggleListening: () => void;
  transcript: string;
  onSendMessage: () => void;
}

const VoiceControls: React.FC<VoiceControlsProps> = ({
  isListening,
  isSpeaking,
  onToggleListening,
  transcript,
  onSendMessage
}) => {
  const { theme } = useTheme();
  
  return (
    <div className={`p-4 rounded-lg ${
      theme === 'dark' ? 'bg-slate-800' : 'bg-white bg-opacity-80 backdrop-blur-sm'
    } shadow-md flex items-center`}>
      <button
        onClick={onToggleListening}
        className={`p-4 rounded-full mr-4 transition-all duration-300 ${
          isListening 
            ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
            : 'bg-blue-500 hover:bg-blue-600'
        }`}
        aria-label={isListening ? 'Stop listening' : 'Start listening'}
      >
        {isListening ? (
          <MicOff className="w-6 h-6 text-white" />
        ) : (
          <Mic className="w-6 h-6 text-white" />
        )}
      </button>
      
      <div className="flex-grow">
        <p className={`px-4 py-2 rounded-full ${
          theme === 'dark' ? 'bg-slate-700' : 'bg-gray-100'
        } text-sm md:text-base`}>
          {transcript || (isListening ? 'Escuchando...' : 'Presiona el micrófono para hablar en español...')}
        </p>
      </div>

      {isSpeaking && (
        <div className="ml-4">
          <Volume2 className="w-6 h-6 text-green-500 animate-pulse" />
        </div>
      )}
      
      {transcript && (
        <button
          onClick={onSendMessage}
          className="p-4 ml-4 bg-orange-500 hover:bg-orange-600 rounded-full transition-colors"
          aria-label="Send message"
        >
          <Send className="w-6 h-6 text-white" />
        </button>
      )}
    </div>
  );
};

export default VoiceControls;