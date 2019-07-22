import { ClassFeature } from '../class.features';
import { MonkFeature } from './monk.feature';
import { CreatureAsset } from '../../creature.asset';

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