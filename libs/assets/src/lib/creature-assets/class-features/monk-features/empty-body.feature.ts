import { InvisibilityEffect } from '../../effects/invisiblity.effect';
import { CreatureAsset } from '../../assets/creature.asset';
import { ClassFeature } from '../class.features';
import { MonkFeature } from './monk.feature';

import { remove } from "lodash"

export class EmptyBody extends MonkFeature
  implements ClassFeature {
  public name = 'Empty Body';
  public disabled = false;
  public startLevel = 18;

  private player: CreatureAsset

  public execute(player: CreatureAsset) {
     this.player = player
     const invisibility = new InvisibilityEffect(player, 60)
     invisibility.end.subscribe(this.onEffectEnding.bind(this))
     player.effects.push(invisibility)

     player.attributes.resistances.push("Acid")
     player.attributes.resistances.push("Bludgeoning")
     player.attributes.resistances.push("Cold")
     player.attributes.resistances.push("Fire")
     player.attributes.resistances.push("Lightning")
     player.attributes.resistances.push("Necrotic")
     player.attributes.resistances.push("Piercing")
     player.attributes.resistances.push("Poison")
     player.attributes.resistances.push("Psychic")
     player.attributes.resistances.push("Slashing")
     player.attributes.resistances.push("Thunder")  
  }

  private onEffectEnding(): void {
    remove(this.player.attributes.resistances, a => a === "Acid")
    remove(this.player.attributes.resistances, a => a === "Bludgeoning")
    remove(this.player.attributes.resistances, a => a === "Cold")
    remove(this.player.attributes.resistances, a => a === "Fire")
    remove(this.player.attributes.resistances, a => a === "Lightning")
    remove(this.player.attributes.resistances, a => a === "Necrotic")
    remove(this.player.attributes.resistances, a => a === "Piercing")
    remove(this.player.attributes.resistances, a => a === "Psychic")
    remove(this.player.attributes.resistances, a => a === "Poison")
    remove(this.player.attributes.resistances, a => a === "Slashing")
    remove(this.player.attributes.resistances, a => a === "Thunder")
  }
}