import { CreatureAsset, Effect } from '@hive-force/assets';

export class Action {
  public name: string;
  public creaturesEffected: Array<CreatureEffected> = [];
  public requiresAttackAction: boolean;
  public disabled: boolean;

  public execute(
    currentPlayer?: CreatureAsset,
    characters?: Array<CreatureAsset>
  ):
    | Array<CreatureEffected>
    | CreatureEffected
    | CreatureAsset
    | boolean
    | void {
    return false;
  }

  public isBonusActionAvailable(player: CreatureAsset) {
    if (player.attributes.bonusActionsRemaining > 0) {
      player.attributes.bonusActionsRemaining--;
    } else {
      console.log('You have no Bonus Action Remaining');
      return;
    }
  }
}

export class CreatureEffected {
  creature: CreatureAsset;
  effected: true;
  effect?: Effect;
}

export class ConsumableAction extends Action {
  public consumeAction: (quantity?: number) => void;
}

export class BonusAction extends ConsumableAction {}

export class NonPlayableAction extends Action {
  public effects: string;
}
