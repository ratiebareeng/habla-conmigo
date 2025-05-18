export type Topic = 'general' | 'travel' | 'restaurant' | 'shopping' | 'emergency';
export type Difficulty = 'beginner' | 'intermediate' | 'advanced';
export type Sender = 'user' | 'ai';
export type MessageType = 'text' | 'voice';

export interface Message {
  id: string;
  text: string;
  sender: Sender;
  timestamp: Date;
  type?: MessageType; // Optional for backward compatibility
  audioDuration?: number; // Duration in seconds for voice messages
  audioUrl?: string; // URL to the audio file (for actual implementation)
}

declare global {
  interface Window {
    SpeechRecognition: any; // Use 'any' or define an explicit type if available
    webkitSpeechRecognition: any; // Use 'any' or define an explicit type if available
  }
}