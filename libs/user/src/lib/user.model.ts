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
    public proficiencyBonus: number
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

  public performAction(type: string, actionPerformer: CreatureAsset, againstWho: Array<CreatureAsset>): void {
      this.creature = actionPerformer
      this.getAction(type)
  }

  private getAction(type: string) : Action {
      // TODO: this will get it from a master list of actions
      return null
  }
}

export class Damage {

}

export class Attack {
  public attacks: Array<Weopon> = []
//   public dice = new Dice()

  public strike(creatureAttacking: CreatureAsset, creatureBeingAttacked: CreatureAsset) {
      this.attacks.forEach((weopon) => {
        // const result = this.dice.roll(creatureAttacking, weopon)
        // creatureBeingAttacked.takeDamage(result)
        // GameLog("creature lost so much life")
      })
  }

  public addStrike(weopon: Weopon): void { }

  public clear(): void { }

  public removeWeopon(): void { }
}

export class RollableObject {
    public diceEquation: string
}

export class Weopon extends RollableObject {
    constructor (
      public description: string,
      public diceEquation: string,
      public name: string,
      public strengthRequiremnt?: number,
      public type?: string,
    ) {
      super()
    }
}

// export class Dice {
//     private dice: Array<{timesRoll: number, numberOfSides: number, modifier: number}>

//     // 2d4+3 || 2d4+3d6+14 || d4
//     public roll(diceEquation: string): void {
//         // this.parseDice()
//         // this.rollPerDice(diceEquation)
//         // return "10"
//     }

//     private rollPerDice(diceName: string): void {
//         // const numberOfRolls = Number.parseInt(diceName.substring(0, diceName.indexOf('d')), 10) || 1;
//         // const dice = Number.parseInt(diceName.substring(diceName.indexOf('d'), , 10) || 1;
//         // let totalValue = 0
       
//         // for (let i = 0; i < numberOfRolls; i++) { 
//         //     totalValue += this.getRandomInt(4)
//         // }
//     }

//     private parseDiceEquation(diceEquation): any { 
//         const diceStrings = ["3d8+6", "d4", "d4+6"]
//         diceStrings.forEach(diceString => {
//             const numberOfRolls = Number.parseInt(diceString.substring(0, diceString.indexOf('d')), 10) || 1;
//             const numberOfSides = Number.parseInt(diceString.substring(diceString.indexOf("d") + 1))
//         });
//     }

//     private getRandomInt(max: number): number {
//        return Math.floor(Math.random() * Math.floor(max));
//     }
        
// 	​
      
// }

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


