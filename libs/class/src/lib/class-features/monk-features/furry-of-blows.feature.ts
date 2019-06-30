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
  
    public execute(player?: CreatureAsset, creatures?: Array<CreatureAsset>): void {
        this.checkDependencies(player, creatures)
    }  

    private checkDependencies(player: CreatureAsset, creatures: Array<CreatureAsset>): void {
        const action = player.attributes.actionsPerformed.find(ap => ap.name === "Attack")
        
        if(!action && (player.attributes.actionsRemaining === 0 || player.attributes.bonusActionsRemaining === 0 )) {
          console.log("You have no Actions Remaining!")
          return
        }

        if(!action) {
            new AttackAction().execute(player, creatures) 
        }       

        this.performBonusAction(player, creatures)
    }

    private performBonusAction(player: CreatureAsset, creatures: Array<CreatureAsset>): void {        
      const unarmed = player.inventory.find(a => a.name === 'Unarmed');
      const mainWeapon = player.selectItem(unarmed as Weapon);
      
      if(!this.useKi(player)) { return } 
  
      const attack1 = new AttackAction()
      attack1.executeAsBonusAction = true
      attack1.execute(player, creatures)
      const attack2 = new AttackAction()
      attack2.executeAsBonusAction = true
      attack2.execute(player, creatures);

      MasterLog.log(player.name, 'Did Furry of blows');
      player.selectItem(mainWeapon as Weapon);
      player.attributes.bonusActionsRemaining --
      this.disabled = true
    }
  }