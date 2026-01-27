
import React, { useState } from 'react';
import { Resource } from '../types';
import { explainCode } from '../services/geminiService';

interface ResourceCardProps {
  resource: Resource;
}

const ResourceCard: React.FC<ResourceCardProps> = ({ resource }) => {
  const [isCopied, setIsCopied] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAction = () => {
    if (resource.type === 'TOOL') {
      window.open(resource.content, '_blank');
    } else {
      navigator.clipboard.writeText(resource.content);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const handleExplain = async () => {
    if (explanation) return setExplanation(null);
    setIsLoading(true);
    const result = await explainCode(resource.content);
    setExplanation(result);
    setIsLoading(false);
  };

  const typeIcon = resource.type === 'API_KEY' ? '🔑' : resource.type === 'CODE_SNIPPET' ? '💻' : '🛠️';
  const typeColor = resource.type === 'API_KEY' ? 'amber' : resource.type === 'CODE_SNIPPET' ? 'indigo' : 'purple';

  return (
    <div className="rounded-[2.5rem] glass p-8 flex flex-col h-full card-highlight shadow-xl overflow-hidden relative group/card">
      <div className={`absolute top-0 right-0 p-8 opacity-5 pointer-events-none group-hover/card:scale-125 group-hover/card:opacity-10 transition-all duration-700`}>
         <span className="text-7xl font-black">{typeIcon}</span>
      </div>

      <div className="flex justify-between items-start mb-6 relative z-10">
        <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest border transition-colors ${
          resource.type === 'API_KEY' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 
          resource.type === 'CODE_SNIPPET' ? 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20' : 
          'bg-purple-500/10 text-purple-500 border-purple-500/20'
        }`}>
          {resource.type.replace('_', ' ')}
        </span>
        <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest">{resource.createdAt}</span>
      </div>
      
      <h4 className="text-2xl font-black text-white mb-3 relative z-10 group-hover/card:text-indigo-400 transition-colors duration-300">{resource.title}</h4>
      <p className="text-slate-400 text-sm leading-relaxed mb-8 flex-grow relative z-10 font-medium">{resource.description}</p>
      
      <div className="flex flex-wrap gap-2 mb-8 relative z-10">
        {resource.tags.map(tag => (
          <span key={tag} className="text-[10px] font-black text-slate-500 bg-white/5 px-3 py-1 rounded-full border border-white/5 uppercase tracking-tighter hover:text-white transition-colors cursor-default">#{tag}</span>
        ))}
      </div>

      <div className="space-y-4 relative z-10">
        <div className="relative group/content">
          <div className={`bg-black/40 rounded-2xl p-5 font-mono text-xs overflow-hidden break-all text-slate-300 min-h-[60px] flex items-center border border-white/5 group-hover/content:border-white/20 transition-all ${resource.type === 'API_KEY' && !isRevealed ? 'blur-sm select-none' : ''}`}>
            {resource.type === 'TOOL' ? resource.content.replace('https://', '') : resource.content}
          </div>
          
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-2 opacity-0 group-hover/content:opacity-100 transition-all duration-300">
            {resource.type === 'API_KEY' && (
              <button 
                onClick={() => setIsRevealed(!isRevealed)}
                className="p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-all text-white backdrop-blur-md border border-white/10"
              >
                {isRevealed ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            )}
            <button 
              onClick={handleAction}
              className={`p-3 rounded-xl transition-all text-white shadow-lg active:scale-90 ${resource.type === 'TOOL' ? 'bg-purple-600 hover:bg-purple-500' : 'bg-indigo-600 hover:bg-indigo-500'}`}
            >
              {isCopied ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              ) : resource.type === 'TOOL' ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                  <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {resource.type === 'CODE_SNIPPET' && (
          <button 
            onClick={handleExplain}
            className="w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-[10px] font-black uppercase tracking-widest text-slate-300 py-4 rounded-xl transition-all border border-white/5 active:scale-95 group/btn overflow-hidden relative"
          >
            <div className="absolute inset-0 bg-indigo-500/10 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300"></div>
            <span className="relative z-10 flex items-center gap-2">
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Nexus AI Insights
                </>
              )}
            </span>
          </button>
        )}

        {explanation && (
          <div className="p-5 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl text-[11px] text-indigo-200 leading-relaxed animate-in fade-in slide-in-from-top-2">
            <div className="font-black mb-2 flex items-center gap-2 uppercase tracking-widest">
              <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse"></span>
              AI Report:
            </div>
            {explanation}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResourceCard;
