import { Dice } from '@hive-force/dice';

export class Skill {
  public bonus: number;

  constructor(
    public name: string,
    public skillLevel: number,
    public modifier: number,
    public proficient: boolean
  ) {}

  public rollSkillCheck(hasAdvantage: boolean, hasDisadvantage): any {
    const dice = new Dice();
    dice.withAdvantage = hasAdvantage;
    dice.withDisadvantage = hasDisadvantage;
    dice.roll(`d20+${this.modifier}`);
  }
}
