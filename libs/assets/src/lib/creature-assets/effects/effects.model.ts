import { Action } from '../actions/action.model';
import { CreatureAsset } from '../creature.asset';

export interface Effect {
    name: string;
    description: string;
    duration: number;
    startTime: string;
    endTime: string;
    affects: string[];
  
    applyRule: (attacker?: CreatureAsset, attackee?: CreatureAsset, action?: Action) => void
    removeRule: (attacker?: CreatureAsset, attackee?: CreatureAsset, action?: Action) => void
    check: () => void
  }