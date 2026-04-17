import React, { useState, useEffect } from 'react';
import { GLASS_CLASSES } from '../constants';
import { smartCommandInterpreter } from '../services/geminiService';
import { motion, AnimatePresence } from 'motion/react';
import { Terminal, Sparkles, Search, HelpCircle, Navigation } from 'lucide-react';

interface SmartCommandProps {
  isOpen: boolean;
  onClose: () => void;
}

const SmartCommand: React.FC<SmartCommandProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestion, setSuggestion] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setLoading(true);
    setSuggestion(null);
    try {
      const result = await smartCommandInterpreter(query);
      setSuggestion(`Oracle suggests: ${result}`);
    } catch (err) {
      setSuggestion("Operation failed. Neural link unstable.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-md" 
            onClick={onClose} 
          />
          
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className={`relative w-full max-w-2xl ${GLASS_CLASSES.BASE} rounded-3xl p-6 overflow-hidden shadow-[0_0_50px_rgba(168,85,247,0.15)]`}
          >
            <div className="flex items-center space-x-4 border-b border-white/10 pb-6">
              <div className="bg-oracle-purple/20 p-2 rounded-xl border border-oracle-purple/30">
                <Terminal className="text-oracle-purple" size={24} />
              </div>
              <form onSubmit={handleSubmit} className="flex-1">
                <input
                  autoFocus
                  type="text"
                  placeholder="Intercepting neural frequency... (What is your command?)"
                  className="w-full bg-transparent text-xl text-white placeholder-white/10 focus:outline-none font-medium selection:bg-oracle-purple/50"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </form>
              <div className="flex items-center space-x-1">
                <kbd className="px-2 py-1 rounded bg-white/5 border border-white/10 text-[10px] text-white/30 font-sans shadow-inner">ESC</kbd>
              </div>
            </div>

            <div className="mt-6 min-h-[140px] flex flex-col">
              {loading ? (
                <div className="flex-1 flex items-center justify-center space-x-3 text-white/40 italic">
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <Sparkles size={20} className="text-oracle-purple" />
                  </motion.div>
                  <span className="text-sm tracking-widest font-bold uppercase">Processing Directive...</span>
                </div>
              ) : suggestion ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex-1 flex flex-col items-center justify-center space-y-4 p-4 rounded-2xl bg-oracle-emerald/5 border border-oracle-emerald/20"
                >
                  <Sparkles size={32} className="text-oracle-emerald" />
                  <p className="text-oracle-emerald text-lg font-bold text-center tracking-wide">{suggestion}</p>
                </motion.div>
              ) : (
                <div className="flex-1">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 mb-4 px-2">Knowledge Base Templates</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <button onClick={() => setQuery("Create high priority task in Engineering")} className="flex items-center space-x-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/20 transition-all text-left group">
                      <Search size={14} className="text-oracle-blue group-hover:scale-110 transition-transform" />
                      <span className="text-xs text-white/60">"Create high priority task"</span>
                    </button>
                    <button onClick={() => setQuery("Summarize my current workload")} className="flex items-center space-x-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/20 transition-all text-left group">
                      <Terminal size={14} className="text-oracle-purple group-hover:scale-110 transition-transform" />
                      <span className="text-xs text-white/60">"Summarize workload"</span>
                    </button>
                    <button onClick={() => setQuery("Who is SOS in Engineering?")} className="flex items-center space-x-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/20 transition-all text-left group">
                      <HelpCircle size={14} className="text-oracle-amber group-hover:scale-110 transition-transform" />
                      <span className="text-xs text-white/60">"Help identification"</span>
                    </button>
                    <button onClick={() => setQuery("Navigate to Strategy dashboard")} className="flex items-center space-x-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/20 transition-all text-left group">
                      <Navigation size={14} className="text-oracle-emerald group-hover:scale-110 transition-transform" />
                      <span className="text-xs text-white/60">"System navigation"</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default SmartCommand;