import { Dice, Roll } from '@hive-force/dice';
import { Action, CreaturesEffect } from './action.model';
import { CreatureAsset } from '@hive-force/assets';
import { Weapon } from '@hive-force/items';
import { MasterLog } from '@hive-force/log';

export class AttackAction extends Action {
  public name = 'Attack';
  public disabled = false;
  public executeAsBonusAction = false;

  public execute(
    player: CreatureAsset,
    creature: CreatureAsset
  ): CreaturesEffect {
    if (!this.checkDependencies(player)) {
      return;
    }

    if (!creature.selected) {
      return;
    }

    const results = this.performAction(player, creature);

    if (player.attributes.attacksRemaining <= 0) {
      const playersAttack = player.attributes.actions.find(a => a.name === "Attack")
      playersAttack.disabled = true
    }

    player.attributes.actionsPerformed.push(this);
    return results;
  }

  private checkDependencies(player: CreatureAsset): boolean {
    if (this.executeAsBonusAction) {
      return true;
    }

    if (player.attributes.attacksRemaining === 0) {
      MasterLog.log('You have no Attack Actions Remaining for this turn!!!', "ATTACK STOPPED");
      return false;
    }

    return true;
  }

  public performAction(
    player: CreatureAsset,
    creature: CreatureAsset
  ): CreaturesEffect {
    const weapon = player.getSelectedItem() as Weapon;
    if(!this.executeAsBonusAction) { player.attributes.attacksRemaining-- }

    MasterLog.log(`${player.name} attacked with the ${weapon.name}`)
    const attackRoll = this.rollAttack(player, weapon);
    
    const damageEquation = `${weapon.diceEquation}+${this.getWeaponTypeModifier(player, weapon)}`;

    if (attackRoll.modifiedRollValue > creature.attributes.armorClass) {
      MasterLog.log("DAMAGE")
      const damage = new Dice().roll(damageEquation);

      if (attackRoll.actualRollValue === 20) {
        MasterLog.log(`Critical Hit!!!`);
        const critDamage = new Dice().roll(damageEquation);
        damage.actualRollValue += critDamage.actualRollValue;
        damage.modifiedRollValue += critDamage.modifiedRollValue;
      }

      creature.calculateNewHitPoints(damage.modifiedRollValue * -1);
      this.creaturesEffect = { creature: creature, effected: true };

      MasterLog.log(
        `${player.name} hit ${creature.name} and took ${
          damage.modifiedRollValue
        } damage`
      );
    } else {
      this.creaturesEffect = { creature: creature, effected: false };
      MasterLog.log(`${player.name} missed!`);
    }
    MasterLog.log(
      '<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<'
    );

    return this.creaturesEffect
  }

  public rollAttack(player: CreatureAsset, weapon: Weapon): Roll {
    let attackRoll = new Dice().roll(
      `d20+${this.getWeaponTypeModifier(player, weapon) +
        player.attributes.proficiencyBonus}`
    );

    if (player.attributes.hasAdvantage) {
      const attackRoll2 = new Dice().roll(
        `d20+${this.getWeaponTypeModifier(player, weapon) +
          player.attributes.proficiencyBonus}`
      );
      attackRoll =
        attackRoll.actualRollValue >= attackRoll2.actualRollValue
          ? attackRoll
          : attackRoll2;
    }

    if (player.attributes.hasDisadvantage) {
      const attackRoll2 = new Dice().roll(
        `d20+${this.getWeaponTypeModifier(player, weapon) +
          player.attributes.proficiencyBonus}`
      );
      attackRoll =
        attackRoll.actualRollValue <= attackRoll2.actualRollValue
          ? attackRoll
          : attackRoll2;
    }

    return attackRoll;
  }

  public getWeaponTypeModifier(
    creature: CreatureAsset,
    weapon: Weapon
  ): number {
    switch (weapon.type) {
      case 'Brute':
        return creature.attributes.strengthModifier;
      case 'Finesse':
        return creature.attributes.dexterityModifier;
      case 'Versatile':
        return creature.attributes.dexterityModifier >=
          creature.attributes.strengthModifier
          ? creature.attributes.dexterityModifier
          : creature.attributes.strengthModifier;
    }
  }
}
