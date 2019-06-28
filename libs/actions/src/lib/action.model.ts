import { CreatureAsset } from "@hive-force/assets"

export class Action {
    public name: string;
    public creaturesEffected: Array<CreatureEffected> = []
    
    public execute(
      currentPlayer?: CreatureAsset,
      characters?: Array<CreatureAsset>,
    ): Array<CreatureEffected> | CreatureEffected | CreatureAsset | boolean | void { return false }
  }

  export class CreatureEffected {
    creature: CreatureAsset
    effected: true
    effect?: Effect
  }

  export class Effect {
    name: string
  }

  export class ConsumableAction extends Action {
    public consumeAction: (quantity?: number ) => void
  }

  export class BonusAction extends ConsumableAction { }

  export class NonPlayableAction extends Action { 
    public effects: string
  }