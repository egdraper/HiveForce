import { Dice, Roll } from '@hive-force/dice';
import { Action, CreatureEffected } from './action.model';
import { CreatureAsset } from '@hive-force/assets';
import { Weapon } from '@hive-force/items';

export class AttackAction extends Action {
  public name = 'Attack';
  public disabled = false
  public effectedCreature: Array<CreatureAsset>
  public executeAsBonusAction = false

  public execute(
    player: CreatureAsset,
    creatures: Array<CreatureAsset>,
  ): Array<CreatureEffected> {
    if(!this.checkDependencies(player)) { return [] }

    const results = this.performAction(player, creatures)

    if(player.attributes.attacksRemaining === 0) { this.disabled = true }
    player.attributes.actionsPerformed.push(this)
    return results
  }

  private checkDependencies(player: CreatureAsset): boolean {
    if(this.executeAsBonusAction) {
      return true
    } 

    if(player.attributes.attacksRemaining === 0) {
      console.log("You have no Attack Actions Remaining for this turn.")
      return false
    }

    return true
  }
   
  public performAction(player: CreatureAsset, creatures: Array<CreatureAsset>): Array<CreatureEffected>  {
    const weapon = player.getSelectedItem() as Weapon;
    player.attributes.actionsPerformed.push(this)
    player.attributes.attacksRemaining --

    const attackRoll = this.rollAttack(player, weapon)
    const damageEquation = `${weapon.diceEquation}+${this.getWeaponTypeModifier(player, weapon)}`;
    creatures.forEach(creature => {
      if (!creature.selected) {
        return;
      }

      if (attackRoll.modifiedRollValue > creature.attributes.armorClass) {
        const damage = new Dice().roll(damageEquation);

        if (attackRoll.actualRollValue === 20) {
          console.log(`Critical Hit!!!`);
          const critDamage = new Dice().roll(damageEquation);
          damage.actualRollValue += critDamage.actualRollValue;
          damage.modifiedRollValue += critDamage.modifiedRollValue;
        }

        creature.calculateNewHitPoints(damage.modifiedRollValue * -1);
        this.creaturesEffected.push({ creature: creature, effected: true });

        console.log(
          `${player.name} hit ${creature.name} and took ${
            damage.modifiedRollValue
          } damage`
        );
      } else {
        console.log(`${player.name} missed!`);
        return;
      }
      console.log(
        '<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<'
      );
    });

    return this.creaturesEffected;
  }

  public rollAttack(player: CreatureAsset, weapon: Weapon): Roll {
    let attackRoll  = new Dice().roll(`d20+${this.getWeaponTypeModifier(player, weapon) + player.attributes.proficiencyBonus}`);
    
    if(player.attributes.hasAdvantage) {
      const attackRoll2 = new Dice().roll(`d20+${this.getWeaponTypeModifier(player, weapon) + player.attributes.proficiencyBonus}`);
      attackRoll = attackRoll.actualRollValue >= attackRoll2.actualRollValue ? attackRoll: attackRoll2
    }

    if(player.attributes.hasDisadvantage) {
      const attackRoll2 = new Dice().roll(`d20+${this.getWeaponTypeModifier(player, weapon) + player.attributes.proficiencyBonus}`);
      attackRoll = attackRoll.actualRollValue <= attackRoll2.actualRollValue ? attackRoll : attackRoll2
    }

    return attackRoll   
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
