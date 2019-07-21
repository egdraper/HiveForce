import { ClassFeature } from '../class.features';
import { CreatureAsset } from '@hive-force/assets';
import { MonkFeature } from './monk.feature';
import { Subject } from 'rxjs';
import { Action } from '@hive-force/actions';

export class StillnessOfMind extends MonkFeature
  implements ClassFeature {
  public name = 'Stillness Of Mind';
  public disabled = true;
  public startLevel = 7;

  public execute(player: CreatureAsset) {
    player.attributes.actionsRemaining = 0
    player.effects = player.effects.filter(a => a.name !== "Poison" && a.name !== "Charmed")
  }
}