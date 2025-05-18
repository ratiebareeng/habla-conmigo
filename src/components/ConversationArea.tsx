import React, { useEffect, useRef } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Message } from '../types/chat';
import MessageBubble from './MessageBubble';

interface ConversationAreaProps {
  messages: Message[];
  currentTranscript: string;
  onRetryAiSpeech?: (messageId: string) => void;
}

const ConversationArea: React.FC<ConversationAreaProps> = ({ 
  messages, 
  currentTranscript,
  onRetryAiSpeech
}) => {
  const { theme } = useTheme();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, currentTranscript]);

  return (
    <div className={`flex-grow overflow-y-auto rounded-lg p-4 mb-4 ${
      theme === 'dark' ? 'bg-slate-800' : 'bg-white bg-opacity-80 backdrop-blur-sm'
    } shadow-md`}>
      <div className="space-y-4">
        {messages.length === 0 && (
          <div className="flex justify-center items-center h-full text-gray-400 text-center p-8">
            <p>Presiona el micrófono y comienza a hablar en español para iniciar la conversación</p>
          </div>
        )}
        
        {messages.map((message) => (
          <MessageBubble 
            key={message.id} 
            message={message} 
            onRetryAiSpeech={onRetryAiSpeech && message.sender === 'ai' 
              ? () => onRetryAiSpeech(message.id) 
              : undefined
            }
          />
        ))}
        
        {currentTranscript && (
          <div className="flex justify-end">
            <div className="max-w-[80%] bg-gray-200 dark:bg-slate-700 rounded-2xl rounded-br-none px-4 py-2 text-sm md:text-base animate-pulse">
              {currentTranscript}
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default ConversationArea;