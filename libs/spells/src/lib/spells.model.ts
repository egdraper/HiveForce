import { Rollable } from "@hive-force/dice"

export class Spell {
    public id: string;
    public name: string;
    public description: string;
    public levels: string[];
  }

  export class RollableSpell extends Spell implements Rollable {
    public diceEquation: string;
  }

  export class AttackSpell extends RollableSpell {

}