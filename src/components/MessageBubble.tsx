import { User, Volume2 } from 'lucide-react';
import React from 'react';
import { Message } from '../types/chat';
import { formatTime } from '../utils/formatters';
import VoiceMessage from './VoiceMessage';

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isAi = message.sender === 'ai';
  
  // For demo purposes, all AI messages are treated as voice messages
  // In a real app, you'd have a flag in the message object to distinguish between text and voice
  const isVoiceMessage = isAi;
  
  // Calculate a mock duration based on message length (just for demo)
  const estimatedDuration = Math.max(5, Math.floor(message.text.length / 10));
  
  if (isVoiceMessage) {
    return (
      <div className={`flex ${isAi ? 'justify-start' : 'justify-end'} mb-4`}>
        <VoiceMessage
          text={message.text}
          duration={estimatedDuration}
          isAi={isAi}
        />
      </div>
    );
  }
  
  // Regular text message bubble (for user messages)
  return (
    <div className={`flex ${isAi ? 'justify-start' : 'justify-end'} mb-4`}>
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