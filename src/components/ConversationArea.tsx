import React, { useEffect, useRef } from 'react';
import { Message } from '../types/chat';
import MessageBubble from './MessageBubble';
import { useTheme } from '../contexts/ThemeContext';

interface ConversationAreaProps {
  messages: Message[];
  currentTranscript: string;
}

const ConversationArea: React.FC<ConversationAreaProps> = ({ 
  messages, 
  currentTranscript 
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
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
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