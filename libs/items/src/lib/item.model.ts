import { ActionAnimation } from '@hive-force/animations';

export class Item {
  public id: string;
  public name: string;
  public description: string;
  public use: string;
  public equipped: boolean;
  public selected?: boolean;
}

export class RollableItem extends Item {
  public diceEquation: string;
}

export class Weapon extends RollableItem {
  public weaponType?: 
    'versatile' | 
    'ranged' | 
    'finesse' | 
    'heavy' |
    'light' |
    'ammunition' |
    'loading' |
    'rang' |
    'reach' |
    'special' |
    'twoHanded' |
    'improvised' |
    'silvered' |
    'lance' |
    'net' |
    'none'
  public damageType?: "Slashing" | "Bludgeoning" | "Piercing" | "Magical"
  public attackType?: "magical" | "nonmagical"
  public overcomes?: string[] = []
  public ranged?: boolean
  public range?: number
  public modifier?: string
  public strikeAnimation?: ActionAnimation
  public hitAnimation?: ActionAnimation
}
