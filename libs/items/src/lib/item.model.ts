import { Rollable } from '@hive-force/dice';
import { CreatureAsset } from '@hive-force/assets';

export class Item {
  public id: string;
  public name: string;
  public description: string;
  public use: string;
  public equipped: boolean;
  public selected?: boolean;
}

export class RollableItem extends Item implements Rollable {
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
  public modifier?: string

  public checkIfOvercomes(creature: CreatureAsset): boolean {
    let immunity
    let resistance
    this.overcomes.forEach(overcome => {
      immunity = creature.attributes.immunities.find(i => i === overcome);
      resistance = creature.attributes.resistances.find(r => r === overcome);
    })

    return immunity || resistance;
  }
}
