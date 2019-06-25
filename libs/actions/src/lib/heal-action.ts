import { Action } from './action.model';
import { Dice } from "@hive-force/dice";
import { CreatureAsset } from '@hive-force/assets';

export class HealAction implements Action {
    public name = 'Heal';
    public execute(currentPlayer: CreatureAsset, characters: Array<CreatureAsset>): void {
      const rollEquation = `1d12+2`;
      const heal = new Dice().roll(rollEquation);
  
      characters.forEach(character => {
        if (!character.selected) {
          return;
        }
  
        character.calculateNewHitpoints(character, heal.modifiedRollValue);
        console.log(
          `${currentPlayer.name} healed ${character.name} for ${
            heal.modifiedRollValue
          }`
        );
      });
    }
  }