import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, User, Clock, Smile } from 'lucide-react';
import { ChatMessage } from '../types';
import { useWeb3 } from '../hooks/useWeb3';

interface ChatViewProps {
  messages: ChatMessage[];
  onSendMessage: (content: string) => void;
}

const ChatView: React.FC<ChatViewProps> = ({ messages, onSendMessage }) => {
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { isConnected, account } = useWeb3();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() && isConnected) {
      onSendMessage(newMessage.trim());
      setNewMessage('');
    }
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const isOwnMessage = (messageAuthor: string) => {
    return account && messageAuthor === account;
  };

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="glass rounded-t-2xl p-4 border-b border-white/20">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl flex items-center justify-center">
            <MessageCircle className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Live Chat</h1>
            <p className="text-white/70">Real-time community discussions</p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 glass rounded-none p-4 overflow-y-auto space-y-4">
        {messages.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-teal-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No messages yet</h3>
              <p className="text-white/70">Start the conversation!</p>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${isOwnMessage(message.author) ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-xs lg:max-w-md ${
                message.type === 'system' 
                  ? 'w-full text-center'
                  : isOwnMessage(message.author) 
                    ? 'ml-12' 
                    : 'mr-12'
              }`}>
                {message.type === 'system' ? (
                  <div className="glass-dark rounded-lg p-2 text-center">
                    <p className="text-white/60 text-sm">{message.content}</p>
                  </div>
                ) : (
                  <div className={`glass-dark rounded-2xl p-4 ${
                    isOwnMessage(message.author) 
                      ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20' 
                      : ''
                  }`}>
                    {!isOwnMessage(message.author) && (
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="w-6 h-6 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                          <User className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-white/80 font-medium text-sm">
                          {formatAddress(message.author)}
                        </span>
                      </div>
                    )}
                    <p className="text-white/90 mb-2">{message.content}</p>
                    <div className="flex items-center justify-end space-x-1 text-white/50 text-xs">
                      <Clock className="w-3 h-3" />
                      <span>{formatTime(message.timestamp)}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="glass rounded-b-2xl p-4 border-t border-white/20">
        {isConnected ? (
          <form onSubmit={handleSubmit} className="flex space-x-3">
            <div className="flex-1 relative">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="glass-input rounded-lg px-4 py-3 pr-12 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 w-full"
                maxLength={500}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white/80"
              >
                <Smile className="w-5 h-5" />
              </button>
            </div>
            <button
              type="submit"
              disabled={!newMessage.trim()}
              className="glass-button rounded-lg px-4 py-3 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-transform"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        ) : (
          <div className="text-center py-4">
            <p className="text-white/60">Connect your wallet to join the chat</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatView;
