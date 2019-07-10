import { AttackAction, CreaturesEffect, Action } from '@hive-force/actions';
import { CreatureAsset } from '@hive-force/assets';
import { StunnedEffect, MonkFeature } from './monk.feature';
import { MasterLog } from '@hive-force/log';
import { Subject } from 'rxjs';

export class StunningStrike extends MonkFeature {
  public name = 'Stunning Strike';
  public startLevel = 5;
  public disabled = false;

  constructor(private performance: Subject<Action[]>) {
    super();
    performance.subscribe(a => {});
  }

  public execute(player?: CreatureAsset, creature?: CreatureAsset): boolean {
    if (!this.checkDependencies(player, creature)) { return false; }

    const result = this.performAction(player, creature);
    this.performance.next(player.attributes.actionsPerformed);
    player.attributes.actionsPerformed.push(this);
    return result;
  }

  public checkDependencies(player: CreatureAsset, creature: CreatureAsset): boolean {
    let effectedCreature: CreaturesEffect;

    const action = player.attributes.actionsPerformed.find(
      ap =>
        ap.name === 'Attack' &&
        ap.creaturesEffect.effected &&
        !ap.executeAsBonusAction
    );

    if (creature.attributes.currentHitPoints === 0) {
      MasterLog.log("Creature is already dead. Unable to Stun")
      return false;
    }

    this.disabled = true

    if (action && player.attributes.attacksRemaining === 0) {
      MasterLog.log(
        'All Attacks Actions Missed, A hit was required',
        'WARNING'
      );
      return false;
    }

    if (!this.useKi(player)) {
      return false;
    }

    // Makes sure there was an attack action, If not it attacks for you.
    if (action && action.creaturesEffect.effected) {
      effectedCreature = action.creaturesEffect;
    } else {
      // If at least one hit remains and no hit has taken place, it will perform an attack.
      MasterLog.log("Attack Action Required. Performing action for you")
      const attackAction = new AttackAction();
      effectedCreature = attackAction.execute(player, creature);

      if (
        !effectedCreature.effected &&
        player.attributes.attacksRemaining > 0
      ) {
        const attackAction2 = new AttackAction();
        effectedCreature = attackAction2.execute(player, creature);
      }
    }

    if (!effectedCreature.effected) {
      MasterLog.log(
        'All Attacks Actions Missed, A hit was required',
        'STUNNING STRIKE STOPPED'
      );
      return false;
    }

    return true;
  }

  public performAction(
    player: CreatureAsset,
    creature: CreatureAsset
  ): boolean {

    const saved = creature.savingThrow(10 
        + player.attributes.dexterityModifier 
        + player.attributes.wisdomModifier,
        'constitution'
      )
  
      if(!saved) {
      creature.effects.push(new StunnedEffect(creature));
      MasterLog.log(
        `${creature.name} has been stunned by ${player.name} until the end of 
         ${player.name}' next turn`);
      }

      return true;
  }
}
