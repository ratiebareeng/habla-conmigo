import { User, Volume2 } from 'lucide-react';
import React from 'react';
import { Message } from '../types/chat';
import { formatTime } from '../utils/formatters';

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isAi = message.sender === 'ai';
  
  return (
    <div className={`flex ${isAi ? 'justify-start' : 'justify-end'}`}>
      <div 
        className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm md:text-base ${
          isAi 
            ? 'bg-orange-100 text-slate-800 rounded-tl-none' 
            : 'bg-blue-600 text-white rounded-br-none'
        }`}
      >
        <div className="flex items-center mb-1">
          {isAi ? (
            <Volume2 className="w-4 h-4 mr-2" />
          ) : (
            <User className="w-4 h-4 mr-2" />
          )}
          <span className="font-medium">
            {isAi ? 'Tutor' : 'Tú'}
          </span>
        </div>
        <p>{message.text}</p>
        <span className={`text-xs ${isAi ? 'text-slate-500' : 'text-blue-100'} block text-right mt-1`}>
          {formatTime(message.timestamp)}
        </span>
      </div>
    </div>
  );
};

export default MessageBubble;
