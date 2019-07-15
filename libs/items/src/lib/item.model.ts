import { Rollable } from '@hive-force/dice';
import { CreatureAsset } from '@hive-force/assets';
import { createReadStream } from 'fs';

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
  public type?: 'Versatile' | 'Ranged' | 'Finesse' | 'Brute';
  public damageType?: "Slashing" | "Bludgeoning" | "Piercing" | "Magical"
  public overcomes?: string[];

  public checkIfOvercomes(name: string, creature: CreatureAsset): boolean {
    const immunity = creature.attributes.immunities.find(i => i === name);
    const resistance = creature.attributes.resistances.find(r => r === name);

    return (immunity || resistance) === name;
  }
}
