import React, { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';

const ChatBubble: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<{type: 'user' | 'support', text: string}[]>([
    {type: 'support', text: '¡Hola! ¿En qué podemos ayudarte hoy?'}
  ]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSendMessage = () => {
    if (message.trim() === '') return;
    
    // Add user message to chat
    setChatHistory([...chatHistory, {type: 'user', text: message}]);
    
    // Simulate response after a short delay
    setTimeout(() => {
      setChatHistory(prev => [...prev, {
        type: 'support', 
        text: 'Gracias por tu mensaje. Un representante te responderá pronto.'
      }]);
    }, 1000);
    
    setMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-50">
      {/* Chat Button */}
      <button
        onClick={toggleChat}
        className={`flex items-center justify-center p-4 rounded-full shadow-lg transition-colors ${
          isOpen ? 'bg-red-500 text-white' : 'bg-blue-600 text-white'
        }`}
      >
        {isOpen ? <X size={20} /> : <MessageCircle size={20} />}
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-80 bg-white rounded-lg shadow-xl overflow-hidden border border-gray-200 flex flex-col">
          {/* Header */}
          <div className="bg-blue-600 p-3 text-white flex justify-between items-center">
            <h3 className="font-medium">Soporte EcoAlliance</h3>
            <button onClick={toggleChat} className="text-white hover:text-gray-200">
              <X size={18} />
            </button>
          </div>
          
          {/* Chat Messages */}
          <div className="flex-1 p-3 max-h-96 overflow-y-auto flex flex-col space-y-3">
            {chatHistory.map((msg, index) => (
              <div 
                key={index}
                className={`p-3 rounded-lg max-w-[80%] ${
                  msg.type === 'user' 
                    ? 'bg-blue-100 ml-auto rounded-tr-none' 
                    : 'bg-gray-100 rounded-tl-none'
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>
          
          {/* Input Area */}
          <div className="border-t border-gray-200 p-3 flex">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Escribe tu mensaje..."
              className="flex-1 border border-gray-300 rounded-l-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
              rows={1}
            />
            <button
              onClick={handleSendMessage}
              className="bg-blue-600 text-white px-3 rounded-r-md hover:bg-blue-700"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBubble; 