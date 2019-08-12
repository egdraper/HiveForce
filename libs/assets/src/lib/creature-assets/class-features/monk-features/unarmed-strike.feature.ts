import { ClassFeature } from '../class.features';
import { MonkFeature } from './monk.feature';
import { Action } from '../../actions/action.model';
import { AttackAction } from '../../actions/attack-action';

import { Subject } from 'rxjs';
import { MasterLog } from '@hive-force/log';
import { Weapon } from '@hive-force/items';
import { CreatureAsset } from '../../creature.asset';

export class UnarmedStrike extends MonkFeature implements ClassFeature {
  public name = 'Unarmed Strike';
  public startLevel = 1;
  public disabled = false;
  public iconUrl = "../assets/fist-punch.png"

  constructor(private performance: Subject<Action[]>) {
      super()
      performance.subscribe(this.onActionAdded.bind(this))
  }

  public execute(player: CreatureAsset, creature: CreatureAsset): void {
    if (!this.checkDependencies(player, creature)) {
      return;
    }
    this.performAction(player, creature);
    
    this.performance.next(player.attributes.actionsPerformed)
    player.attributes.actionsPerformed.push(this)
  }

  private checkDependencies(player: CreatureAsset, creature: CreatureAsset): boolean {
    // TODO: Check for approved Weapon
    if (player.attributes.bonusActionsRemaining === 0) {
      this.disabled = true;
      MasterLog.log('You have no Bonus Actions Remaining', 'WARNING!!!');
      return false;
    }

    const action = player.attributes.actionsPerformed.find (
        ap => ap.name === 'Attack'
    );

    if (!action) {
        MasterLog.log('Attack action required for Unarmed Strike. Performing attack action\n');
        new AttackAction().execute(player, creature);
        MasterLog.log("-------")
    }

    // player.effects.forEach()

    return true
  }

  private performAction(
    player: CreatureAsset,
    creature: CreatureAsset
  ): boolean {
    const unarmed = player.inventory.find(a => a.name === 'Fist');
    const mainWeapon = player.selectItem(unarmed as Weapon);
    
    const attack1 = new AttackAction("Unarmed Strike");
    attack1.executeAsBonusAction = true;
    attack1.execute(player, creature);
    player.attributes.bonusActionsRemaining --
    this.disabled = true

    player.selectItem(mainWeapon as Weapon);
    return true
  }

  private onActionAdded(action: Action[]): void {
    if(action.find(a => a.executeAsBonusAction)){
        this.disabled = true
    }
  }
}
