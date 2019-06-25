import { Rollable } from "@hive-force/dice"

export class Item {
    public id: string;
    public name: string;
    public description: string;
  }
  
export class RollableItem extends Item implements Rollable {
   public diceEquation: string;
}

export class Weopon extends RollableItem {
    public strengthRequiremnt?: number;
    public type?: 'Meele' | 'Ranged' | 'Finess';
  }
  