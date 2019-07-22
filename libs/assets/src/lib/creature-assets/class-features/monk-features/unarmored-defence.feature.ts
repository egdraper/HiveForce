import { ClassFeature } from '../class.features';
import { MonkFeature } from './monk.feature';
import { CreatureAsset } from '../../creature.asset';

export class UnarmoredDefense extends MonkFeature
  implements ClassFeature {
  public name: 'Unarmored Defense';
  public startLevel: 1;
  public effects: 'armorClass';

  public execute(player: CreatureAsset) {
    const armor = player.inventory.filter(
      item => item.use === 'armor' && item.equipped
    );
    if (!armor) {
      player.attributes.armorClass =
        10 +
        player.attributes.wisdomModifier +
        player.attributes.dexterityModifier;
    } else {
        // add armor and disadvantage
    }
  }
}