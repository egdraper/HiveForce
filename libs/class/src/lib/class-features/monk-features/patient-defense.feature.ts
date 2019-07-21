import { ClassFeature } from '../class.features';
import { CreatureAsset } from '@hive-force/assets';
import { MonkFeature } from './monk.feature';
import { Subject } from 'rxjs';
import { Action } from '@hive-force/actions';
import { Monk } from '../../monk.class';

export class PatientDefence extends MonkFeature
  implements ClassFeature {
  public name = 'Patient Defense';
  public executeAsBonusAction = true;
  public disabled = false;
  public startLevel = 7;

  public execute(player: CreatureAsset) {
    if(this.useKi(player as Monk)) {
        
    }
  }
}