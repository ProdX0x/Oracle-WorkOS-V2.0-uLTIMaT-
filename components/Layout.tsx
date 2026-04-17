import React, { ReactNode } from 'react';
import { User } from '../types';
import { GLASS_CLASSES } from '../constants';
import { LayoutDashboard, Kanban, Target, MessageSquare, LogOut, Command, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface LayoutProps {
  children: ReactNode;
  user: User;
  onLogout: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  toggleCmd: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, user, onLogout, activeTab, setActiveTab, toggleCmd }) => {
  const NavItem = ({ id, icon: Icon, label }: { id: string, icon: any, label: string }) => {
    const isActive = activeTab === id;
    return (
      <button
        onClick={() => setActiveTab(id)}
        className={`flex flex-col md:flex-row items-center md:space-x-3 p-2 md:px-4 md:py-3 rounded-xl transition-all w-full relative group ${isActive ? 'bg-white/10 text-white' : 'text-white/50 hover:text-white hover:bg-white/5'}`}
      >
        {isActive && (
          <motion.div 
            layoutId="nav-active"
            className="absolute inset-0 bg-white/10 rounded-xl -z-10"
            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
          />
        )}
        <Icon size={20} className={isActive ? "text-oracle-blue" : "group-hover:text-oracle-blue transition-colors"} />
        <span className="text-[10px] md:text-sm font-medium mt-1 md:mt-0">{label}</span>
      </button>
    );
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col md:flex-row text-white overflow-hidden bg-black selection:bg-oracle-purple/30">
      
      {/* Ambient Background Blobs */}
      <motion.div 
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.2, 0.3, 0.2] 
        }}
        transition={{ duration: 10, repeat: Infinity }}
        className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-oracle-blue/20 rounded-full blur-[120px] pointer-events-none" 
      />
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.4, 0.2] 
        }}
        transition={{ duration: 15, repeat: Infinity, delay: 2 }}
        className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-oracle-purple/20 rounded-full blur-[120px] pointer-events-none" 
      />

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 h-screen p-4 z-20 border-r border-white/5 bg-black/40 backdrop-blur-xl">
        <div className="mb-8 px-4 py-2">
          <div className="flex items-center space-x-2 mb-1">
             <Star className="text-oracle-purple fill-oracle-purple" size={18} />
             <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
               Oracle WorkOS
             </h1>
          </div>
          <span className="text-xs text-white/30 tracking-widest block pl-7">V2.0 FORTR3SS</span>
        </div>

        <nav className="flex-1 space-y-2">
          <NavItem id="dashboard" icon={LayoutDashboard} label="Dashboard" />
          <NavItem id="kanban" icon={Kanban} label="Kanban" />
          <NavItem id="strategy" icon={Target} label="Strategy" />
          <NavItem id="chat" icon={MessageSquare} label="Comm Channel" />
        </nav>

        <div className="mt-auto pt-4 border-t border-white/5">
          <div className="flex items-center space-x-3 px-2 mb-4">
             <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 border border-white/20 flex items-center justify-center text-xs font-bold text-oracle-blue">
               {user.name.charAt(0)}
             </div>
             <div className="flex-1 overflow-hidden">
               <p className="text-sm truncate font-medium">{user.name}</p>
               <p className="text-[10px] uppercase tracking-tighter text-white/40 truncate">{user.role}</p>
             </div>
          </div>
          <button onClick={onLogout} className="w-full flex items-center space-x-2 px-4 py-2 text-xs text-red-400 hover:bg-red-500/10 rounded-lg transition-colors group">
            <LogOut size={14} className="group-hover:-translate-x-1 transition-transform" />
            <span>Disconnect</span>
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 w-full h-16 bg-black/60 backdrop-blur-xl border-b border-white/10 z-30 flex items-center justify-between px-4">
         <span className="font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">Oracle V2</span>
         <button onClick={onLogout} className="text-xs text-white/50 flex items-center space-x-1">
            <LogOut size={14} />
            <span>Exit</span>
         </button>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 relative h-screen overflow-y-auto overflow-x-hidden pt-16 md:pt-0 pb-20 md:pb-0 z-10 scroll-smooth">
        <div className="max-w-7xl mx-auto p-4 md:p-8">
          {/* Smart Command Trigger (Floating) */}
          <div className="fixed bottom-24 right-4 md:bottom-8 md:right-8 z-40">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleCmd}
              className="flex items-center justify-center w-12 h-12 md:w-auto md:h-auto md:px-5 md:py-3 bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 rounded-full md:rounded-2xl shadow-2xl shadow-purple-500/20 transition-all"
            >
              <Command size={18} className="text-oracle-purple" />
              <span className="hidden md:inline ml-3 text-sm font-bold tracking-wide uppercase">Oracle</span>
              <kbd className="hidden md:flex ml-3 px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] text-white/30 font-sans">⌘K</kbd>
            </motion.button>
          </div>

          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 w-full h-20 bg-black/80 backdrop-blur-2xl border-t border-white/10 z-30 flex justify-around items-start pt-2 pb-6 px-2 safe-area-bottom">
        <NavItem id="dashboard" icon={LayoutDashboard} label="Dash" />
        <NavItem id="kanban" icon={Kanban} label="Work" />
        <NavItem id="strategy" icon={Target} label="Strat" />
        <NavItem id="chat" icon={MessageSquare} label="Chat" />
      </nav>

    </div>
  );
};

export default Layout;