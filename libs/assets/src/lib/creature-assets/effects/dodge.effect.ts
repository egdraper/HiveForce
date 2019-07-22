import { Effect } from './effects.model';
import { Subject } from 'rxjs';
import { CreatureAsset } from '../creature.asset';

  export class DodgeEffect implements Effect {
    public name = "Dodge"
    public startTime: string
    public endTime: string
    public duration = 0
    public affects = ["Attack"]
    public description = "Player Dodges"
    public end = new Subject<boolean>()
  
    constructor(creature: CreatureAsset, duration: number) {
      this.duration = duration
    }
  
    public applyRule(attacker: CreatureAsset, attackee: CreatureAsset): any {
      attacker.attributes.hasDisadvantage = true
      attackee.attributes.hasAdvantage = true
  
      // attackee.savingThrow()
  
      return false
    } 
  
    public removeRule(): void {
    }
  
    public check(): void {
      if (this.startTime > this.endTime) {
        this.end.next()
      }
    }
  }
  
  
  