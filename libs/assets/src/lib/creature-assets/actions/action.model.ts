import { Effect } from '../effects/effects.model';

import { MasterLog } from '@hive-force/log';
import { Item } from '@hive-force/items';
import { CreatureAsset } from '../creature.asset';
import { TextAnimation, ActionAnimation } from '@hive-force/animations';
import { RelativePositionCell } from '@hive-force/maps';


export class Action {
  public name: string
  public creaturesEffect: CreaturesEffect
  public requiresAttackAction: boolean
  public executeAsBonusAction: boolean
  public executeAsReaction: boolean
  public executeWithoutAction: boolean
  public disabled: boolean
  public actionType: string
  public overcomes: string[]
  public selected: boolean
  public subActions: Array<Action> = []
  public iconUrl: string
  public performanceAnimation: ActionAnimation
  public effectAnimation: ActionAnimation 
  public range: number
  public areaOfEffect: {[key: string]: RelativePositionCell }

  constructor(public usedFor?: string) { }

  public execute(
    player?: CreatureAsset,
    creature?: CreatureAsset | Array<CreatureAsset>,
    item?: Item
  ):
    | Array<CreaturesEffect>
    | CreaturesEffect
    | CreatureAsset
    | boolean
    | void {
    return false;
  }

  public isBonusActionAvailable(player: CreatureAsset) {
    if (player.attributes.bonusActionsRemaining > 0) {
      player.attributes.bonusActionsRemaining--;
    } else {
      MasterLog.log('You have no Bonus Action Remaining!!!');
      return;
    }
  }

  public onSubActionSelect(subAction: Action): void {
    this.subActions.forEach(a => {
      a.selected = false
    })
    subAction.selected = true
  }
}

export class CreaturesEffect {
  creature: CreatureAsset;
  effected: boolean;
  effect?: Effect;
  animationText?: TextAnimation

}

export class ConsumableAction extends Action {
  public consumeAction: (quantity?: number) => void;
}

export class BonusAction extends ConsumableAction {}

export class NonPlayableAction extends Action {
  public effects: string;
}
