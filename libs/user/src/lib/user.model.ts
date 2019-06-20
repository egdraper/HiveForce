import { Injectable } from '@angular/core';

export class UserInfo {
    id: string
    userName: string
    games: Array<Game>
}

export class Game {
    id: string
    name: string
    players: { [id: string]: Player }
    maps: { [id: string]: Map }
}

export class Player {
    id: string
    userName: string
    character: PlayableCharacter
}

export class Map {
    id: string
    name: string
    height: number
    width: number
    mapAssets: { [id: string]: MapAsset }
    playerAssets: { [id: string]: CreatureAsset }
}

export class Asset {
    id: string
    name: string
}

export class MapAsset extends Asset {
    xLocation: number
    yLocation: number
    xWidth: number
    xHeight: number
    shape: string
    image: any
}

export class TurrainAsset extends MapAsset {

}

export class MoveableItemAsset extends MapAsset {

}

export class NonMovableItemAsset extends MapAsset {

}

export class CreatureAsset extends Asset {
    public race: string
    public hostile: boolean
    public bonusHp: number
    public actions: Array<Action>
    public maxActions: number
    public maxBonusActions: number
    public actionsRemaining: number
    public bonusActionsRemaining: number
    public armorClas: number
    public challengeLevel: number
    public damage: Damage
    public attack: Attack
    public charisma: number
    public charismaModifier: number
    public constitution: number
    public constitutionModifier: number
    public dexterity: number
    public dexterityModifier: number
    public experience: number
    public currentHitPoints: number
    public maxHitPoints: number
    public immunities: Array<Spell>
    public intelligence: number
    public intelligenceModifier: number
    public senses: Array<Sense>
    public skills: Array<Skill>
    public speed: number
    public strength: number
    public strengthModifier: number
    public wisdom: number
    public wisdomModifier: number

    public action(type: string, against?: Array<CreatureAsset>): void {
        // this.actionService.perfomAction(type, this, against) 
        // --this.actionsRemaining   
    }

    public bonusAction(type: string, against?: Array<CreatureAsset> ): void {
        // this.actionService.performAction(type, this, against)
        // --this.bonusActionsRemaining
    }

    public heal(amount: number): void {
        if((amount + this.currentHitPoints + this.bonusHp) >= this.maxHitPoints) {
            this.currentHitPoints = (this.maxHitPoints + this.bonusHp)
        } else {
            this.currentHitPoints += (amount + this.bonusHp)
        }
    }

    public reaction(type: string): void {
        // this.reactionService.getReaction(type)
    }

    public takeDamage(amount: number): void {
        this.currentHitPoints -= amount
        if(this.currentHitPoints <= 0){
            this.currentHitPoints = 0
            // send subscription for user death
        }
    }

    private checkActionStatus(): void {
        // check to see how may actions or bonus actions remain.
    }
}

@Injectable()
export class Action {
  onlyAsBonus: boolean
  creature: CreatureAsset

  public performAction(type: string, actionPerformer: CreatureAsset, againstWho: CreatureAsset): void {
      this.creature = actionPerformer
      this.getAction(type)
  }

  private getAction(type: string) : Action {
      // TODO: this will get it from a master list of actions
      return null
  }

// tslint:disable-next-line: member-ordering
  private actions: Action[] = [
    {
        type: "Attack",
        excecute: () => {

        }
    },

]
  
}

export class Damage {

}

export class Attack {
  public attacks: Array<Weopon> = []
  public dice = new Dice()

  public strike(creatureAttacking: CreatureAsset, creatureBeingAttacked: CreatureAsset) {
      this.attacks.forEach((weopon) => {
        const result = this.dice.roll(creatureAttacking, weopon)
        creatureAttacking.takeDamage(result)
        // GameLog("creature lost so much life")
      })
  }

  public addStrike(weopon: Weopon): void {
    this.
  }

  public clear(): [

  ]

  public removeWeopon(): [

  ]
}

export class RollableObject {
    public diceName: string
}

export class Weopon extends RollableObject {
    public name: string
    public type: string
    public strengthRequiremnt?: number
}

export class Dice {
    private dice: Array<{timesRoll: number, numberOfSide: number, modifier: number}>-- 

    public roll(diceName): string {
        this.rollPerDice(diceName)
        return "10"
    }

    private rollPerDice(diceName: string): roll {
        const numberOfRolls = Number.parseInt(diceName.substring(0, diceName.indexOf('d')), 10) || 1;
        const dice = Number.parseInt(diceName.substring(diceName.indexOf('d'), , 10) || 1;
        let totalValue = 0
       
        for (let i = 0; i < numberOfRolls; i++) { 
            totalValue += this.getRandomInt(4)
        }
    }

    private getRandomInt(max: number): number {
       return Math.floor(Math.random() * Math.floor(max));
    }
        
	​
      
}

export class Sense {

}

export class Spell {

}

export class Skill {

}

export class Character extends CreatureAsset {
    height: number
    weight: number
}

export class NonPlayableCharacter extends Character {

}

export class PlayableCharacter extends Character {
    level: number
}


