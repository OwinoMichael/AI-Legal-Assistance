import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageSquare, Bot, Send } from 'lucide-react';
import type { ChatMessage } from './types';

interface ChatSidebarProps {
  chatMessages: ChatMessage[];
  setChatMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({ chatMessages, setChatMessages }) => {
  const [newMessage, setNewMessage] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    const userMessage: ChatMessage = {
      id: chatMessages.length + 1,
      type: "user",
      message: newMessage,
      timestamp: new Date().toISOString()
    };
    
    setChatMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    
    // Simulate AI response
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: chatMessages.length + 2,
        type: "ai",
        message: "Based on the contract analysis, I can help clarify that specific clause. The non-compete section in your contract is indeed quite broad and may impact your future career options. Would you like me to explain the specific terms or suggest negotiation strategies?",
        timestamp: new Date().toISOString()
      };
      setChatMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <Card className="h-[700px] flex flex-col backdrop-blur-sm bg-white/80 border-white/20 shadow-2xl relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent pointer-events-none" />
      <CardHeader className="pb-3 relative z-10">
        <CardTitle className="flex items-center text-slate-800">
          <MessageSquare className="w-5 h-5 mr-2" />
          AI Assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col p-0 relative z-10">
        {/* Chat Messages */}
        <ScrollArea className="flex-1 px-4">
          <div className="space-y-4 pb-4">
            {chatMessages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-xl transition-all duration-200 ${
                    message.type === 'user'
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                      : 'bg-white/70 backdrop-blur-sm text-slate-800 border border-white/20 shadow-lg'
                  }`}
                >
                  <div className="flex items-start space-x-2">
                    {message.type === 'ai' && (
                      <Bot className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    )}
                    <div className="text-sm">{message.message}</div>
                  </div>
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
        </ScrollArea>

        {/* Chat Input */}
        <div className="border-t border-white/20 p-4 bg-white/20 backdrop-blur-sm">
          <div className="flex space-x-2">
            <Input
              placeholder="Ask about the contract..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 bg-white/70 backdrop-blur-sm border-white/30 hover:border-white/50 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200"
            />
            <Button 
              size="sm" 
              onClick={handleSendMessage} 
              disabled={!newMessage.trim()}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChatSidebar;