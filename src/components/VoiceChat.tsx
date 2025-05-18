import React, { useEffect, useRef, useState } from 'react';
import { Difficulty, Message, Topic } from '../types/chat';
import type { SpeechRecognition, SpeechRecognitionEvent } from '../types/speech-types';
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
      timestamp: new Date(),
      type: 'voice', // Mark AI messages as voice by default
      audioDuration: 3 // Mock duration in seconds
    }
  ]);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<Topic>('general');
  const [difficulty, setDifficulty] = useState<Difficulty>('beginner');
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [speechSynthesisAvailable, setSpeechSynthesisAvailable] = useState(false);
  const [voiceDebugInfo, setVoiceDebugInfo] = useState<string>('');
  
  // For keeping track of synthesis and preventing Chrome bugs
  const synth = useRef<SpeechSynthesis | null>(null);
  const keepAliveInterval = useRef<number | null>(null);
  
  // Initialize speech synthesis
  useEffect(() => {
    // Store reference to speechSynthesis to avoid repeated property lookups
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synth.current = window.speechSynthesis;
      setSpeechSynthesisAvailable(true);
      
      try {
        // Force initialize voices
        synth.current.getVoices();
      } catch (e) {
        console.error('Error initializing voices:', e);
      }
      
      const loadVoices = () => {
        try {
          // Get all available voices
          const availableVoices = synth.current?.getVoices() || [];
          setVoices(availableVoices);
          
          // Debug info
          const spanishVoices = availableVoices.filter(voice => 
            voice.lang.startsWith('es') || voice.name.toLowerCase().includes('spanish')
          );
          
          setVoiceDebugInfo(`Found ${availableVoices.length} voices, ${spanishVoices.length} Spanish voices`);
          
          // Speak initial message if voices are available
          if (spanishVoices.length > 0 && messages.length === 1) {
            // Slight delay to ensure voices are fully loaded
            setTimeout(() => {
              speak(messages[0].text, true);
            }, 1000);
          }
        } catch (e) {
          console.error('Error loading voices:', e);
          const errorMessage = e instanceof Error ? e.message : 'Unknown error';
          setVoiceDebugInfo(`Error loading voices: ${errorMessage}`);
        }
      };

      // Load voices immediately
      loadVoices();
      
      // And also set up the onvoiceschanged event
      synth.current.onvoiceschanged = loadVoices;
    } else {
      setVoiceDebugInfo('Speech synthesis not available in this browser');
      setSpeechSynthesisAvailable(false);
    }

    // Cleanup
    return () => {
      try {
        if (synth.current) {
          synth.current.cancel(); // Cleanup any ongoing speech
        }
        
        // Clear keep-alive interval if it exists
        if (keepAliveInterval.current) {
          window.clearInterval(keepAliveInterval.current);
          keepAliveInterval.current = null;
        }
      } catch (e) {
        console.error('Error in cleanup:', e);
      }
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
        .map(result => ((result as SpeechRecognitionResult)[0] as SpeechRecognitionAlternative))
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

  /**
   * Enhanced speech synthesis function with better error handling
   * @param text - Text to speak
   * @param isInitial - Whether this is the initial greeting message
   */
  const speak = (text: string, isInitial = false) => {
    if (!speechSynthesisAvailable || !synth.current) {
      console.warn('Speech synthesis not available');
      return;
    }
    
    try {
      // Cancel any ongoing speech first
      synth.current.cancel();
      
      // Clear any existing keep-alive interval
      if (keepAliveInterval.current) {
        window.clearInterval(keepAliveInterval.current);
        keepAliveInterval.current = null;
      }

      // Create utterance
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'es-ES';
      utterance.rate = 0.85; // Slightly slower for learning
      utterance.pitch = 1;
      utterance.volume = 1;

      // Voice selection logic - try to find the best Spanish voice
      // First try to find a non-local Spanish voice
      let selectedVoice = voices.find(voice => 
        voice.lang.startsWith('es') && 
        !voice.localService &&
        !voice.name.toLowerCase().includes('neural') // Some neural voices have issues
      );
      
      // If no non-local Spanish voice, try any Spanish voice
      if (!selectedVoice) {
        selectedVoice = voices.find(voice => voice.lang.startsWith('es'));
      }
      
      // If still no Spanish voice, try any voice with "Spanish" in the name
      if (!selectedVoice) {
        selectedVoice = voices.find(voice => 
          voice.name.toLowerCase().includes('spanish') || 
          voice.name.toLowerCase().includes('español')
        );
      }
      
      // If we found a voice, use it
      if (selectedVoice) {
        utterance.voice = selectedVoice;
        setVoiceDebugInfo(`Using voice: ${selectedVoice.name} (${selectedVoice.lang})`);
      } else {
        // Otherwise use default voice
        setVoiceDebugInfo('No Spanish voice found, using default voice');
      }

      // Set up event handlers
      utterance.onstart = () => {
        console.log('Speech started');
        setIsSpeaking(true);
      };
      
      utterance.onend = () => {
        console.log('Speech ended successfully');
        setIsSpeaking(false);
        
        // Clear keep-alive interval
        if (keepAliveInterval.current) {
          window.clearInterval(keepAliveInterval.current);
          keepAliveInterval.current = null;
        }
      };
      
      utterance.onerror = (event) => {
        console.error('Speech error:', event);
        
        // Try to recover the error type
        let errorMessage = 'Unknown error';
        try {
          errorMessage = event.error || 'Unknown error';
        } catch (e) {
          console.error('Error accessing error message:', e);
        }
        
        setVoiceDebugInfo(`Speech error: ${errorMessage}`);
        setIsSpeaking(false);
        
        // Clear keep-alive interval
        if (keepAliveInterval.current) {
          window.clearInterval(keepAliveInterval.current);
          keepAliveInterval.current = null;
        }
        
        // If it's not a user-cancelled error and not the initial greeting,
        // try to restart speech after a delay
        if (errorMessage !== 'canceled' && !isInitial && errorMessage !== 'interrupted') {
          setTimeout(() => {
            console.log('Attempting to restart speech after error');
            speak(text);
          }, 500);
        }
      };

      // Workaround for Chrome bug - make sure synthesis is not paused
      if (synth.current.paused) {
        synth.current.resume();
      }
      
      // Speak the utterance
      synth.current.speak(utterance);
      
      // Chrome bug workaround - keep alive for longer utterances
      // This prevents Chrome from cutting off speech after about 15 seconds
      keepAliveInterval.current = window.setInterval(() => {
        if (!synth.current) return;
        
        if (synth.current.speaking) {
          // Force the speech synthesizer to keep going by pausing and resuming
          synth.current.pause();
          synth.current.resume();
        } else {
          // If it's not speaking anymore, clear the interval
          window.clearInterval(keepAliveInterval.current as number);
          keepAliveInterval.current = null;
        }
      }, 5000);
      
    } catch (error) {
      console.error('Speech synthesis error:', error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      setVoiceDebugInfo(`Error in speech synthesis: ${errorMessage}`);
      setIsSpeaking(false);
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
      timestamp: new Date(),
      type: 'text' // User messages are text by default
    };

    setMessages(prev => [...prev, userMessage]);
    setTranscript('');

    // Simulate AI response with a delay
    setTimeout(() => {
      const aiResponseText = getMockResponse(transcript, selectedTopic, difficulty);
      // Calculate a mock duration based on text length
      const estimatedDuration = Math.max(3, Math.floor(aiResponseText.length / 15));
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponseText,
        sender: 'ai',
        timestamp: new Date(),
        type: 'voice', // AI messages are voice by default
        audioDuration: estimatedDuration
      };
      
      setMessages(prev => [...prev, aiMessage]);

      // Speak the AI response
      speak(aiResponseText);
    }, 1000);
  };

  // Skip AI speaking
  const handleSkipSpeaking = () => {
    if (speechSynthesisAvailable && synth.current) {
      synth.current.cancel();
      setIsSpeaking(false);
      
      // Clear keep-alive interval
      if (keepAliveInterval.current) {
        window.clearInterval(keepAliveInterval.current);
        keepAliveInterval.current = null;
      }
    }
  };

  // Retry speaking a specific AI message
  const handleRetryAiSpeech = (messageId: string) => {
    const message = messages.find(m => m.id === messageId);
    if (message && message.sender === 'ai') {
      speak(message.text);
    }
  };

  // Retry speaking the last AI message
  const handleRetryLastSpeech = () => {
    // Find the last AI message
    const lastAiMessage = [...messages].reverse().find(m => m.sender === 'ai');
    if (lastAiMessage) {
      speak(lastAiMessage.text);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-200px)] md:h-[calc(100vh-220px)] max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-6">
        <TopicSelector selectedTopic={selectedTopic} onSelectTopic={setSelectedTopic} />
        <DifficultySelector difficulty={difficulty} onSelectDifficulty={setDifficulty} />
      </div>
      
      {!speechSynthesisAvailable && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          <strong className="font-bold">Warning:</strong>
          <span className="block sm:inline"> Speech synthesis is not available in your browser. You'll see the text but won't hear speech.</span>
        </div>
      )}
      
      <ConversationArea 
        messages={messages} 
        currentTranscript={isListening ? transcript : ''} 
        onRetryAiSpeech={handleRetryAiSpeech}
      />
      
      <VoiceControls 
        isListening={isListening} 
        isSpeaking={isSpeaking}
        isLoading={false} // Provide a value for isLoading
        onToggleListening={toggleListening}
        transcript={transcript}
        onSendMessage={handleSendMessage}
        onSkipAiSpeaking={handleSkipSpeaking}
        onRetryLastSpeech={handleRetryLastSpeech}
      />
      
      {/* Debug information - you can remove this in production */}
      {voiceDebugInfo && (
        <div className="mt-2 text-xs text-gray-500 opacity-75">
          Debug: {voiceDebugInfo}
        </div>
      )}
    </div>
  );
};

export default VoiceChat;