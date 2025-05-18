import React, { useEffect, useRef, useState } from 'react';
import { Difficulty, Message, Topic } from '../types/chat';
import type { SpeechRecognition, SpeechRecognitionErrorEvent, SpeechRecognitionEvent } from '../types/speech-types';
import { getMockResponse } from '../utils/mockAiResponses';
import ConversationArea from './ConversationArea';
import DifficultySelector from './DifficultySelector';
import TopicSelector from './TopicSelector';
import VoiceControls from './VoiceControls';

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
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const [autoListen, setAutoListen] = useState(true);

  // Initialize speech synthesis voices
  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
      
      // Log available Spanish voices for debugging
      const spanishVoices = availableVoices.filter(voice => voice.lang.startsWith('es'));
      console.log('Available Spanish voices:', spanishVoices);
    };

    loadVoices();
    
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    // Speak welcome message when component mounts
    setTimeout(() => {
      speak(messages[0].text);
    }, 1000);

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
    
    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = Array.from(event.results)
        .map(result => (result[0] as SpeechRecognitionAlternative))
        .map(result => result.transcript)
        .join('');
      
      setTranscript(transcript);
    };

    recognition.onend = () => {
      if (isListening) {
        recognition.start();
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('Speech recognition error', event.error);
      // If there's an error, stop listening
      if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        setIsListening(false);
      }
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
    };
  }, [isListening]);

  // Auto-listen after AI finishes speaking if autoListen is enabled
  useEffect(() => {
    if (autoListen && !isSpeaking && messages.length > 1 && messages[messages.length - 1].sender === 'ai') {
      // Small delay to allow UI to update
      const timer = setTimeout(() => {
        if (!isListening) {
          toggleListening();
        }
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [isSpeaking, autoListen, messages]);

  // Handle text-to-speech
  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      skipSpeaking();

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
        console.log('Using voice:', spanishVoice.name);
      } else {
        console.log('No Spanish voice found, using default');
      }

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => {
        setIsSpeaking(false);
        utteranceRef.current = null;
      };
      utterance.onerror = () => {
        setIsSpeaking(false);
        utteranceRef.current = null;
      };

      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Skip current speaking
  const skipSpeaking = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      utteranceRef.current = null;
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

    // Stop listening while processing
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    }

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
      // Hardcoded responses for now as per user request
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
    }, 800);
  };

  // Toggle auto-listen feature
  const toggleAutoListen = () => {
    setAutoListen(!autoListen);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-200px)] md:h-[calc(100vh-220px)] max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 md:space-x-4 mb-6">
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          <TopicSelector selectedTopic={selectedTopic} onSelectTopic={setSelectedTopic} />
          <DifficultySelector difficulty={difficulty} onSelectDifficulty={setDifficulty} />
        </div>
        
        <div className="flex items-center">
          <label className="flex items-center text-sm">
            <input 
              type="checkbox" 
              checked={autoListen} 
              onChange={toggleAutoListen} 
              className="mr-2"
            />
            Auto-escuchar
          </label>
        </div>
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
        onSkipAiSpeaking={skipSpeaking}
      />
    </div>
  );
};

export default VoiceChat;
