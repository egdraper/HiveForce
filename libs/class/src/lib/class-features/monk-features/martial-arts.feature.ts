import { AttackAction } from '@hive-force/actions';
import { CreatureAsset } from '@hive-force/assets';
import { MasterLog } from '@hive-force/log';
import { MonkFeature } from './monk.feature';

export class MartialArts extends MonkFeature {
    public name = 'Martial Arts';
    public startLevel = 2;
    public duration = 'action';
    public usesActionPoints = false;
    public usesBonusAction = true;
  
    public execute(player?: CreatureAsset, characters?: Array<CreatureAsset>) {
      if (player.attributes.bonusActionsRemaining > 0) {
        player.attributes.bonusActionsRemaining--;
      } else {
        console.log('You have no Bonus Action Remaining');
        return;
      }
  
      new AttackAction().execute(player, characters);
      MasterLog.log(player.name, 'Did Unarmed Strike');
      return true
    }
  }