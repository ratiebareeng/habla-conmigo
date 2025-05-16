import React, { useState, useEffect, useRef } from 'react';
import ConversationArea from './ConversationArea';
import VoiceControls from './VoiceControls';
import TopicSelector from './TopicSelector';
import DifficultySelector from './DifficultySelector';
import { Message, Topic, Difficulty } from '../types/chat';
import { getMockResponse } from '../utils/mockAiResponses';

const VoiceChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: '¡Hola! ¿Cómo puedo ayudarte a practicar español hoy?',
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<Topic>('general');
  const [difficulty, setDifficulty] = useState<Difficulty>('beginner');
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  // Initialize speech synthesis voices
  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
    };

    loadVoices();
    
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    return () => {
      window.speechSynthesis.cancel(); // Cleanup any ongoing speech
    };
  }, []);

  // Initialize speech recognition
  useEffect(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      console.error('Speech recognition not supported');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'es-ES';
    
    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join('');
      
      setTranscript(transcript);
    };

    recognition.onend = () => {
      if (isListening) {
        recognition.start();
      }
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
    };
  }, [isListening]);

  // Handle text-to-speech
  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'es-ES';
      utterance.rate = 0.9; // Slightly slower for learning
      utterance.pitch = 1;

      // Find a Spanish voice
      const spanishVoice = voices.find(voice => 
        voice.lang.startsWith('es') && !voice.localService
      );
      
      if (spanishVoice) {
        utterance.voice = spanishVoice;
      }

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    }
  };

  // Toggle listening state
  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      if (transcript.trim()) {
        handleSendMessage();
      }
    } else {
      setTranscript('');
      recognitionRef.current?.start();
    }
    setIsListening(!isListening);
  };

  // Send user message and get AI response
  const handleSendMessage = () => {
    if (transcript.trim() === '') return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: transcript,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setTranscript('');

    // Simulate AI response with a delay
    setTimeout(() => {
      const aiResponse = getMockResponse(transcript, selectedTopic, difficulty);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);

      // Speak the AI response
      speak(aiResponse);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-200px)] md:h-[calc(100vh-220px)] max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-6">
        <TopicSelector selectedTopic={selectedTopic} onSelectTopic={setSelectedTopic} />
        <DifficultySelector difficulty={difficulty} onSelectDifficulty={setDifficulty} />
      </div>
      
      <ConversationArea 
        messages={messages} 
        currentTranscript={isListening ? transcript : ''} 
      />
      
      <VoiceControls 
        isListening={isListening} 
        isSpeaking={isSpeaking}
        onToggleListening={toggleListening}
        transcript={transcript}
        onSendMessage={handleSendMessage}
      />
    </div>
  );
};

export default VoiceChat;