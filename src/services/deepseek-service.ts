import { Difficulty, Topic } from '../types/chat';

// Define the interface for the DeepSeek API request
interface DeepSeekChatRequest {
  model: string;
  messages: {
    role: 'system' | 'user' | 'assistant';
    content: string;
  }[];
  temperature?: number;
  max_tokens?: number;
  stream?: boolean;
}

// Define the interface for DeepSeek API response
interface DeepSeekChatResponse {
  choices: {
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }[];
  id: string;
  created: number;
  model: string;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

// Create a conversation history type for tracking
export interface ConversationHistory {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

// Set the API key and endpoint
const API_KEY = import.meta.env.VITE_DEEPSEEK_API_KEY;
const API_ENDPOINT = 'https://api.deepseek.com/v1/chat/completions';

// Create system prompts based on difficulty and topic
const getSystemPrompt = (difficulty: Difficulty, topic: Topic): string => {
  const difficultyLevel = {
    'beginner': 'básico/principiante (A1-A2)',
    'intermediate': 'intermedio (B1-B2)',
    'advanced': 'avanzado (C1-C2)'
  }[difficulty];

  const topicContext = {
    'general': 'conversación general',
    'travel': 'viajes y turismo',
    'restaurant': 'restaurantes y comida',
    'shopping': 'compras',
    'emergency': 'situaciones de emergencia'
  }[topic];

  return `Eres un tutor español amable y paciente que ayuda a los estudiantes a practicar su español hablado. 
  - Nivel del estudiante: ${difficultyLevel}
  - Tema de conversación: ${topicContext}
  - Responde SIEMPRE en español.
  - Para nivel principiante: usa frases sencillas, vocabulario básico y habla despacio.
  - Para nivel intermedio: usa gramática más compleja y vocabulario más variado.
  - Para nivel avanzado: usa español natural, expresiones idiomáticas y vocabulario sofisticado.
  - Mantén tus respuestas concisas (aproximadamente 1-3 oraciones) ya que se leerán en voz alta.
  - Tu objetivo es mantener una conversación natural y ayudar al estudiante a mejorar su fluidez en español.
  - Anima al estudiante y ofrece correcciones sutiles si es necesario.`;
};

// Initialize the conversation history function
export const initializeConversation = (difficulty: Difficulty, topic: Topic): ConversationHistory[] => {
  const systemPrompt = getSystemPrompt(difficulty, topic);
  return [
    {
      role: 'system',
      content: systemPrompt
    },
    {
      role: 'assistant',
      content: '¡Hola! ¿Cómo puedo ayudarte a practicar español hoy?'
    }
  ];
};

// Get response from DeepSeek API
export const getDeepSeekResponse = async (
  userMessage: string,
  conversationHistory: ConversationHistory[],
  difficulty: Difficulty,
  topic: Topic
): Promise<{ text: string, conversationHistory: ConversationHistory[] }> => {
  // Check if API key is available
  if (!API_KEY) {
    console.error('DeepSeek API key is not set. Please set the VITE_DEEPSEEK_API_KEY environment variable.');
    throw new Error('API key not found');
  }

  try {
    // Add user message to conversation history
    const updatedHistory: ConversationHistory[] = [
      ...conversationHistory,
      { role: 'user', content: userMessage }
    ];

    // Create request payload
    const requestBody: DeepSeekChatRequest = {
      model: 'deepseek-chat', // Use the appropriate model
      messages: updatedHistory,
      temperature: 1.3,
      max_tokens: 200 // Adjust based on your needs
    };

    // Call the DeepSeek API
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify(requestBody)
    });

    // Check if the response is successful
    if (!response.ok) {
      const errorData = await response.json();
      console.error('DeepSeek API error:', errorData);
      throw new Error(`DeepSeek API error: ${response.status} ${response.statusText}`);
    }

    // Parse the response
    const data: DeepSeekChatResponse = await response.json();
    
    // Extract the assistant's response
    const assistantResponse = data.choices[0].message.content;
    const assistantRole = data.choices[0].message.role as 'system' | 'user' | 'assistant';

    // Add assistant's response to conversation history
    const newConversationHistory = [
      ...updatedHistory,
      { role: assistantRole, content: assistantResponse }
    ];

    // Return the response and updated conversation history
    return {
      text: assistantResponse,
      conversationHistory: newConversationHistory
    };
  } catch (error) {
    console.error('Error calling DeepSeek API:', error);
    throw error;
  }
};