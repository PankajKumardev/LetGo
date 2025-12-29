export enum RitualStage {
  WRITING = 'WRITING',
  BURNING = 'BURNING',
  BREATHING = 'BREATHING',
  REVEAL = 'REVEAL',
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
  type: 'fire' | 'spark' | 'ember';
}