export interface Rollable {
    diceEquation: string;
  }

  export class Roll {
    public actualRollValue = 0;
    public modifiedRollValue = 0;
    public hasAdvantage = false;
    public hasDisadvantage = false;
  }
  
  export class DiceEquation {
    constructor(
      public numberOfSides: number,
      public numberOfRolls: number,
      public rollModifier: number,
      public stringFormat: string
    ) {}
  }