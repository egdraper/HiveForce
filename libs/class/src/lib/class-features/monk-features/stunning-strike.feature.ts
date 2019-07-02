import { AttackAction, CreaturesEffect } from '@hive-force/actions';
import { CreatureAsset } from '@hive-force/assets';
import { StunnedEffect, MonkFeature } from './monk.feature';
import { MasterLog } from '@hive-force/log';

export class StunningStrike extends MonkFeature {
  public name = 'Stunning Strike';
  public startLevel = 5;
  public usesBonusAction = false;
  public disabled = false;

  public execute(
    player?: CreatureAsset,
    creature?: CreatureAsset
  ): boolean {
    this.disabled = true
    
    if(this.checkDependencies(player)) {
      return this.performAction(player, creature)
    }
    return false
  }

  public checkDependencies(player: CreatureAsset): boolean {
    // Checks Ki

    // Finds finds if all attacks have missed
    const missed = player.attributes.actionsPerformed.filter(
      ap => ap.name === 'Attack' && !ap.creaturesEffect.effected && !ap.executeAsBonusAction
    );

    if(missed && player.attributes.attacksRemaining === 0) {
      MasterLog.log("All Attacks Actions Missed, A hit was required", "WARNING")
      return false
    } 

    if (!this.useKi(player)) {
      return false;
    }

    return true
  }

  public performAction(player: CreatureAsset, creature: CreatureAsset): boolean {
    let effectedCreature: CreaturesEffect;
    
    // Checks if a hit has already happened
    const action = player.attributes.actionsPerformed.find(
      ap => ap.name === 'Attack' && ap.creaturesEffect.effected && !ap.executeAsBonusAction
    );

    if (action && action.creaturesEffect.effected) {
      effectedCreature = action.creaturesEffect;
    } else {
      // If at least one hit remains and no hit has taken place, it will perform an attack.
      const attackAction = new AttackAction();
      effectedCreature = attackAction.execute(player, creature);

      if(!effectedCreature.effected && player.attributes.attacksRemaining > 0) {
        const attackAction2 = new AttackAction();
        effectedCreature = attackAction2.execute(player, creature);
      }
    }

    if(!effectedCreature.effected) {      
      MasterLog.log("All Attacks Actions Missed, A hit was required", "STUNNING STRIKE STOPPED")
      return
    }

    if (
      creature.attributes.currentHitPoints > 0 &&
      !creature.savingThrow(
        10 +
          player.attributes.dexterityModifier +
          player.attributes.wisdomModifier,
        'constitution'
      )
    ) {
      creature.effects.push(new StunnedEffect(creature));

      MasterLog.log(
        `${creature.name} has been stunned by ${player.name} until the end of ${
          player.name
        }' next turn`
      );
      return true;
    }
    else {
      return false;

    }
  }
}
