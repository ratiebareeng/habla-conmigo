import React, { useEffect, useRef, useState } from 'react';
import { ConversationHistory, getDeepSeekResponse, initializeConversation } from '../services/deepseek-service';
import { Difficulty, Message, Topic } from '../types/chat';
import type { SpeechRecognition, SpeechRecognitionEvent } from '../types/speech-types';
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
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<Topic>('general');
  const [difficulty, setDifficulty] = useState<Difficulty>('beginner');
  const [transcript, setTranscript] = useState('');
  const [conversationHistory, setConversationHistory] = useState<ConversationHistory[]>(
    initializeConversation(difficulty, selectedTopic)
  );
  const [apiError, setApiError] = useState<string | null>(null);

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [speechSynthesisAvailable, setSpeechSynthesisAvailable] = useState(false);
  const [voiceDebugInfo, setVoiceDebugInfo] = useState<string>('');

  // Reset conversation history when topic or difficulty changes
  useEffect(() => {
    setConversationHistory(initializeConversation(difficulty, selectedTopic));
  }, [difficulty, selectedTopic]);

  // Initialize speech synthesis voices
  useEffect(() => {
    if ('speechSynthesis' in window) {
      setSpeechSynthesisAvailable(true);
      
      const loadVoices = () => {
        const availableVoices = window.speechSynthesis.getVoices();
        setVoices(availableVoices);
        
        // Debug info
        const spanishVoices = availableVoices.filter(voice => voice.lang.startsWith('es'));
        setVoiceDebugInfo(`Found ${availableVoices.length} voices, ${spanishVoices.length} Spanish voices`);
        
        // Ensure initial message is spoken if voices are available
        if (spanishVoices.length > 0 && messages.length === 1) {
          // Slight delay to ensure voices are fully loaded
          setTimeout(() => {
            speak(messages[0].text);
          }, 500);
        }
      };

      // Load voices immediately
      loadVoices();
      
      // And also set up the onvoiceschanged event
      window.speechSynthesis.onvoiceschanged = loadVoices;
    } else {
      setVoiceDebugInfo('Speech synthesis not available in this browser');
    }

    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel(); // Cleanup any ongoing speech
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

  // Handle text-to-speech with improved reliability
  const speak = (text: string) => {
    if (!speechSynthesisAvailable) {
      console.warn('Speech synthesis not available');
      return;
    }
    
    try {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'es-ES';
      utterance.rate = 0.9; // Slightly slower for learning
      utterance.pitch = 1;

      // Find a Spanish voice - first try to find a non-local voice
      let spanishVoice = voices.find(voice => 
        voice.lang.startsWith('es') && !voice.localService
      );
      
      // If no non-local Spanish voice, try any Spanish voice
      if (!spanishVoice) {
        spanishVoice = voices.find(voice => voice.lang.startsWith('es'));
      }
      
      // If still no Spanish voice, just use the default voice
      if (spanishVoice) {
        utterance.voice = spanishVoice;
        setVoiceDebugInfo(`Using voice: ${spanishVoice.name} (${spanishVoice.lang})`);
      } else {
        setVoiceDebugInfo('No Spanish voice found, using default voice');
      }

      utterance.onstart = () => {
        console.log('Speech started');
        setIsSpeaking(true);
      };
      
      utterance.onend = () => {
        console.log('Speech ended');
        setIsSpeaking(false);
      };
      
      utterance.onerror = (event) => {
        console.error('Speech error:', event);
        setIsSpeaking(false);
        setVoiceDebugInfo(`Speech error: ${event.error}`);
      };

      // Workaround for Chrome bug - reset and resume synthesis
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }
      
      window.speechSynthesis.speak(utterance);
      
      // Chrome bug workaround - keep alive for longer utterances
      const keepAlive = setInterval(() => {
        if (window.speechSynthesis.speaking) {
          window.speechSynthesis.pause();
          window.speechSynthesis.resume();
        } else {
          clearInterval(keepAlive);
        }
      }, 5000);
      
    } catch (error) {
      console.error('Speech synthesis error:', error);
      setVoiceDebugInfo(`Error in speech synthesis: ${error}`);
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

  // Send user message and get AI response from DeepSeek
  const handleSendMessage = async () => {
    if (transcript.trim() === '' || isLoading) return;

    // Add user message to UI
    const userMessage: Message = {
      id: Date.now().toString(),
      text: transcript,
      sender: 'user',
      timestamp: new Date(),
      type: 'text' // User messages are text by default
    };

    setMessages(prev => [...prev, userMessage]);
    setTranscript('');
    setIsLoading(true);
    setApiError(null);

    try {
      // Get AI response from DeepSeek
      const response = await getDeepSeekResponse(
        transcript, 
        conversationHistory, 
        difficulty, 
        selectedTopic
      );
      
      // Update conversation history
      setConversationHistory(response.conversationHistory);
      
      // Calculate estimated duration based on text length
      const estimatedDuration = Math.max(3, Math.floor(response.text.length / 15));
      
      // Create new AI message
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.text,
        sender: 'ai',
        timestamp: new Date(),
        type: 'voice', // AI messages are voice by default
        audioDuration: estimatedDuration
      };
      
      // Add AI message to UI
      setMessages(prev => [...prev, aiMessage]);

      // Speak the AI response
      speak(response.text);
    } catch (error) {
      console.error('Error getting DeepSeek response:', error);
      setApiError('Failed to get AI response. Please try again.');
      
      // Fallback message in case of API failure
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Lo siento, estoy teniendo problemas para responder. ¿Puedes intentarlo de nuevo?',
        sender: 'ai',
        timestamp: new Date(),
        type: 'voice',
        audioDuration: 4
      };
      
      setMessages(prev => [...prev, errorMessage]);
      speak(errorMessage.text);
    } finally {
      setIsLoading(false);
    }
  };

  // Skip AI speaking
  const handleSkipSpeaking = () => {
    if (speechSynthesisAvailable) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
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

  // Retry getting response from DeepSeek API for a specific message
  const handleRetryAiSpeech = async (messageId: string) => {
    // Find the message and its index
    const messageIndex = messages.findIndex(m => m.id === messageId);
    if (messageIndex === -1 || messageIndex === 0) return;
    
    // Get the user message that came before this AI message
    const userMessageIndex = messageIndex - 1;
    if (userMessageIndex < 0 || messages[userMessageIndex].sender !== 'user') return;
    
    const userMessage = messages[userMessageIndex];
    
    setIsLoading(true);
    setApiError(null);
    
    try {
      // Get a new AI response from DeepSeek
      const response = await getDeepSeekResponse(
        userMessage.text,
        conversationHistory.slice(0, -2), // Remove last user and AI messages
        difficulty,
        selectedTopic
      );
      
      // Update conversation history
      setConversationHistory(response.conversationHistory);
      
      // Calculate estimated duration
      const estimatedDuration = Math.max(3, Math.floor(response.text.length / 15));
      
      // Create new AI message
      const aiMessage: Message = {
        ...messages[messageIndex],
        text: response.text,
        timestamp: new Date(),
        audioDuration: estimatedDuration
      };
      
      // Update the messages array
      const updatedMessages = [...messages];
      updatedMessages[messageIndex] = aiMessage;
      setMessages(updatedMessages);
      
      // Speak the new AI response
      speak(response.text);
    } catch (error) {
      console.error('Error retrying DeepSeek response:', error);
      setApiError('Failed to get AI response. Please try again.');
    } finally {
      setIsLoading(false);
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

      {apiError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline"> {apiError}</span>
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
        isLoading={isLoading}
        onToggleListening={toggleListening}
        transcript={transcript}
        onSendMessage={handleSendMessage}
        onSkipAiSpeaking={handleSkipSpeaking}
        onRetryLastSpeech={handleRetryLastSpeech}
      />
    </div>
  );
};

export default VoiceChat;