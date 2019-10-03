import { Effect } from '../effects/effects.model';

import { MasterLog } from '@hive-force/log';
import { Item, Weapon } from '@hive-force/items';
import { CreatureAsset } from '../creature.asset';
import { TextAnimation, ActionAnimation, Engine, ActionAnimationService, AnimatingWeapon, TextAnimationService } from '@hive-force/animations';
import { RelativePositionCell } from '@hive-force/spells';

export abstract class Action {
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

  public onSubActionSelect(subAction: Action): void {
    this.subActions.forEach(a => {
      a.selected = false
    })
    subAction.selected = true
  }

  public setupAction(player: CreatureAsset, animationService: ActionAnimationService) {
    const item = player.getSelectedItem() as AnimatingWeapon
    item.strikeAnimation.presetAnimation(animationService.animation)
    item.hitAnimation.presetAnimation(animationService.animation)
  }
  
  public async executeAction(
    creature: CreatureAsset,
    selectedCreatures: Array<CreatureAsset>,
    animationService: ActionAnimationService,
    textAnimationService?: TextAnimationService): Promise<any> { 
    
    selectedCreatures.forEach(async (selectedCreature) => {
      // this.adjustMovement() // this is for
      const results = this.execute(creature, selectedCreature) as CreaturesEffect

      this.performanceAnimation.location = creature.location.cell
      this.effectAnimation.location = selectedCreature.location.cell

      if(results && results.effected) {
        await animationService.sequenceAnimations([
          this.performanceAnimation,
          results.effected ? this.effectAnimation : null
        ])

        textAnimationService.animate(results.text, "red", results.animationText, selectedCreature.location.cell)
      } else {
        animationService.animate(this.performanceAnimation)
      }

      if(selectedCreature.attributes.currentHitPoints <= 0) {
        selectedCreature.activeSprite = selectedCreature.sprite["death"]
      }
             
      MasterLog.log("\n")
    });

    creature.attributes.actions.forEach(a => a.selected = false)
  }

}

export class CreaturesEffect {
  creature: CreatureAsset;
  effected: boolean;
  text?: string;
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
