import { Dice, Rollable } from '@hive-force/dice';
import { Action } from './action.model';
import { CreatureAsset } from '@hive-force/assets';

export class AttackAction implements Action {
    public name = 'Attack';
  
    public execute(currentPlayer: CreatureAsset, characters: Array<CreatureAsset>, rollable: Rollable): void {
      const rollEquationWithModifer =
        rollable.diceEquation + '+' + currentPlayer.dexterityModifier;
      const dice = new Dice();
      const attackRoll = dice.roll(
        `d20+${currentPlayer.dexterityModifier + currentPlayer.proficiencyBonus}`
      );
  
      characters.forEach(character => {
        if (!character.selected) {
          return;
        }
  
        if (attackRoll.modifiedRollValue > character.armorClas) {
          const damage = new Dice().roll(rollEquationWithModifer);
  
          if (attackRoll.actualRollValue === 20) {
            const critDamage = new Dice().roll(rollEquationWithModifer);
            damage.actualRollValue += critDamage.actualRollValue;
            damage.modifiedRollValue += critDamage.modifiedRollValue;
          }
  
          character.calculateNewHitpoints(
            character,
            damage.modifiedRollValue * -1
          );
          console.log(
            `${currentPlayer.name} hit ${character.name} and took ${
              damage.modifiedRollValue
            } damage`
          );
        } else {
          console.log(`${currentPlayer.name} missed!`);
        }
      });
    }
  }