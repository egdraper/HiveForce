import { Subject } from 'rxjs';
import { Effect } from './effects.model';
import { Action } from '../actions/action.model';
import { CreatureAsset } from '../creature.asset';

export class InvisibilityEffect implements Effect {
    public name = "Invisible"
    public startTime: string
    public endTime: string
    public duration = 0
    public affects = ["Attack"]
    public description = "Player Cannot Perform an Action"
    public end = new Subject<boolean>()
  
    private currentAdvantage
    private currentDisadvantage
  
    constructor(creature: CreatureAsset, duration: number = 0) {
      this.duration = duration
    }
  
    public applyRule(attacker: CreatureAsset, attackee: CreatureAsset, action: Action): any {
      if(action.name === "Attack") {
        this.currentAdvantage = attacker.attributes.hasAdvantage
        this.currentDisadvantage = attacker.attributes.hasDisadvantage
        attacker.attributes.hasAdvantage = true
        attackee.attributes.hasDisadvantage = true
      }
  
    } 
  
    public removeRule(attacker: CreatureAsset, attackee: CreatureAsset, action: Action): void {
      if(action.name === "Attack") {
        attacker.attributes.hasAdvantage = this.currentAdvantage
        attackee.attributes.hasDisadvantage = this.currentDisadvantage
      }
    }
  
    public check(): void {
      if (this.startTime > this.endTime) {
        this.end.next()
      }
    }
  }