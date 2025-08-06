'use client';

import { useState } from 'react';

// Define the structure of a message
interface Message {
  text: string;
  isUser: boolean;
  timestamp: Date;
}

// Simple markdown renderer function
const renderMarkdown = (text: string) => {
  if (!text) return '';
  
  return text
    // Bold text: **text** or __text__
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/__(.*?)__/g, '<strong>$1</strong>')
    // Italic text: *text* or _text_
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/_(.*?)_/g, '<em>$1</em>')
    // Code: `code`
    .replace(/`(.*?)`/g, '<code class="bg-gray-100 px-1 py-0.5 rounded text-sm">$1</code>')
    // Headers: # Header
    .replace(/^### (.*$)/gim, '<h3 class="font-bold text-lg mb-2">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="font-bold text-xl mb-3">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 class="font-bold text-2xl mb-4">$1</h1>')
    // Lists: - item or * item
    .replace(/^[-*] (.*$)/gim, '<li class="ml-4">$1</li>')
    // Numbered lists: 1. item
    .replace(/^\d+\. (.*$)/gim, '<li class="ml-4">$1</li>')
    // Paragraphs: double line breaks
    .replace(/\n\n/g, '</p><p class="mb-2">')
    // Single line breaks
    .replace(/\n/g, '<br>')
    // Wrap in paragraph tags
    .replace(/^(.*)$/, '<p class="mb-2">$1</p>')
    // Clean up empty paragraphs
    .replace(/<p class="mb-2"><\/p>/g, '')
    .replace(/<p class="mb-2"><br><\/p>/g, '');
};

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { text: input, isUser: true, timestamp: new Date() };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: [...messages, { role: 'user', content: input }] }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const botMessage: Message = { text: data.message, isUser: false, timestamp: new Date() };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = { text: 'Oops! Something went wrong. Please try again.', isUser: false, timestamp: new Date() };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen flex-col bg-gray-50">
      {/* Header */}
      <header className="p-6 border-b border-gray-200 w-full bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-white mb-1">🏛️ History Adventure Master</h1>
          <p className="text-blue-100 text-sm">Transform NCERT history into exciting roleplaying experiences</p>
        </div>
      </header>

      {/* Chat Area */}
      <main className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 ? (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 text-blue-800 p-6 rounded-xl shadow-lg max-w-2xl">
            <h2 className="font-bold text-xl mb-3">🏛️ Welcome to History Adventure!</h2>
            <p className="mb-4">What period of history are you studying today? Tell me a topic, and I will create an exciting roleplaying scenario for you.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
              <div className="bg-white/60 p-3 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-sm mb-2">🏺 Ancient India</h3>
                <p className="text-xs text-blue-700">Indus Valley, Mauryan Empire, Gupta Dynasty</p>
              </div>
              <div className="bg-white/60 p-3 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-sm mb-2">👑 Medieval India</h3>
                <p className="text-xs text-blue-700">Delhi Sultanate, Mughal Empire, Marathas</p>
              </div>
              <div className="bg-white/60 p-3 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-sm mb-2">⚔️ Modern India</h3>
                <p className="text-xs text-blue-700">British Rule, Freedom Struggle, Independence</p>
              </div>
              <div className="bg-white/60 p-3 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-sm mb-2">🎭 Cultural Heritage</h3>
                <p className="text-xs text-blue-700">Art, Architecture, Literature, Science</p>
              </div>
            </div>
            
            <p className="text-sm mt-4 italic">Try: <em>&quot;The Mauryan Empire&quot;</em> or <em>&quot;Akbar&apos;s Court&quot;</em></p>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
              <div className={`p-4 rounded-xl shadow-md max-w-2xl ${
                msg.isUser 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-white text-gray-800 border border-gray-200'
              }`}>
                {msg.isUser ? (
                  <div>{msg.text}</div>
                ) : (
                  <div 
                    className="prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.text) }}
                  />
                )}
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 p-4 rounded-xl shadow-md max-w-lg border border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <span className="text-sm font-medium">Creating your historical adventure...</span>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Input Area */}
      <footer className="p-4 bg-white border-t shadow-sm">
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSendMessage}>
            <div className="relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={isLoading ? '' : 'Enter your topic here'}
                className="w-full p-3 pr-12 border rounded-full bg-gray-100 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                disabled={isLoading}
              />
              <button
                type="submit"
                className="absolute inset-y-0 right-0 flex items-center justify-center w-12 h-full text-white bg-blue-600 rounded-r-full hover:bg-blue-700 focus:outline-none"
                disabled={isLoading}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      </footer>
    </div>
  );
}