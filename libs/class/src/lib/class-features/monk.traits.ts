import { CreatureAsset } from '@hive-force/assets';
import {
  AttackAction,
  ConsumableAction,
  BonusAction,
  Action,
  NonPlayableAction
} from '@hive-force/actions';
import { MasterLog } from '@hive-force/log';
import { ClassFeature } from './class.traits';
import { Monk } from '../monk.class';
import { Weapon } from '@hive-force/items';

export class UnarmoredDefense extends NonPlayableAction
  implements ClassFeature {
  public name: 'Unarmored Defense';
  public startLevel: 1;
  public effects: 'armorClass';

  public execute(player: CreatureAsset) {
    const armor = player.attributes.inventory.filter(
      item => item.use === 'armor' && item.equipped
    );
    if (!armor) {
      player.attributes.armorClass =
        10 +
        player.attributes.wisdomModifier +
        player.attributes.dexterityModifier;
    }
  }
}

export class MartialArts extends BonusAction implements ClassFeature {
  public name = 'Martial Arts';
  public startLevel = 2;
  public duration = 'action';
  public usesActionPoints = false;
  public usesBonusAction = true;

  public execute(player?: CreatureAsset, characters?: Array<CreatureAsset>) {
    const monk = player.class as Monk;
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

export class StunningStrike extends ConsumableAction implements ClassFeature {
  public name = 'Stunning Strike';
  public startLevel = 5;
  public duration = 'action';
  public usesActionPoints = true;
  public usesBonusAction = true;

  public execute(
    player?: CreatureAsset,
    creatures?: Array<CreatureAsset>
  ): boolean {
    const creature = creatures ? creatures[0] : null;
    if(!useKi(player)) { return }

    const attackAction = new AttackAction();
    const effectedCreature = attackAction.execute(player, creatures)[0];

     if (
      effectedCreature.effected &&
      creature.attributes.currentHitPoints > 0 &&
      !creature.savingThrow(10 + player.attributes.dexterityModifier + player.attributes.wisdomModifier, 'constitution')
    ) {
      creature.disabled = true;
      console.log(
        `${creature.name} has been stunned until the end of ${
          player.name
        }' next turn`
      );
      return true;
    }
    return false;
  }
}

export class FurryOFBlows extends Action implements ClassFeature {
  public name = 'Furry of Blows';
  public startLevel = 3;
  public duration = 'action';
  public usesActionPoints = true;
  public usesBonusAction = true;

  public execute(player?: CreatureAsset, characters?: Array<CreatureAsset>): boolean {
    const unarmed = player.attributes.inventory.find(a => a.name === 'Unarmed');
    const mainWeapon = player.selectItem(unarmed as Weapon);
    
    if(!useKi(player)) { return }
    
    if (player.attributes.bonusActionsRemaining > 0) {
      player.attributes.bonusActionsRemaining--;
    } else {
      console.log('You have no Bonus Action Remaining');
      return;
    }
    

    new AttackAction().execute(player, characters);
    new AttackAction().execute(player, characters);
    MasterLog.log(player.name, 'Did Furry of blows');
    player.selectItem(mainWeapon as Weapon);
  }


}

function useKi(player: CreatureAsset, qty: number = 1): boolean {
    const monk = player.class as Monk;
    if (monk.ki - qty >= 0) {
      monk.ki = monk.ki - qty;
      return true
    } else {
      console.log('You have insufficient Ki points');
      return false;
    }
  }
