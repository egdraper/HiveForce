import { CreatureAsset } from "@hive-force/assets"
import { AttackAction } from "@hive-force/actions"
import { MasterLog } from "@hive-force/log"
import { ClassFeature } from './class.traits';

export class UnarmoredDefense {

}

export class MartialArts {

}

export class FurryOFBlows implements ClassFeature {
    public name = "Furry of Blows"
    public startLevel = 3
    public durration = "action"
    public usesActionPoints = true
    public usesBonusAction = true
    public perform(player?: CreatureAsset, characters?: Array<CreatureAsset>) {
      if(player.bonusActionsRemaining > 0) { 
        player.bonusActionsRemaining--
      } else {
        console.log("You have no Bonus Action Remaining")
        return
      }

     if(player.class.ki > 0) { 
        player.class.ki -- 
      } else {
        console.log("You have insificient Ki points")
      }
     
      new AttackAction().execute(player, characters,  { diceEquation: '1d6' })  
      new AttackAction().execute(player, characters, { diceEquation: '1d6' })
      MasterLog.log(player.name, "Did Furry of blows")
  
    } 
  }
  