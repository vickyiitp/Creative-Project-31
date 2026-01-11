import React, { useState } from 'react';
import { Atom, Menu, X, ExternalLink } from 'lucide-react';

interface NavbarProps {
    onReset: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onReset }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 glass-card border-b border-slate-200/50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <div className="flex items-center gap-2 group cursor-pointer" onClick={onReset}>
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-md shadow-indigo-200 group-hover:rotate-180 transition-transform duration-500">
            <Atom size={20} />
          </div>
          <span className="font-bold text-slate-900 tracking-tight">Covalent<span className="text-indigo-600">Bonds</span></span>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          <a href="#" className="relative text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-[-4px] after:left-0 after:bg-indigo-600 after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left">Home</a>
          
          <button onClick={onReset} className="relative text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-[-4px] after:left-0 after:bg-indigo-600 after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left">Restart Level</button>
          
          <a href="https://vickyiitp.tech" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors group">
            Portfolio <ExternalLink size={14} className="group-hover:-translate-y-0.5 transition-transform" />
          </a>
          
          <a 
            href="https://github.com/vickyiitp" 
            target="_blank" 
            rel="noopener noreferrer"
            className="px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-all hover:shadow-lg active:scale-95"
          >
            Developer
          </a>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-white/95 backdrop-blur-lg border-b border-slate-200 shadow-xl py-4 px-4 flex flex-col gap-4 animate-fade-in-up">
           <a href="#" className="text-slate-600 font-medium py-2 border-b border-slate-50">Home</a>
           <button onClick={() => { onReset(); setIsOpen(false); }} className="text-left text-slate-600 font-medium py-2 border-b border-slate-50">Restart Level</button>
           <a href="https://vickyiitp.tech" target="_blank" rel="noopener noreferrer" className="text-slate-600 font-medium py-2 border-b border-slate-50 flex items-center justify-between">
              Portfolio <ExternalLink size={16} />
           </a>
           <a 
             href="https://github.com/vickyiitp"
             target="_blank"
             rel="noopener noreferrer" 
             className="text-center w-full py-3 bg-slate-900 text-white font-medium rounded-lg"
           >
             Visit Developer Profile
           </a>
        </div>
      )}
    </nav>
  );
};