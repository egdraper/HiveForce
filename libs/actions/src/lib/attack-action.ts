import { Dice } from '@hive-force/dice';
import { Action, CreatureEffected } from './action.model';
import { CreatureAsset } from '@hive-force/assets';
import { Weapon } from '@hive-force/items';

export class AttackAction extends Action {
  public name = 'Attack';

  public execute(
    currentPlayer: CreatureAsset,
    characters: Array<CreatureAsset>
  ): Array<CreatureEffected> {
    const weapon = currentPlayer.getSelectedItem() as Weapon;

    const damageEquationWithModifier = `${
      weapon.diceEquation
    }+${this.getWeaponTypeModifier(currentPlayer, weapon)}`;

    const dice = new Dice();
    const attackRoll = dice.roll(
      `d20+${currentPlayer.attributes.dexterityModifier +
        currentPlayer.attributes.proficiencyBonus}`
    );

    characters.forEach(character => {
      if (!character.selected) {
        return;
      }

      if (attackRoll.modifiedRollValue > character.attributes.armorClass) {
        const damage = new Dice().roll(damageEquationWithModifier);

        if (attackRoll.actualRollValue === 20) {
          console.log(`Critical Hit!!!`);
          const critDamage = new Dice().roll(damageEquationWithModifier);
          damage.actualRollValue += critDamage.actualRollValue;
          damage.modifiedRollValue += critDamage.modifiedRollValue;
        }

        character.calculateNewHitPoints(damage.modifiedRollValue * -1);

        this.creaturesEffected.push({ creature: character, effected: true });

        console.log(
          `${currentPlayer.name} hit ${character.name} and took ${
            damage.modifiedRollValue
          } damage`
        );
      } else {
        console.log(`${currentPlayer.name} missed!`);
        return;
      }
      console.log(
        '<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<'
      );
    });

    return this.creaturesEffected;
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
