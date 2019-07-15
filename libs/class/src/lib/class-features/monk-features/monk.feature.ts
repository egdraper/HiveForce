import { ClassFeature } from '../class.features';
import { CreatureAsset, Effect } from '@hive-force/assets';
import { Monk } from '../../monk.class';
import { Action } from '@hive-force/actions';
import { MasterLog } from '@hive-force/log';

export abstract class MonkFeature extends Action implements ClassFeature {
  public name = '';
  public startLevel = 0;
  public duration = 'none';

  public useKi(player: Monk, qty: number = 1): boolean {
    if (player.ki - qty >= 0) {
      player.ki = player.ki - qty;
      return true
    } else {
      MasterLog.log('You have insufficient Ki points', "WARNING");
      return false;
    }
  }
}



export class StunnedEffect implements Effect {
  public name = "Stunned"
  public startTime: string
  public endTime: string
  public duration = 0
  public description = "Player Cannot Perform an Action"

  constructor(private creature: CreatureAsset) {
    this.applyRule()
  }

  public applyRule(): any {
    this.creature.disabled = true
  } 

  public removeRule(): void {
    this.creature.disabled = false
  }

  public check(): void {
    if (this.startTime > this.endTime) {
      this.creature.disabled = false
    }
  }
}



