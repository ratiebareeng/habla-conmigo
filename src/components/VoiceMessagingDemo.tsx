import { User, Volume2 } from 'lucide-react';
import { useState } from 'react';
import VoiceMessage from './VoiceMessage';

const VoiceMessagingDemo = () => {
  const [messages, setMessages] = useState([
    {
      id: '1',
      text: '¡Hola! ¿Cómo puedo ayudarte a practicar español hoy? Soy tu tutor virtual de español y estoy aquí para ayudarte a mejorar tu fluidez y comprensión del idioma.',
      sender: 'ai',
      timestamp: new Date(),
      duration: 8
    },
    {
      id: '2',
      text: 'Hola, quiero practicar vocabulario de viajes.',
      sender: 'user',
      timestamp: new Date(),
      duration: 3
    },
    {
      id: '3',
      text: 'Perfecto. Vamos a practicar vocabulario relacionado con viajes. Te voy a enseñar algunas palabras y frases útiles para cuando estés de viaje en un país hispanohablante.',
      sender: 'ai',
      timestamp: new Date(),
      duration: 10
    }
  ]);

  // Demo transcript for the current user message being composed
  const [currentTranscript, setCurrentTranscript] = useState('');
  
  // Toggle for showing the input controls
  const [showControls, setShowControls] = useState(true);

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-4 text-center text-orange-500">HablaConmigo - Voice Chat</h2>
      
      {/* Messages container */}
      <div className="mb-4 space-y-4 max-h-96 overflow-y-auto p-2">
        {messages.map(message => (
          <div key={message.id} className={`flex ${message.sender === 'ai' ? 'justify-start' : 'justify-end'}`}>
            <VoiceMessage 
              text={message.text}
              duration={message.duration}
              isAi={message.sender === 'ai'}
            />
          </div>
        ))}
        
        {/* Current transcript bubble */}
        {currentTranscript && (
          <div className="flex justify-end">
            <div className="max-w-[80%] bg-gray-200 dark:bg-slate-700 rounded-2xl rounded-br-none px-4 py-2 text-sm md:text-base animate-pulse">
              {currentTranscript}
            </div>
          </div>
        )}
      </div>
      
      {/* Demo controls */}
      <div className="mt-6 border-t pt-4">
        <button 
          onClick={() => setShowControls(!showControls)}
          className="w-full bg-orange-500 text-white py-2 rounded-lg mb-4"
        >
          {showControls ? 'Hide Voice Controls' : 'Show Voice Controls'}
        </button>
        
        {showControls && (
          <div className="p-4 rounded-lg bg-white shadow-md">
            <div className="flex items-center mb-4">
              <button
                className="p-4 rounded-full bg-blue-500 hover:bg-blue-600 mr-4"
              >
                <User className="w-6 h-6 text-white" />
              </button>
              
              <input 
                type="text"
                value={currentTranscript}
                onChange={(e) => setCurrentTranscript(e.target.value)}
                placeholder="Type a demo message..."
                className="flex-grow px-4 py-2 rounded-full bg-gray-100"
              />
              
              <button
                onClick={() => {
                  if (currentTranscript.trim()) {
                    // Add user message
                    const userMsg = {
                      id: Date.now().toString(),
                      text: currentTranscript,
                      sender: 'user',
                      timestamp: new Date(),
                      duration: Math.max(2, Math.floor(currentTranscript.length / 15))
                    };
                    
                    setMessages(prev => [...prev, userMsg]);
                    setCurrentTranscript('');
                    
                    // Simulate AI response
                    setTimeout(() => {
                      const aiMsg = {
                        id: (Date.now() + 1).toString(),
                        text: `Me alegra que quieras hablar sobre "${currentTranscript}". Vamos a practicar más frases relacionadas con este tema.`,
                        sender: 'ai',
                        timestamp: new Date(),
                        duration: 8
                      };
                      
                      setMessages(prev => [...prev, aiMsg]);
                    }, 1500);
                  }
                }}
                className="p-4 ml-4 bg-orange-500 hover:bg-orange-600 rounded-full"
              >
                <Volume2 className="w-6 h-6 text-white" />
              </button>
            </div>
            
            <div className="text-xs text-center text-gray-500">
              In a real app, press the microphone button to speak your message. For this demo, type a message and press the voice button to send.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VoiceMessagingDemo;