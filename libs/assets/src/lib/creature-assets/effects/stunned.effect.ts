import { Effect } from './effects.model';
import { Subject } from 'rxjs';
import { CreatureAsset } from '../creature.asset';

export class StunnedEffect implements Effect {
    public name = "Stunned"
    public startTime: string
    public endTime: string
    public duration = 0
    public affects = ["movement", "attack", "actions"]
    public description = "Player Cannot Perform an Action"
    public end = new Subject<boolean>()
  
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
        this.end.next() 
      }
    }
  }