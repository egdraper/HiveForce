import { ClassFeature } from '../class.features';
import { CreatureAsset } from '@hive-force/assets';
import { Weapon } from '@hive-force/items';
import { AttackAction, BonusAction, Action } from '@hive-force/actions';
import { MasterLog } from '@hive-force/log';
import { MonkFeature } from './monk.feature';
import { Subject } from 'rxjs';
import { Monk } from '../../monk.class';

export class FurryOFBlows extends MonkFeature {
  public name = 'Furry of Blows';
  public startLevel = 3;
  public executeAsBonusAction = true;

  private alreadyUsedOpenHandAsBonusAction = false

  constructor(private performance: Subject<Action[]>) {
    super();
  }

  public execute(player?: CreatureAsset, creature?: CreatureAsset): void {
    this.checkDependencies(player, creature);
    this.performBonusAction(player, creature);
    player.attributes.actionsPerformed.push(this);
    this.performance.next(player.attributes.actionsPerformed)
  }

  private checkDependencies(
    player: CreatureAsset,
    creature: CreatureAsset
  ): boolean {
    const action = player.attributes.actionsPerformed.find (
      ap => ap.name === 'Attack'
    );

    if (!action && (
       player.attributes.actionsRemaining === 0 ||
       player.attributes.bonusActionsRemaining === 0)
    ) {
      MasterLog.log('You have no Actions Remaining!!!', 'WARNING');
      return false;
    }

    if (!action) {
      MasterLog.log('Attack action required for Furry of Blows');
      new AttackAction().execute(player, creature);
    }

    if(player.attributes.actionsPerformed.find(ap => ap.name === "Unarmed Strike")) {
      this.alreadyUsedOpenHandAsBonusAction = true
    }
  }

  private performBonusAction(
    player: CreatureAsset,
    creature: CreatureAsset
  ): void {
    const unarmed = player.inventory.find(a => a.name === 'Fist');
    const mainWeapon = player.selectItem(unarmed as Weapon);

    if (!this.useKi(player as Monk)) {
      return;
    }

    if(!this.alreadyUsedOpenHandAsBonusAction) {
      const attack1 = new AttackAction();
      attack1.executeAsBonusAction = true;
      attack1.execute(player, creature);
    }
    
    const attack2 = new AttackAction();
    attack2.executeAsBonusAction = true;
    attack2.execute(player, creature);

    player.selectItem(mainWeapon as Weapon);
    player.attributes.bonusActionsRemaining--;
    this.disabled = true;
  }
}
