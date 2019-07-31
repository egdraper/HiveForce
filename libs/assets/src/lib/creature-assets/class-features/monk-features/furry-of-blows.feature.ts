
import { MonkFeature } from './monk.feature';
import { StunnedEffect } from '../../effects/stunned.effect';
import { CreaturesEffect, Action, AttackAction } from '../../actions';

import { Subject } from 'rxjs';
import { MasterLog } from '@hive-force/log';
import { Weapon } from '@hive-force/items';
import { CreatureAsset } from '../../creature.asset';
import { Monk } from '../../class/monk.class';

export class FurryOFBlows extends MonkFeature {
  public name = 'Furry of Blows';
  public startLevel = 3;
  public executeAsBonusAction = true;

  private alreadyUsedOpenHandAsBonusAction = false

  constructor(private performance: Subject<Action[]>) {
    super();
  }

  public execute(player?: CreatureAsset, creature?: CreatureAsset): void {
    this.checkDependencies(player, creature);
    this.performBonusAction(player, creature);
    player.attributes.actionsPerformed.push(this);
    this.performance.next(player.attributes.actionsPerformed)
  }

  public checkDependencies(
    player: CreatureAsset,
    creature: CreatureAsset
  ): boolean {
    const action = player.attributes.actionsPerformed.find (
      ap => ap.name === 'Attack'
    );

    if (!action && (
       player.attributes.actionsRemaining === 0 ||
       player.attributes.bonusActionsRemaining === 0)
    ) {
      MasterLog.log('You have no Actions Remaining!!!', 'WARNING');
      return false;
    }

    if (!action) {
      MasterLog.log('Attack action required for Furry of Blows');
      new AttackAction().execute(player, creature);
      MasterLog.log("--------------")
    }

    if(player.attributes.actionsPerformed.find(ap => ap.name === "Unarmed Strike")) {
      this.alreadyUsedOpenHandAsBonusAction = true
    }
  }

  public performBonusAction(
    player: CreatureAsset,
    creature: CreatureAsset
  ): void {
    const unarmed = player.inventory.find(a => a.name === 'Fist');
    const mainWeapon = player.selectItem(unarmed as Weapon);
    let effect1: CreaturesEffect
    let effect2: CreaturesEffect

    if (!this.useKi(player as Monk)) {
      return;
    }

    if(!this.alreadyUsedOpenHandAsBonusAction) {
      const attack1 = new AttackAction("Furry Of Blows");
      attack1.executeAsBonusAction = true;
      effect1 = attack1.execute(player, creature);
      MasterLog.log("--------------")
    }
    
    const attack2 = new AttackAction("Furry Of Blows");
    attack2.executeAsBonusAction = true;
    effect2 = attack2.execute(player, creature);
    MasterLog.log("--------------")

    player.selectItem(mainWeapon as Weapon);
    player.attributes.bonusActionsRemaining--;

    const unarmedHit = player.attributes.actionsPerformed.find(a => {
        return (a.usedFor === "Unarmed Strike" && a.creaturesEffect.effected)
    
      })

    if(!!unarmedHit || (effect1 && effect1.effected) || effect2.effected ) {
      const subAction = this.subActions.find(a => a.selected)
      subAction.execute(player, creature)
    }  

    this.disabled = true;
  }
}

export class KnockProne extends Action {
  public name = "Knock Prone"
  execute(player: CreatureAsset, creature: CreatureAsset): void {
    const saved = creature.savingThrow(10 + player.attributes.wisdomModifier + player.attributes.dexterityModifier, "dexterity")    
 
    if(!saved) {
      creature.applyEffects(new StunnedEffect(creature))
      MasterLog.log("Creature has been knocked prone")
    }
  }
}

export class DisableReaction extends Action {
  public name = "Disable Reaction"
  execute(player: CreatureAsset, creature: CreatureAsset): void {
    // TODO Disable Reaction somehow
  }
}

export class KnockBack extends Action {
  public name = "Knock Back"
  execute(player: CreatureAsset, creature: CreatureAsset): void {
    const saved = creature.savingThrow(100 + player.attributes.wisdomModifier + player.attributes.dexterityModifier, "strength")

    if(!saved) {
      if(player.cell.x === creature.cell.x) {
        if(player.cell.y > creature.cell.y) {
          this.moveBack(creature, "up", "down")
        }
        if(player.cell.y < creature.cell.y) {
          this.moveBack(creature, "down", "up")
        }
      }
      if(player.cell.y === creature.cell.y) {
        if(player.cell.x > creature.cell.x) {
          this.moveBack(creature, "left", "right")
        }
        if(player.cell.x < creature.cell.x) {
          this.moveBack(creature, "right", "left")
        }
      }
      if(player.cell.y !== creature.cell.y && player.cell.x !== creature.cell.x) {
        
      }
      MasterLog.log("Creature was knocked Back")
    }
  }

  private moveBack(creature: CreatureAsset, direction: string, creatureFacing: string): void {
    for(let i = 0; i < 3; i++) {
      creature.moveCharacter(direction, creature.cell.neighbors[0], [], creatureFacing)
    }         
  }
}


