
import React, { useState, useRef, useEffect } from 'react';
import { getAssistantResponse } from '../services/geminiService';

const NexusAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; text: string }[]>([
    { role: 'ai', text: 'Welcome to Core Devs Hub. I am Nexus AI. How can I assist your development today?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async (text: string = input) => {
    if (!text.trim()) return;
    
    setMessages(prev => [...prev, { role: 'user', text }]);
    setInput('');
    setIsTyping(true);

    const response = await getAssistantResponse(text);
    
    setIsTyping(false);
    setMessages(prev => [...prev, { role: 'ai', text: response }]);
  };

  const quickPrompts = [
    "How do I invite Fynex?",
    "What's in the Vault?",
    "Discord.js help"
  ];

  return (
    <div className="fixed bottom-8 right-8 z-[100]">
      {/* Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 group ${isOpen ? 'bg-red-500 rotate-90' : 'bg-[#5865F2] hover:scale-110'}`}
      >
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <div className="relative">
            <div className="absolute inset-0 bg-white/20 rounded-full animate-ping"></div>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-white relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </div>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-[350px] md:w-[400px] h-[550px] glass rounded-[2.5rem] border-white/10 shadow-[0_30px_100px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden animate-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="p-6 border-b border-white/5 bg-white/5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center font-black text-white">CD</div>
            <div>
              <h3 className="text-sm font-black text-white uppercase tracking-widest">Nexus AI</h3>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Active Assistant</span>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-xs leading-relaxed ${
                  m.role === 'user' 
                  ? 'bg-indigo-600 text-white rounded-tr-none' 
                  : 'bg-white/5 text-slate-300 border border-white/5 rounded-tl-none'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white/5 px-4 py-3 rounded-2xl rounded-tl-none border border-white/5 flex gap-1">
                  <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Prompts */}
          {messages.length < 3 && (
            <div className="px-6 py-2 flex gap-2 flex-wrap">
              {quickPrompts.map(p => (
                <button 
                  key={p} 
                  onClick={() => handleSend(p)}
                  className="text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border border-white/5 bg-white/5 hover:bg-white/10 text-slate-400 transition-all"
                >
                  {p}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="p-6 border-t border-white/5">
            <form 
              onSubmit={(e) => { e.preventDefault(); handleSend(); }}
              className="flex gap-2"
            >
              <input 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-indigo-500 transition-all"
              />
              <button 
                type="submit"
                className="p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-500 transition-all active:scale-90 shadow-lg shadow-indigo-600/20"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9-2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default NexusAssistant;
