export type ElementType = 'H' | 'O' | 'C' | 'N';

export interface ElementDef {
  symbol: ElementType;
  name: string;
  color: string;
  radius: number;
  maxBonds: number; // Valence electrons capacity for bonding
  mass: number;
}

export interface Atom {
  id: string;
  type: ElementType;
  x: number;
  y: number;
  vx: number;
  vy: number;
  bonds: string[]; // IDs of connected atoms
  isDragging: boolean;
}

export interface Level {
  id: number;
  name: string;
  formula: string;
  description: string;
  atoms: ElementType[]; // Atoms available in the "pool"
  targetBonds: number; // Simplified win condition: total number of bonds in the system
  moleculeName: string;
}

export interface GameState {
  currentLevelId: number;
  isComplete: boolean;
  score: number;
}