import { ClassFeature } from '../class.features';
import { CreatureAsset, Effect } from '@hive-force/assets';
import { Monk } from '../../monk.class';
import { Action } from '@hive-force/actions';
import { MasterLog } from '@hive-force/log';
import { Subject } from 'rxjs';

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

export class InvisibilityEffect implements Effect {
  public name = "Invisible"
  public startTime: string
  public endTime: string
  public duration = 0
  public effects = ["Attack"]
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

export class DodgeEffect implements Effect {
  public name = "Dodge"
  public startTime: string
  public endTime: string
  public duration = 0
  public effects = ["Attack"]
  public description = "Player Dodges"
  public end = new Subject<boolean>()

  constructor(creature: CreatureAsset, duration: number) {
    this.duration = duration
  }

  public applyRule(attacker: CreatureAsset, attackee: CreatureAsset): any {
    attacker.attributes.hasDisadvantage = true
    attackee.attributes.hasAdvantage = true

    attackee.savingThrow()

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


export class StunnedEffect implements Effect {
  public name = "Stunned"
  public startTime: string
  public endTime: string
  public duration = 0
  public effects = ["movement", "attack", "actions"]
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



