import { Action } from './action.model';
import { Dice } from "@hive-force/dice";
import { CreatureAsset } from '@hive-force/assets';

export class HealAction extends Action {
    public name = 'Heal';
    public execute(currentPlayer: CreatureAsset, characters: Array<CreatureAsset>): boolean {
      const rollEquation = `1d12+2`;
      const heal = new Dice().roll(rollEquation);
  
      characters.forEach(character => {
        if (!character.selected) {
          return;
        }
  
        character.calculateNewHitPoints(heal.modifiedRollValue);
        console.log(
          `${currentPlayer.name} healed ${character.name} for ${
            heal.modifiedRollValue
          }`
        );
      });
      return true
    }
  }