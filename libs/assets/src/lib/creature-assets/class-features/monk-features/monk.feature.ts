import { ClassFeature } from '../class.features';
import { Action } from '../../actions/action.model';

import { MasterLog } from '@hive-force/log';
import { Monk } from '../../class/monk.class';

export abstract class MonkFeature extends Action implements ClassFeature {
  public name = '';
  public startLevel = 0;
  public duration = 'none';

  public useKi(player: Monk, qty: number = 1): boolean {
    if (player.ki - qty >= 0) {
      player.ki = player.ki - qty;
      return true
    } else {
      MasterLog.log('You have insufficient Ki points', "WARNING");
      return false;
    }
  }
}





