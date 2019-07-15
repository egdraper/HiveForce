import { Dice, Roll } from '@hive-force/dice';
import { Action, CreaturesEffect } from './action.model'
import { CreatureAsset } from '@hive-force/assets'
import { Weapon } from '@hive-force/items'
import { MasterLog } from '@hive-force/log'
import { cloneDeep } from "lodash"

export enum DamageStatus {
  doubled,
  halved,
  regular,
  squelched,
}

export class AttackAction extends Action {
  public name = 'Attack';
  public disabled = false;
  public executeAsBonusAction = false;
  public damageStatus: DamageStatus = DamageStatus.regular
  
  public execute(
    player: CreatureAsset,
    creature: CreatureAsset,
    weapon: Weapon,
    ): CreaturesEffect {
      if (!this.checkDependencies(player, creature)) {
        return;
      }
  
      const results = this.performAction(player, creature, weapon);
      
      // disables the attack button    
      if(!this.executeAsBonusAction) {
        player.attributes.actionsPerformed.push(cloneDeep(this));
        player.attributes.attacksRemaining--
      }
      
      if (player.attributes.attacksRemaining <= 0) {
        const playersAttack = player.attributes.actions.find(a => a.name === "Attack")
        playersAttack.disabled = true
      }
    
      return results;
  }

  private checkDependencies(player: CreatureAsset, creature?: CreatureAsset): boolean {
    // Must have creature selected
    if (!creature.selected) {
      return false;
    }

    // Allow action if a bonus action
    if (this.executeAsBonusAction) {
      return true;
    }

    // Must have attack actions remaining
    if (player.attributes.attacksRemaining === 0) {
      MasterLog.log('You have no Attack Actions Remaining for this turn!!!', "ATTACK STOPPED");
      return false;
    }

    return true;
  }

  public performAction(
    player: CreatureAsset,
    creature: CreatureAsset,
    weapon: Weapon
  ): CreaturesEffect {
    let totalHitPointsTaken: number

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

      switch (this.damageStatus) {
        case DamageStatus.halved:
          totalHitPointsTaken = (damage.modifiedRollValue / 2) * -1
          creature.calculateNewHitPoints(totalHitPointsTaken);          
          break
        case DamageStatus.doubled: {
          totalHitPointsTaken = (damage.modifiedRollValue * 2) * -1
          creature.calculateNewHitPoints(totalHitPointsTaken);
          break
        }
        case DamageStatus.regular: {
          totalHitPointsTaken = damage.modifiedRollValue * -1
          creature.calculateNewHitPoints(damage.modifiedRollValue * -1);
          break
        }
      }
          
      this.creaturesEffect = { creature: creature, effected: true };

      MasterLog.log(
        `${player.name} hit ${creature.name} and took ${
          totalHitPointsTaken
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
      attackRoll = attackRoll.actualRollValue >= attackRoll2.actualRollValue
          ? attackRoll
          : attackRoll2;
    }

    if (player.attributes.hasDisadvantage) {
      const attackRoll2 = new Dice().roll(
        `d20+${this.getWeaponTypeModifier(player, weapon) +
          player.attributes.proficiencyBonus}`
      );
       attackRoll = attackRoll.actualRollValue <= attackRoll2.actualRollValue
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

  public checkResistances(
    creature: CreatureAsset,
    weapon: Weapon
  ): void {

    if( weapon.checkIfOvercomes(weapon.damageType, creature) ){ 
      this.damageStatus = DamageStatus.regular 
      return
    }

    if( creature.checkForImmunities(weapon.damageType)) {
      this.damageStatus = DamageStatus.squelched
    }

    if( creature.checkForVulnerabilities(weapon.damageType)) {
      this.damageStatus = DamageStatus.doubled
    }

    if( creature.checkForResistances(weapon.damageType).length > 0) {
      // half as many times as there is resistance
    }
  }
}
