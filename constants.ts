import { ElementDef, ElementType, Level } from './types';

export const ELEMENTS: Record<ElementType, ElementDef> = {
  H: {
    symbol: 'H',
    name: 'Hydrogen',
    color: '#FFFFFF', // White
    radius: 20,
    maxBonds: 1,
    mass: 1,
  },
  O: {
    symbol: 'O',
    name: 'Oxygen',
    color: '#EF4444', // Red-500
    radius: 30,
    maxBonds: 2,
    mass: 16,
  },
  C: {
    symbol: 'C',
    name: 'Carbon',
    color: '#171717', // Neutral-900 (Blackish)
    radius: 32,
    maxBonds: 4,
    mass: 12,
  },
  N: {
    symbol: 'N',
    name: 'Nitrogen',
    color: '#3B82F6', // Blue-500
    radius: 30,
    maxBonds: 3,
    mass: 14,
  },
};

export const LEVELS: Level[] = [
  {
    id: 1,
    name: "Level 1",
    moleculeName: "Molecular Hydrogen",
    formula: "H₂",
    description: "The simplest molecule. Bond two Hydrogen atoms.",
    atoms: ['H', 'H'],
    targetBonds: 1,
  },
  {
    id: 2,
    name: "Level 2",
    moleculeName: "Water",
    formula: "H₂O",
    description: "Life's essential solvent. One Oxygen, two Hydrogens.",
    atoms: ['H', 'O', 'H'],
    targetBonds: 2,
  },
  {
    id: 3,
    name: "Level 3",
    moleculeName: "Methane",
    formula: "CH₄",
    description: "The primary component of natural gas.",
    atoms: ['C', 'H', 'H', 'H', 'H'],
    targetBonds: 4,
  },
  {
    id: 4,
    name: "Level 4",
    moleculeName: "Ammonia",
    formula: "NH₃",
    description: "A common nitrogenous waste product.",
    atoms: ['N', 'H', 'H', 'H'],
    targetBonds: 3,
  },
  {
    id: 5,
    name: "Level 5",
    moleculeName: "Carbon Dioxide",
    formula: "CO₂",
    description: "Double bonds are tricky! (Simulated as single connections here for puzzle simplicity, but topologically similar).",
    atoms: ['O', 'C', 'O'],
    targetBonds: 2, // In this simple engine, we count connections. CO2 linear structure O-C-O is 2 connections.
  },
];

export const PHYSICS = {
  DRAG: 0.92, // Air resistance
  ELASTICITY: 0.6, // Bounce
  BOND_DISTANCE: 70, // Ideal distance between bonded atoms
  SNAP_DISTANCE: 90, // Distance to trigger snap
  REPEL_FORCE: 1.5,
  BOND_STRENGTH: 0.05, // Spring constant
};
