import { Rollable } from "@hive-force/dice"

export class Item {
    public id: string;
    public name: string;
    public description: string;
    public use: string
    public equipped: boolean
    public selected?: boolean
  }
  
export class RollableItem extends Item implements Rollable {
   public diceEquation: string;
}

export class Weapon extends RollableItem {
    public type?: 'Versatile' | 'Ranged' | 'Finesse' | "Brute";
  }
  