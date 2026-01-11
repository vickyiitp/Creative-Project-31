import React, { useState, useEffect } from 'react';
import { GameCanvas } from './components/GameCanvas';
import { LevelUI } from './components/LevelUI';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ErrorBoundary } from './components/ErrorBoundary';
import { LEVELS } from './constants';
import { X } from 'lucide-react';

interface ModalProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

// Simple Modal Component
const Modal: React.FC<ModalProps> = ({ title, onClose, children }) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in-up">
    <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[80vh] overflow-y-auto border border-slate-100">
      <div className="flex justify-between items-center p-6 border-b border-slate-100 sticky top-0 bg-white z-10">
        <h3 className="text-xl font-bold text-slate-900">{title}</h3>
        <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X size={20} /></button>
      </div>
      <div className="p-6 text-slate-600 leading-relaxed">
        {children}
      </div>
    </div>
  </div>
);

export default function App() {
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [isLevelComplete, setIsLevelComplete] = useState(false);
  const [gameKey, setGameKey] = useState(0);
  const [modalContent, setModalContent] = useState<{title: string, content: React.ReactNode} | null>(null);

  // Scroll to top on level change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentLevelIndex]);

  const currentLevel = LEVELS[currentLevelIndex];

  const handleLevelComplete = () => {
    if (!isLevelComplete) setIsLevelComplete(true);
  };

  const handleNextLevel = () => {
    if (currentLevelIndex < LEVELS.length - 1) {
      setCurrentLevelIndex(prev => prev + 1);
      setIsLevelComplete(false);
      setGameKey(prev => prev + 1);
    } else {
      setModalContent({
        title: "Course Completed!",
        content: (
          <div className="text-center">
            <p className="mb-4">Congratulations! You have mastered the fundamental covalent bonds.</p>
            <button 
              onClick={() => {
                setCurrentLevelIndex(0);
                setIsLevelComplete(false);
                setGameKey(prev => prev + 1);
                setModalContent(null);
              }}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium shadow-md hover:shadow-lg transition-all"
            >
              Restart Course
            </button>
          </div>
        )
      });
    }
  };

  const handleReset = () => {
      setGameKey(prev => prev + 1);
      setIsLevelComplete(false);
  };

  const openInfoModal = (title: string) => {
    let content: React.ReactNode = <p>Content coming soon.</p>;
    
    if (title === 'How to Play') {
      content = (
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Goal:</strong> Connect all atoms to form the target molecule shown at the top.</li>
          <li><strong>Controls:</strong> Drag atoms with your mouse or finger.</li>
          <li><strong>Bonding:</strong> Move compatible atoms close together to snap them into a bond.</li>
          <li><strong>Valence Rules:</strong> Atoms only bond if they have free electrons (e.g., Carbon needs 4 bonds).</li>
          <li><strong>Repulsion:</strong> If a bond is invalid (too many connections), atoms will repel each other.</li>
        </ul>
      );
    } else if (title === 'Privacy Policy' || title === 'Terms of Service') {
      content = <p>This is a demonstration application. No personal data is collected, stored, or processed. Enjoy the game freely!</p>;
    }

    setModalContent({ title, content });
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-slate-50 bg-dot-pattern text-slate-900 flex flex-col font-sans">
        <Navbar onReset={handleReset} />

        <main className="flex-grow w-full max-w-7xl mx-auto px-4 py-8">
          <div className="glass-card rounded-3xl shadow-xl shadow-slate-200/50 overflow-hidden flex flex-col lg:flex-row min-h-[650px]">
            
            {/* Game Canvas Area */}
            <div className="relative flex-grow bg-white/50 lg:border-r border-slate-200/60 min-h-[400px] lg:min-h-auto">
              <GameCanvas 
                key={gameKey} 
                level={currentLevel} 
                onLevelComplete={handleLevelComplete}
                onReset={handleReset}
              />
            </div>

            {/* Side Panel */}
            <aside className="w-full lg:w-[400px] p-6 md:p-8 bg-white/60 backdrop-blur-md flex flex-col border-t lg:border-t-0 border-slate-200/60">
               <LevelUI 
                 level={currentLevel}
                 isComplete={isLevelComplete}
                 onNextLevel={handleNextLevel}
               />
               
               {/* Quick Rules Legend */}
               <div className="mt-8 pt-6 border-t border-slate-200/60">
                 <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Valence Reference</h4>
                 <div className="grid grid-cols-2 gap-3">
                   {[
                     { name: 'Hydrogen', symbol: 'H', bonds: 1, color: 'bg-white border-slate-200' },
                     { name: 'Oxygen', symbol: 'O', bonds: 2, color: 'bg-red-500 text-white' },
                     { name: 'Nitrogen', symbol: 'N', bonds: 3, color: 'bg-blue-500 text-white' },
                     { name: 'Carbon', symbol: 'C', bonds: 4, color: 'bg-slate-900 text-white' },
                   ].map(el => (
                     <div key={el.symbol} className="flex items-center justify-between p-2 rounded-lg bg-white/80 border border-slate-200 hover:scale-105 transition-transform cursor-help shadow-sm">
                        <div className="flex items-center gap-2">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shadow-sm border ${el.color}`}>
                            {el.symbol}
                          </div>
                          <span className="text-xs font-medium text-slate-600">{el.name}</span>
                        </div>
                        <span className="text-xs font-mono font-bold text-slate-400">{el.bonds} bonds</span>
                     </div>
                   ))}
                 </div>
               </div>
            </aside>
          </div>
        </main>

        <Footer onOpenModal={openInfoModal} />

        {modalContent && (
          <Modal title={modalContent.title} onClose={() => setModalContent(null)}>
            {modalContent.content}
          </Modal>
        )}
      </div>
    </ErrorBoundary>
  );
}