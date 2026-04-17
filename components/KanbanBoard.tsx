import React, { useState, useEffect } from 'react';
import { Task, TaskStatus, Sector, HelpStatus } from '../types';
import { db } from '../services/mockDatabase';
import { GLASS_CLASSES } from '../constants';
import { analyzeTaskWithGemini } from '../services/geminiService';
import { Sparkles, AlertTriangle, ChevronRight, MoreHorizontal, User as UserIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface KanbanBoardProps {
  sectors: Sector[];
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ sectors }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [analyzingId, setAnalyzingId] = useState<string | null>(null);

  useEffect(() => {
    setTasks(db.getTasks());
  }, []);

  const handleSOS = async (task: Task) => {
    const updatedTask = { 
      ...task, 
      helpStatus: task.helpStatus === HelpStatus.NONE ? HelpStatus.OPEN : HelpStatus.NONE 
    };
    await db.saveTask(updatedTask);
    setTasks(db.getTasks()); // Refresh
  };

  const handleAnalyze = async (task: Task) => {
    setAnalyzingId(task.id);
    try {
      const result = await analyzeTaskWithGemini(task.title, task.description);
      
      const updatedTask: Task = {
        ...task,
        impactScore: result.impactScore,
        effortScore: result.effortScore,
        strategicTheme: result.strategicTheme,
        aiRationale: result.rationale
      };
      
      await db.saveTask(updatedTask);
      setTasks(db.getTasks());
    } finally {
      setAnalyzingId(null);
    }
  };

  const Column = ({ status, label }: { status: TaskStatus, label: string }) => {
    const columnTasks = tasks.filter(t => t.status === status);

    return (
      <div className="flex-1 min-w-[300px] flex flex-col space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-white/10 px-2">
          <h3 className="font-bold text-white/50 tracking-widest uppercase text-[10px]">{label}</h3>
          <span className="bg-white/5 border border-white/10 px-2 py-0.5 rounded-full text-[10px] text-white/40">{columnTasks.length}</span>
        </div>
        
        <div className="space-y-4 px-2 min-h-[500px]">
          <AnimatePresence mode="popLayout">
            {columnTasks.map(task => {
              const sector = sectors.find(s => s.id === task.sectorId);
              const isAnalyzing = analyzingId === task.id;

              return (
                <motion.div 
                  layout
                  key={task.id} 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  whileHover={{ y: -4 }}
                  className={`group relative p-5 rounded-2xl transition-all duration-300 ${GLASS_CLASSES.BASE} hover:border-white/20`}
                >
                  
                  {/* Sector Tag */}
                  <div className="flex justify-between items-start mb-3">
                     <div className="flex items-center space-x-2">
                       <span className={`w-1.5 h-1.5 rounded-full ${sector?.color || 'bg-gray-500'} shadow-[0_0_8px_rgba(59,130,246,0.5)]`} />
                       <span className="text-[9px] font-bold uppercase tracking-wider text-white/30">{sector?.name || 'General'}</span>
                     </div>
                     {task.helpStatus === HelpStatus.OPEN && (
                       <motion.div 
                         initial={{ opacity: 0 }}
                         animate={{ opacity: 1 }}
                         className="flex items-center space-x-1 bg-red-500/10 text-red-400 px-2 py-0.5 rounded border border-red-500/20"
                       >
                         <AlertTriangle size={10} className="animate-pulse" />
                         <span className="text-[9px] font-bold uppercase">SOS</span>
                       </motion.div>
                     )}
                  </div>

                  <h4 className="font-semibold text-white mb-1.5 leading-snug group-hover:text-oracle-blue transition-colors">{task.title}</h4>
                  <p className="text-xs text-white/40 line-clamp-2 mb-4 font-light">{task.description}</p>

                  {/* AI & Progress Section */}
                  {task.isSystemTask && task.progress !== undefined && (
                     <div className="mb-4 bg-white/5 p-2 rounded-xl border border-white/5">
                       <div className="flex justify-between text-[9px] font-bold text-white/30 mb-1.5 uppercase tracking-tighter">
                         <span className="flex items-center gap-1"><Sparkles size={10} /> Auto-Evolution</span>
                         <span>{task.progress}%</span>
                       </div>
                       <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                         <motion.div 
                           initial={{ width: 0 }}
                           animate={{ width: `${task.progress}%` }}
                           className="h-full bg-gradient-to-r from-oracle-blue to-oracle-purple transition-all duration-1000"
                         />
                       </div>
                     </div>
                  )}

                  {/* AI Scores (if analyzed) */}
                  {task.impactScore !== undefined && (
                    <motion.div 
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="grid grid-cols-2 gap-3 mb-4 bg-black/40 p-3 rounded-xl border border-white/5"
                    >
                      <div className="text-center">
                        <div className="text-[9px] font-bold text-white/20 uppercase tracking-widest mb-1">Impact</div>
                        <div className="text-lg font-black text-oracle-emerald">{task.impactScore}</div>
                      </div>
                      <div className="text-center border-l border-white/10">
                        <div className="text-[9px] font-bold text-white/20 uppercase tracking-widest mb-1">Effort</div>
                        <div className="text-lg font-black text-oracle-amber">{task.effortScore}</div>
                      </div>
                      {task.aiRationale && (
                         <div className="col-span-2 text-[10px] text-white/40 italic border-t border-white/5 pt-2 mt-1 leading-relaxed">
                           <span className="text-oracle-purple opacity-60">"</span>
                           {task.aiRationale}
                           <span className="text-oracle-purple opacity-60">"</span>
                         </div>
                      )}
                    </motion.div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-3 border-t border-white/5">
                     <div className="flex space-x-2">
                       <button 
                          onClick={() => handleAnalyze(task)} 
                          disabled={isAnalyzing}
                          className={`flex items-center space-x-1 px-2 py-1 rounded-lg text-[10px] font-bold uppercase transition-all ${isAnalyzing ? 'bg-oracle-purple/20 text-oracle-purple animate-pulse' : 'hover:bg-oracle-purple/10 text-oracle-purple/60 hover:text-oracle-purple'}`} 
                       >
                         <Sparkles size={12} />
                         <span>{isAnalyzing ? 'Analyzing...' : 'Analyze'}</span>
                       </button>
                     </div>
                     
                     <div className="flex items-center space-x-1">
                        <button 
                          onClick={() => handleSOS(task)}
                          className={`p-2 rounded-lg transition-all ${task.helpStatus === HelpStatus.OPEN ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 'hover:bg-white/5 text-white/30 hover:text-white'}`}
                        >
                          <AlertTriangle size={14} />
                        </button>
                        <button className="p-2 hover:bg-white/5 rounded-lg text-white/20 hover:text-white transition-all">
                          <MoreHorizontal size={14} />
                        </button>
                     </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-nowrap overflow-x-auto space-x-8 pb-12 min-h-[600px] scrollbar-hide">
      <Column status={TaskStatus.TODO} label="Protocol: Pending" />
      <Column status={TaskStatus.IN_PROGRESS} label="Executing" />
      <Column status={TaskStatus.REVIEW} label="Refinement" />
      <Column status={TaskStatus.DONE} label="Archived" />
    </div>
  );
};

export default KanbanBoard;