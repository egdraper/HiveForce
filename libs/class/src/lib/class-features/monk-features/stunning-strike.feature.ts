import { AttackAction, CreatureEffected } from '@hive-force/actions';
import { CreatureAsset } from '@hive-force/assets';
import { StunnedEffect, MonkFeature } from './monk.feature';

export class StunningStrike extends MonkFeature {
  public name = 'Stunning Strike';
  public startLevel = 5;
  public usesActionPoints = true;
  public usesBonusAction = true;
  public disabled = false;

  public execute(
    player?: CreatureAsset,
    creatures?: Array<CreatureAsset>
  ): boolean {
    const creature = creatures ? creatures[0] : null;
    this.disabled = true

    if (!this.useKi(player)) {
      return;
    }
    
    let effectedCreature: CreatureEffected;

    const action = player.attributes.actionsPerformed.find(
      ap => ap.name === 'Attack'
    );

    if (action && action.creaturesEffected[0]) {
      effectedCreature = action.creaturesEffected[0];
    } else {
      const attackAction = new AttackAction();
      effectedCreature = attackAction.execute(player, creatures)[0];

      if(!effectedCreature && player.level >= 5) {
        const attackAction2 = new AttackAction();
        effectedCreature = attackAction2.execute(player, creatures)[0];
      }
    }

    if (
      effectedCreature &&
      effectedCreature.effected &&
      creature.attributes.currentHitPoints > 0 &&
      !creature.savingThrow(
        10 +
          player.attributes.dexterityModifier +
          player.attributes.wisdomModifier,
        'constitution'
      )
    ) {
      creature.effects.push(new StunnedEffect(creature));

      console.log(
        `${creature.name} has been stunned until the end of ${
          player.name
        }' next turn`
      );
      return true;
    }
    return false;
  }
}
