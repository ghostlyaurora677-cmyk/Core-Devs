
import React, { useState } from 'react';
import { ThemeType, FeedbackCategory, Feedback } from '../types';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: ThemeType;
  onSubmit: (feedback: Feedback) => void;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose, theme, onSubmit }) => {
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [type, setType] = useState<FeedbackCategory>('SUGGESTION');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsSubmitting(true);
    
    const newFeedback: Feedback = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      message,
      timestamp: new Date().toISOString(),
      themeAtTime: theme
    };

    // Simulate network delay
    setTimeout(() => {
      onSubmit(newFeedback);
      setIsSubmitting(false);
      setStep('success');
    }, 1000);
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setStep('form');
      setMessage('');
      setType('SUGGESTION');
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center px-6">
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-md animate-in fade-in duration-300" 
        onClick={handleClose}
      ></div>
      
      <div className={`relative w-full max-w-xl rounded-[3rem] p-10 md:p-14 border shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-10 duration-500 overflow-hidden ${
        theme === 'black' ? 'bg-[#0a0a0a] border-white/10' : 
        theme !== 'light' ? 'bg-[#161a23] border-white/5' : 
        'bg-white border-slate-200'
      }`}>
        
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-[var(--brand-color)] blur-md opacity-50"></div>

        {step === 'form' ? (
          <>
            <div className="text-center mb-10">
              <h3 className={`text-4xl font-black mb-4 uppercase tracking-tighter ${theme !== 'light' ? 'text-white' : 'text-slate-900'}`}>
                Share <span className="text-[var(--brand-color)]">Feedback</span>
              </h3>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.2em]">Help us improve the CORE DEVS hub</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-3 gap-3">
                {(['SUGGESTION', 'BUG', 'OTHER'] as FeedbackCategory[]).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setType(t)}
                    className={`py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                      type === t 
                        ? 'bg-[var(--brand-color)] border-[var(--brand-color)] text-white shadow-lg' 
                        : theme !== 'light' 
                          ? 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10' 
                          : 'bg-slate-50 border-slate-100 text-slate-500 hover:bg-white shadow-sm'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              <div className="relative group">
                <label className="absolute -top-3 left-6 px-2 bg-inherit text-[9px] font-black text-slate-500 uppercase tracking-widest z-10">Your Message</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us what's on your mind..."
                  className={`w-full h-40 rounded-[2rem] p-8 text-sm outline-none border transition-all resize-none font-medium ${
                    theme !== 'light' 
                      ? 'bg-white/5 border-white/10 text-white placeholder:text-slate-600 focus:border-[var(--brand-color)]' 
                      : 'bg-slate-50 border-slate-100 text-slate-900 placeholder:text-slate-400 focus:border-[var(--brand-color)]'
                  }`}
                  required
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={handleClose}
                  className={`flex-1 py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${
                    theme !== 'light' ? 'text-slate-500 hover:text-white' : 'text-slate-400 hover:text-slate-900'
                  }`}
                >
                  Dismiss
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !message.trim()}
                  className={`flex-[2] py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-xl flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${
                    isSubmitting 
                      ? 'bg-slate-500 text-white cursor-wait' 
                      : 'bg-[var(--brand-color)] text-white hover:opacity-90'
                  }`}
                >
                  {isSubmitting ? 'Processing...' : 'Submit Report'}
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="text-center py-10 animate-in fade-in zoom-in duration-500">
            <div className="w-24 h-24 bg-emerald-500/10 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 shadow-[0_0_50px_rgba(16,185,129,0.2)]">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className={`text-4xl font-black mb-4 tracking-tighter ${theme !== 'light' ? 'text-white' : 'text-slate-900'}`}>THANK YOU</h3>
            <p className="text-slate-500 text-sm font-bold uppercase tracking-widest mb-12">Your feedback has been logged to our cluster.</p>
            <button
              onClick={handleClose}
              className={`w-full py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${
                theme !== 'light' ? 'bg-white/5 text-white hover:bg-white/10' : 'bg-slate-900 text-white hover:bg-slate-800 shadow-xl'
              }`}
            >
              Back to Hub
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedbackModal;
