import { Rollable } from '@hive-force/dice';
import { CreatureAsset } from "@hive-force/assets";


export class Action {
    public name: string;
    public execute(
      currentPlayer?: CreatureAsset,
      characters?: Array<CreatureAsset>,
      rollable?: Rollable
    ): void {}
  }

  export class BonusAction extends Action {}