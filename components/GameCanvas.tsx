import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Atom, Level } from '../types';
import { ELEMENTS, PHYSICS } from '../constants';
import { RefreshCw, MousePointer2 } from 'lucide-react';

interface GameCanvasProps {
  level: Level;
  onLevelComplete: () => void;
  onReset: () => void;
}

const generateId = () => Math.random().toString(36).substr(2, 9);

export const GameCanvas: React.FC<GameCanvasProps> = ({ level, onLevelComplete, onReset }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const atomsRef = useRef<Atom[]>([]);
  const requestRef = useRef<number>();
  const [draggedAtomId, setDraggedAtomId] = useState<string | null>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const isLevelCompleteRef = useRef(false);
  const hoveredAtomIdRef = useRef<string | null>(null);
  const timeRef = useRef(0);

  // Constants for Internal Resolution
  const INTERNAL_WIDTH = 800;
  const INTERNAL_HEIGHT = 500;

  useEffect(() => {
    isLevelCompleteRef.current = false;
    const cx = INTERNAL_WIDTH / 2;
    const cy = INTERNAL_HEIGHT / 2;
    
    atomsRef.current = level.atoms.map((type, index) => {
      const angle = (index / level.atoms.length) * Math.PI * 2;
      const dist = 120; // Initial spread
      return {
        id: generateId(),
        type,
        x: cx + Math.cos(angle) * dist + (Math.random() - 0.5) * 60,
        y: cy + Math.sin(angle) * dist + (Math.random() - 0.5) * 60,
        vx: 0,
        vy: 0,
        bonds: [],
        isDragging: false,
      };
    });
  }, [level, onReset]);

  // Physics Loop
  const update = useCallback(() => {
    timeRef.current += 0.02;
    const atoms = atomsRef.current;
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Physics Logic
    atoms.forEach(atom => {
      if (atom.isDragging) {
        atom.vx = (mouseRef.current.x - atom.x) * 0.25;
        atom.vy = (mouseRef.current.y - atom.y) * 0.25;
        atom.x = mouseRef.current.x;
        atom.y = mouseRef.current.y;
      } else {
        atom.vx *= PHYSICS.DRAG;
        atom.vy *= PHYSICS.DRAG;
        
        // Slight ambient float
        if (atom.bonds.length === 0) {
           atom.vx += Math.sin(timeRef.current + atom.x) * 0.01;
           atom.vy += Math.cos(timeRef.current + atom.y) * 0.01;
        }

        atom.x += atom.vx;
        atom.y += atom.vy;

        const r = ELEMENTS[atom.type].radius;
        if (atom.x < r) { atom.x = r; atom.vx *= -1 * PHYSICS.ELASTICITY; }
        if (atom.x > INTERNAL_WIDTH - r) { atom.x = INTERNAL_WIDTH - r; atom.vx *= -1 * PHYSICS.ELASTICITY; }
        if (atom.y < r) { atom.y = r; atom.vy *= -1 * PHYSICS.ELASTICITY; }
        if (atom.y > INTERNAL_HEIGHT - r) { atom.y = INTERNAL_HEIGHT - r; atom.vy *= -1 * PHYSICS.ELASTICITY; }
      }
    });

    // Interactions & Bonding
    for (let i = 0; i < atoms.length; i++) {
      for (let j = i + 1; j < atoms.length; j++) {
        const a = atoms[i];
        const b = atoms[j];
        
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist === 0) continue;

        const isBonded = a.bonds.includes(b.id);
        const elementA = ELEMENTS[a.type];
        const elementB = ELEMENTS[b.type];
        const minDist = elementA.radius + elementB.radius;

        if (isBonded) {
          const force = (dist - PHYSICS.BOND_DISTANCE) * PHYSICS.BOND_STRENGTH;
          const fx = (dx / dist) * force;
          const fy = (dy / dist) * force;

          if (!a.isDragging) { a.vx += fx / elementA.mass; a.vy += fy / elementA.mass; }
          if (!b.isDragging) { b.vx -= fx / elementB.mass; b.vy -= fy / elementB.mass; }
        } else {
          if (dist < minDist) {
            const overlap = minDist - dist;
            const fx = (dx / dist) * overlap * 0.5;
            const fy = (dy / dist) * overlap * 0.5;
             if (!a.isDragging) { a.x -= fx; a.y -= fy; a.vx -= fx * 0.1; a.vy -= fy * 0.1;}
             if (!b.isDragging) { b.x += fx; b.y += fy; b.vx += fx * 0.1; b.vy += fy * 0.1;}
          }
          
          if (dist < PHYSICS.SNAP_DISTANCE && dist > minDist * 0.5) {
            const aFree = a.bonds.length < elementA.maxBonds;
            const bFree = b.bonds.length < elementB.maxBonds;

            if (aFree && bFree) {
              if (!a.isDragging && !b.isDragging) {
                 a.bonds.push(b.id);
                 b.bonds.push(a.id);
              }
            } else {
               if (dist < PHYSICS.SNAP_DISTANCE * 0.8) {
                   const force = PHYSICS.REPEL_FORCE;
                   const fx = -(dx / dist) * force;
                   const fy = -(dy / dist) * force;
                   if (!a.isDragging) { a.vx += fx; a.vy += fy; }
                   if (!b.isDragging) { b.vx -= fx; b.vy -= fy; }
               }
            }
          }
        }
      }
    }

    // Render
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, INTERNAL_WIDTH, INTERNAL_HEIGHT);
      
      // -- Blueprint Grid Background --
      ctx.strokeStyle = '#e2e8f0'; // slate-200
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 6]); // Dashed lines
      
      // Major lines
      for(let x=0; x<INTERNAL_WIDTH; x+=100) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x, INTERNAL_HEIGHT); ctx.stroke(); }
      for(let y=0; y<INTERNAL_HEIGHT; y+=100) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(INTERNAL_WIDTH,y); ctx.stroke(); }
      
      // Minor lines (fainter)
      ctx.strokeStyle = '#f1f5f9'; // slate-100
      for(let x=0; x<INTERNAL_WIDTH; x+=25) { if(x%100===0) continue; ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x, INTERNAL_HEIGHT); ctx.stroke(); }
      for(let y=0; y<INTERNAL_HEIGHT; y+=25) { if(y%100===0) continue; ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(INTERNAL_WIDTH,y); ctx.stroke(); }
      
      ctx.setLineDash([]); // Reset dash

      // -- Bonds --
      ctx.lineCap = 'round';
      atoms.forEach(atom => {
        atom.bonds.forEach(targetId => {
          if (atom.id < targetId) {
             const target = atoms.find(t => t.id === targetId);
             if (target) {
               // Bond Shadow/Glow
               ctx.shadowBlur = 10;
               ctx.shadowColor = 'rgba(99, 102, 241, 0.4)'; // Indigo glow

               const grad = ctx.createLinearGradient(atom.x, atom.y, target.x, target.y);
               grad.addColorStop(0, '#94a3b8');
               grad.addColorStop(0.5, '#cbd5e1'); // Highlight in middle
               grad.addColorStop(1, '#94a3b8');
               
               ctx.beginPath();
               ctx.strokeStyle = grad;
               ctx.lineWidth = 10;
               ctx.moveTo(atom.x, atom.y);
               ctx.lineTo(target.x, target.y);
               ctx.stroke();

               // Inner Bond Detail
               ctx.shadowBlur = 0;
               ctx.beginPath();
               ctx.strokeStyle = 'rgba(255,255,255,0.4)';
               ctx.lineWidth = 3;
               ctx.moveTo(atom.x, atom.y);
               ctx.lineTo(target.x, target.y);
               ctx.stroke();
             }
          }
        });
      });

      // -- Atoms --
      atoms.forEach(atom => {
        const def = ELEMENTS[atom.type];
        const isHovered = hoveredAtomIdRef.current === atom.id;
        const isDragging = atom.isDragging;

        // Shadow
        ctx.beginPath();
        ctx.fillStyle = isDragging ? 'rgba(0,0,0,0.1)' : 'rgba(0,0,0,0.2)';
        const shadowY = isDragging ? 20 : 5;
        const shadowScale = isDragging ? 0.9 : 1;
        ctx.ellipse(atom.x, atom.y + def.radius * 0.8 + shadowY, def.radius * shadowScale, def.radius * 0.4 * shadowScale, 0, 0, Math.PI * 2);
        ctx.fill();

        // -- 3D Sphere Rendering --
        
        // 1. Base Fill & Gradient
        const grad = ctx.createRadialGradient(
            atom.x - def.radius * 0.3, 
            atom.y - def.radius * 0.3, 
            def.radius * 0.1, 
            atom.x, 
            atom.y, 
            def.radius
        );
        grad.addColorStop(0, isHovered ? '#ffffff' : '#f8fafc'); // Highlight color
        grad.addColorStop(0.2, def.color);
        grad.addColorStop(1, '#0f172a'); // Dark shadow edge

        ctx.beginPath();
        ctx.arc(atom.x, atom.y, def.radius, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        
        // Hover Glow Effect
        if (isHovered) {
            ctx.shadowColor = def.color;
            ctx.shadowBlur = 20;
        } else {
            ctx.shadowBlur = 0;
        }
        
        ctx.fill();
        ctx.shadowBlur = 0; // Reset

        // 2. Specular Highlight (The "shiny plastic" look)
        ctx.beginPath();
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.ellipse(atom.x - def.radius*0.3, atom.y - def.radius*0.3, def.radius*0.25, def.radius*0.15, Math.PI/4, 0, Math.PI*2);
        ctx.fill();

        // 3. Rim Light (Bottom Right)
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.lineWidth = 2;
        ctx.arc(atom.x, atom.y, def.radius * 0.9, 0.5 * Math.PI, 0); // Bottom right arc
        ctx.stroke();

        // 4. Text Label
        ctx.fillStyle = atom.type === 'H' ? '#1e293b' : '#ffffff';
        ctx.font = `bold ${def.radius}px 'JetBrains Mono'`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        // Subtle drop shadow for text visibility
        ctx.shadowColor = 'rgba(0,0,0,0.5)';
        ctx.shadowBlur = 2;
        ctx.fillText(def.symbol, atom.x, atom.y + 2);
        ctx.shadowBlur = 0;
      });
    }

    // Win Condition Logic
    if (!isLevelCompleteRef.current) {
        let totalBonds = 0;
        atoms.forEach(a => totalBonds += a.bonds.length);
        totalBonds /= 2;
        
        if (totalBonds === level.targetBonds) {
           const visited = new Set<string>();
           if (atoms.length > 0) {
             const queue = [atoms[0].id];
             visited.add(atoms[0].id);
             
             let head = 0;
             while(head < queue.length) {
                 const currId = queue[head++];
                 const currAtom = atoms.find(a => a.id === currId);
                 if(currAtom) {
                     currAtom.bonds.forEach(b => {
                         if(!visited.has(b)) {
                             visited.add(b);
                             queue.push(b);
                         }
                     });
                 }
             }
           }
           
           if (visited.size === atoms.length) {
               isLevelCompleteRef.current = true;
               onLevelComplete();
           }
        }
    }

    requestRef.current = requestAnimationFrame(update);
  }, [level, onLevelComplete]);

  // Coordinate Mapping
  const getCanvasCoordinates = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = INTERNAL_WIDTH / rect.width;
    const scaleY = INTERNAL_HEIGHT / rect.height;
    return {
        x: (clientX - rect.left) * scaleX,
        y: (clientY - rect.top) * scaleY
    };
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault(); 
    const { x, y } = getCanvasCoordinates(e.clientX, e.clientY);

    for (let i = atomsRef.current.length - 1; i >= 0; i--) {
        const atom = atomsRef.current[i];
        const r = ELEMENTS[atom.type].radius;
        const dx = x - atom.x;
        const dy = y - atom.y;
        if (dx*dx + dy*dy < r*r * 2) {
            atom.isDragging = true;
            atom.vx = 0;
            atom.vy = 0;
            setDraggedAtomId(atom.id);
            // Bring to front
            const [moved] = atomsRef.current.splice(i, 1);
            atomsRef.current.push(moved);
            break;
        }
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    e.preventDefault();
    const { x, y } = getCanvasCoordinates(e.clientX, e.clientY);
    mouseRef.current = { x, y };

    // Hover Detection
    let hovered = null;
    for (let i = atomsRef.current.length - 1; i >= 0; i--) {
        const atom = atomsRef.current[i];
        const r = ELEMENTS[atom.type].radius;
        const dx = x - atom.x;
        const dy = y - atom.y;
        if (dx*dx + dy*dy < r*r) {
            hovered = atom.id;
            break;
        }
    }
    hoveredAtomIdRef.current = hovered;
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    e.preventDefault();
    atomsRef.current.forEach(a => a.isDragging = false);
    setDraggedAtomId(null);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(update);
    return () => {
        if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [update]);

  return (
    <div className="relative w-full h-full bg-white/50 overflow-hidden group rounded-2xl border border-slate-200 shadow-inner">
      <canvas
        ref={canvasRef}
        width={INTERNAL_WIDTH}
        height={INTERNAL_HEIGHT}
        className="w-full h-full object-contain cursor-grab active:cursor-grabbing touch-none select-none"
        style={{ maxWidth: '100%', maxHeight: '100%' }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      />

      {/* Helper Indicators */}
      <div className="absolute top-4 right-4 flex gap-2 transition-opacity opacity-50 hover:opacity-100">
         <button 
           onClick={onReset}
           className="p-2 bg-white/80 backdrop-blur-sm border border-slate-200 shadow-sm rounded-lg text-slate-600 hover:text-indigo-600 hover:border-indigo-200 transition-all hover:scale-105"
           title="Reset Atoms"
         >
           <RefreshCw size={20} />
         </button>
      </div>
      
      {!draggedAtomId && (
          <div className="absolute bottom-4 left-0 w-full text-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <span className="bg-slate-900/10 text-slate-600 text-xs px-3 py-1 rounded-full backdrop-blur-sm border border-white/20">
                  <MousePointer2 size={12} className="inline mr-1" />
                  Drag atoms to connect
              </span>
          </div>
      )}
    </div>
  );
};