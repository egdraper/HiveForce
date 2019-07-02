import { Action } from 'rxjs/internal/scheduler/Action';
import { ClassFeature } from '../class.features';
import { CreatureAsset } from '@hive-force/assets';
import { Weapon } from '@hive-force/items';
import { AttackAction, BonusAction } from '@hive-force/actions';
import { MasterLog } from '@hive-force/log';
import { MonkFeature } from './monk.feature';

export class FurryOFBlows extends MonkFeature  {
    public name = 'Furry of Blows';
    public startLevel = 3;
    public duration = 'action';
    public usesActionPoints = true;
    public usesBonusAction = true;
  
    public execute(player?: CreatureAsset, creature?: CreatureAsset): void {
        this.checkDependencies(player, creature)
    }  

    private checkDependencies(player: CreatureAsset, creature: CreatureAsset): void {
        const action = player.attributes.actionsPerformed.find(ap => ap.name === "Attack")
        
        if(!action && (player.attributes.actionsRemaining === 0 || player.attributes.bonusActionsRemaining === 0 )) {
          MasterLog.log("You have no Actions Remaining!!!", "WARNING")
          return
        }

        if(!action) {
            new AttackAction().execute(player, creature) 
        }       

        this.performBonusAction(player, creature)
    }

    private performBonusAction(player: CreatureAsset, creature: CreatureAsset): void {        
      const unarmed = player.inventory.find(a => a.name === 'Unarmed');
      const mainWeapon = player.selectItem(unarmed as Weapon);
      
      if(!this.useKi(player)) { return } 
  
      const attack1 = new AttackAction()
      attack1.executeAsBonusAction = true
      attack1.execute(player, creature)
      const attack2 = new AttackAction()
      attack2.executeAsBonusAction = true
      attack2.execute(player, creature);

      MasterLog.log('Did Furry of Blows', player.name, );
      player.selectItem(mainWeapon as Weapon);
      player.attributes.bonusActionsRemaining --
      this.disabled = true
    }
  }