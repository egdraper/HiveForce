import { ClassFeature } from '../class.features';
import { MonkFeature } from './monk.feature';
import { Monk } from '../../monk.class';
import { CreatureAsset } from '../../assets/creature.asset';

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