export type Topic = 'general' | 'travel' | 'restaurant' | 'shopping' | 'emergency';
export type Difficulty = 'beginner' | 'intermediate' | 'advanced';
export type Sender = 'user' | 'ai';

export interface Message {
  id: string;
  text: string;
  sender: Sender;
  timestamp: Date;
}

declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}