import React, { useState, useEffect } from 'react';
import { User, SystemConfig } from './types';
import { db } from './services/mockDatabase';
import { GLASS_CLASSES } from './constants';
import Layout from './components/Layout';
import KanbanBoard from './components/KanbanBoard';
import SmartCommand from './components/SmartCommand';
import { ShieldAlert, Zap, Lock, Mail, ChevronRight, Activity, Database, Cpu, Target, MessageSquare } from 'lucide-react';
import { motion } from 'motion/react';

// --- MAIN APP ---

const App: React.FC = () => {
  const [config, setConfig] = useState<SystemConfig | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('kanban');
  const [showCmd, setShowCmd] = useState(false);
  
  // Login State
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check system status on mount
    const sysConfig = db.getConfig();
    setConfig(sysConfig);
    const session = db.getSession();
    if (session) setUser(session);

    // Command palette shortcut
    const handleGlobalKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowCmd(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleGlobalKey);
    return () => window.removeEventListener('keydown', handleGlobalKey);
  }, []);

  const handleInitialize = async () => {
    setLoading(true);
    // Simulate setup delay
    setTimeout(async () => {
      const newUser = await db.initializeSystem(email);
      setUser(newUser);
      setConfig({ isInitialized: true, version: '2.0' });
      setLoading(false);
    }, 2000);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const loggedUser = await db.login(email);
      setUser(loggedUser);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    db.logout();
    setUser(null);
  };

  // --- VIEWS ---

  if (!config) return null; // Loading

  // 1. FIRST RUN WIZARD
  if (!config.isInitialized) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-black relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
        <motion.div 
          animate={{ opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-oracle-blue/10 rounded-full blur-[120px]" 
        />

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`relative z-10 max-w-lg w-full p-10 rounded-[40px] ${GLASS_CLASSES.BASE}`}
        >
          <div className="text-center mb-10">
            <motion.div 
              initial={{ rotate: -10, scale: 0.5 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="inline-flex p-4 rounded-3xl bg-oracle-blue/20 mb-6"
            >
              <Zap className="text-oracle-blue fill-oracle-blue" size={40} />
            </motion.div>
            <h1 className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-[length:200%_auto] animate-gradient mb-3">Oracle WorkOS V2.0</h1>
            <p className="text-[10px] uppercase tracking-[0.4em] text-white/40">Neural Network Initialization</p>
          </div>

          <div className="space-y-8">
            <div className="grid grid-cols-3 gap-4">
               <div className="bg-white/5 p-3 rounded-2xl border border-white/5 flex flex-col items-center">
                  <Database size={16} className="text-oracle-blue mb-2" />
                  <span className="text-[9px] font-bold text-white/40 uppercase">Firestore</span>
               </div>
               <div className="bg-white/5 p-3 rounded-2xl border border-white/5 flex flex-col items-center">
                  <Activity size={16} className="text-oracle-emerald mb-2" />
                  <span className="text-[9px] font-bold text-white/40 uppercase">Runtime</span>
               </div>
               <div className="bg-white/5 p-3 rounded-2xl border border-white/5 flex flex-col items-center">
                  <Cpu size={16} className="text-oracle-purple mb-2" />
                  <span className="text-[9px] font-bold text-white/40 uppercase">Gemini IA</span>
               </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase font-black text-white/30 tracking-widest pl-2">Admin Identity (Email)</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-black/40 border border-white/10 text-white placeholder-white/10 focus:outline-none focus:ring-1 focus:ring-oracle-blue transition-all"
                  placeholder="master@yoda.force"
                />
              </div>
            </div>

            <button 
              onClick={handleInitialize}
              disabled={loading || !email}
              className={`w-full relative overflow-hidden group py-4 rounded-2xl bg-gradient-to-r from-oracle-blue to-oracle-purple text-white font-bold tracking-widest uppercase text-xs shadow-[0_0_30px_rgba(59,130,246,0.3)] transition-all active:scale-[0.98] ${loading ? 'opacity-50' : ''}`}
            >
              <div className="relative z-10 flex items-center justify-center space-x-2">
                {loading ? (
                   <>
                     <Activity size={16} className="animate-spin" />
                     <span>Warming neural cores...</span>
                   </>
                ) : (
                  <>
                    <span>Initialize Fortr3ss</span>
                    <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </div>
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // 2. LOGIN SCREEN (If initialized but no user)
  if (!user) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-black relative">
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.1)_0,transparent_70%)]"></div>
         
         <motion.div 
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           className={`relative z-10 w-full max-w-sm p-10 rounded-[40px] ${GLASS_CLASSES.BASE}`}
         >
            <div className="flex justify-center mb-8">
               <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                 <Lock className="text-oracle-amber" size={32} />
               </div>
            </div>
            <h2 className="text-2xl font-black text-center mb-2 text-white tracking-tight">Access Restricted</h2>
            <p className="text-center text-[10px] text-white/30 uppercase tracking-[0.3em] mb-8">Identification Required</p>

            {error && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-300 text-[10px] font-bold uppercase tracking-wide flex items-center gap-3"
              >
                <ShieldAlert size={16} />
                {error}
              </motion.div>
            )}
            
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="relative">
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-6 pr-6 py-4 rounded-2xl bg-black/40 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:ring-1 focus:ring-oracle-amber transition-all"
                  placeholder="Identity (Email)"
                />
              </div>
              <div className="relative">
                <input 
                  type="password" 
                  className="w-full pl-6 pr-6 py-4 rounded-2xl bg-black/40 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:ring-1 focus:ring-oracle-amber transition-all"
                  placeholder="Neural Passkey"
                />
              </div>
              <button 
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold tracking-widest uppercase text-xs transition-all active:scale-[0.98]"
              >
                {loading ? 'Authenticating...' : 'Enter Sanctuary'}
              </button>
            </form>
            <p className="mt-8 text-center text-[9px] text-white/20 uppercase tracking-[0.4em]">Oracle Intranet • Port 3000</p>
         </motion.div>
      </div>
    );
  }

  // 3. MAIN APP
  const sectors = db.getSectors();

  return (
    <Layout 
      user={user} 
      onLogout={handleLogout} 
      activeTab={activeTab} 
      setActiveTab={setActiveTab}
      toggleCmd={() => setShowCmd(true)}
    >
      <SmartCommand isOpen={showCmd} onClose={() => setShowCmd(false)} />
      
      {activeTab === 'dashboard' && (
        <div className="space-y-8 pb-10">
           <header className="flex justify-between items-end border-b border-white/5 pb-8">
             <div>
               <h2 className="text-4xl font-black text-white tracking-tighter">Dashboard</h2>
               <p className="text-white/30 text-sm mt-2 font-medium">Status: Neural Link Sustained</p>
             </div>
             <div className="text-right">
               <div className="text-3xl font-black text-oracle-emerald tabular-nums">98.2%</div>
               <div className="text-[10px] font-black uppercase tracking-widest text-white/20 mt-1">System Integrity</div>
             </div>
           </header>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div 
                whileHover={{ y: -5 }}
                className={`p-8 rounded-[32px] ${GLASS_CLASSES.BASE} border-oracle-blue/10`}
              >
                <div className="flex items-center space-x-3 text-white/40 mb-4">
                   <Activity size={16} />
                   <h3 className="text-[10px] font-black uppercase tracking-widest">Active Tasks</h3>
                </div>
                <div className="text-5xl font-black text-white">04</div>
              </motion.div>
              
              <motion.div 
                whileHover={{ y: -5 }}
                className={`p-8 rounded-[32px] ${GLASS_CLASSES.BASE} border-red-500/10 group`}
              >
                <div className="flex items-center space-x-3 text-red-400 mb-4">
                   <ShieldAlert size={16} className="animate-pulse" />
                   <h3 className="text-[10px] font-black uppercase tracking-widest">Team SOS</h3>
                </div>
                <div className="text-5xl font-black text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.3)]">01</div>
              </motion.div>

              <motion.div 
                whileHover={{ y: -5 }}
                className={`p-8 rounded-[32px] ${GLASS_CLASSES.BASE} border-oracle-purple/10`}
              >
                <div className="flex items-center space-x-3 text-oracle-purple mb-4">
                   <Zap size={16} />
                   <h3 className="text-[10px] font-black uppercase tracking-widest">Strategy</h3>
                </div>
                <div className="text-5xl font-black text-oracle-blue">A+</div>
              </motion.div>
           </div>
        </div>
      )}

      {activeTab === 'kanban' && (
        <div className="h-full flex flex-col space-y-8">
          <header className="flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-black tracking-tight">Operations</h2>
              <p className="text-white/20 text-xs font-bold uppercase tracking-widest mt-1">Sectorized Trello Protocol</p>
            </div>
          </header>
          
          <KanbanBoard sectors={sectors} />
        </div>
      )}

      {activeTab === 'strategy' && (
         <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
            <div className="p-10 rounded-full bg-white/5 border border-white/5">
              <Target size={60} className="text-oracle-purple opacity-20" />
            </div>
            <h2 className="text-2xl font-bold opacity-30">Strategy Sector Locked</h2>
            <p className="text-white/20 text-sm max-w-sm">This sector requires Super Admin clearance or a valid Gemini Strategic Token to unlock.</p>
         </div>
      )}

      {activeTab === 'chat' && (
         <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
            <div className="p-10 rounded-full bg-white/5 border border-white/5">
              <MessageSquare size={60} className="text-oracle-blue opacity-20" />
            </div>
            <h2 className="text-2xl font-bold opacity-30">Comm Channel Offline</h2>
            <p className="text-white/20 text-sm max-w-sm">Establishing Peer-to-Peer encrypted tunnel... Estimated time: 2.5 cycles.</p>
         </div>
      )}
    </Layout>
  );
};

export default App;