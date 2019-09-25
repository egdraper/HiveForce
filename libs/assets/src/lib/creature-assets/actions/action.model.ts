import { Effect } from '../effects/effects.model';

import { MasterLog } from '@hive-force/log';
import { Item, Weapon } from '@hive-force/items';
import { CreatureAsset } from '../creature.asset';
import { TextAnimation, ActionAnimation, Engine, ActionAnimationService, AnimatingWeapon } from '@hive-force/animations';
import { RelativePositionCell } from '@hive-force/spells';

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

  public setupAction(player: CreatureAsset, animationService: ActionAnimationService) {
    const item = player.getSelectedItem() as AnimatingWeapon
    item.strikeAnimation.presetAnimation(animationService.animation)
    item.hitAnimation.presetAnimation(animationService.animation)
  }
  
  public async executeAction(
    engine: Engine,
    creature: CreatureAsset,
    selectedCreatures: Array<CreatureAsset>,
    animationService: ActionAnimationService): Promise<any> { 
    
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
      } else {
        animationService.animate(this.performanceAnimation)
      }

      if(selectedCreature.attributes.currentHitPoints <= 0) {
        selectedCreature.activeSprite = selectedCreature.sprite["death"]
      }
      if(results) {

        
        // actionAnimation = action.effectAnimation
        // selectedCreature.sprite.performingAction = true
        
        // actionAnimation.run(engine, creature.location.cell, selectedCreature.location.cell)
        // selectedCreature.sprite.performingAction = false  
        // textAnimation = results.animationText
        
        // textAnimation.locY = selectedCreature.location.cell.posY
        // results.animationText.run(engine, selectedCreature.location.cell)
   
      }
             
      MasterLog.log("\n")
    });

    creature.attributes.actions.forEach(a => a.selected = false)
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
