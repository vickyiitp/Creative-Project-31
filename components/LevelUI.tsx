import React, { useState, useEffect } from 'react';
import { Level } from '../types';
import { ELEMENTS } from '../constants';
import { getMoleculeFact } from '../services/gemini';
import { Microscope, ArrowRight, BrainCircuit, Info } from 'lucide-react';

interface LevelUIProps {
  level: Level;
  isComplete: boolean;
  onNextLevel: () => void;
}

export const LevelUI: React.FC<LevelUIProps> = ({ level, isComplete, onNextLevel }) => {
  const [fact, setFact] = useState<string | null>(null);
  const [loadingFact, setLoadingFact] = useState(false);

  useEffect(() => {
    setFact(null);
    if (isComplete) {
      setLoadingFact(true);
      getMoleculeFact(level.moleculeName, level.formula)
        .then(f => {
            setFact(f);
            setLoadingFact(false);
        })
        .catch(() => setLoadingFact(false));
    }
  }, [isComplete, level]);

  return (
    <div className="flex flex-col h-full gap-6">
      {/* Level Header */}
      <div className="relative overflow-hidden glass-card p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300">
        <div className="absolute top-2 right-2 p-4 opacity-5 animate-float pointer-events-none">
            <Microscope size={100} />
        </div>
        
        <div className="relative z-10">
           <div className="flex items-center gap-2 mb-2">
             <span className="px-2.5 py-0.5 bg-indigo-50/80 backdrop-blur-sm text-indigo-700 text-[10px] font-bold rounded-full uppercase tracking-wider border border-indigo-100">
               Level {level.id}
             </span>
           </div>
           
           <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-1">{level.moleculeName}</h2>
           <p className="text-lg font-mono text-indigo-500 font-medium mb-4">{level.formula}</p>
           <p className="text-sm text-slate-600 leading-relaxed border-l-4 border-indigo-200 pl-3">
             {level.description}
           </p>
        </div>
      </div>

      {/* Atoms Available */}
      <div className="bg-white/40 backdrop-blur-sm p-4 rounded-xl border border-slate-200/60">
         <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
            Available Atoms
            <div className="h-px bg-slate-200 flex-grow"></div>
         </h3>
         <div className="flex flex-wrap gap-3">
           {level.atoms.map((type, i) => (
             <div key={i} className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-slate-200 shadow-sm hover:-translate-y-0.5 transition-transform duration-200 cursor-default">
                <div 
                  className="w-4 h-4 rounded-full border border-black/10 shadow-inner"
                  style={{ backgroundColor: ELEMENTS[type].color }}
                ></div>
                <span className="text-xs font-bold text-slate-700">{ELEMENTS[type].name}</span>
             </div>
           ))}
        </div>
      </div>

      {/* Completion State */}
      <div className="flex-grow">
      {isComplete ? (
        <div className="h-full flex flex-col justify-between animate-fade-in-up">
          <div className="p-6 bg-gradient-to-br from-green-50/80 to-emerald-50/80 backdrop-blur-md border border-green-200 rounded-2xl shadow-sm">
             <div className="flex items-center gap-3 mb-4">
                 <div className="p-2 bg-green-500 rounded-full text-white shadow-lg shadow-green-200 animate-pulse-slow">
                   <Microscope size={20} />
                 </div>
                 <h3 className="text-lg font-bold text-green-900">Analysis Complete</h3>
             </div>

             <div className="relative bg-white/60 backdrop-blur-sm p-4 rounded-xl border border-green-100 mb-6 min-h-[100px] shadow-sm">
                <div className="flex items-center gap-2 mb-2 text-indigo-600">
                   <BrainCircuit size={16} />
                   <span className="text-[10px] font-bold uppercase tracking-widest">AI Insight</span>
                </div>
                {loadingFact ? (
                  <div className="space-y-2 animate-pulse">
                    <div className="h-3 bg-indigo-100 rounded w-3/4"></div>
                    <div className="h-3 bg-indigo-100 rounded w-full"></div>
                    <div className="h-3 bg-indigo-100 rounded w-5/6"></div>
                  </div>
                ) : (
                  <p className="text-sm text-slate-700 leading-relaxed italic">
                    "{fact}"
                  </p>
                )}
             </div>

             <button 
                onClick={onNextLevel}
                className="w-full group py-3.5 bg-slate-900 hover:bg-indigo-600 text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-300 shadow-lg hover:shadow-indigo-200 hover:-translate-y-0.5"
             >
                <span>Next Experiment</span>
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
             </button>
          </div>
        </div>
      ) : (
        <div className="h-full flex flex-col items-center justify-center p-6 text-center text-slate-400 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/30">
           <Info size={32} className="mb-2 opacity-50" />
           <p className="text-sm">Connect all atoms correctly to proceed.</p>
        </div>
      )}
      </div>
    </div>
  );
};