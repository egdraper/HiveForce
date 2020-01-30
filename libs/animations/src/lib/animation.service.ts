import { Injectable } from "@angular/core";

@Injectable()
export class AnimationService {



}


/**
 * 
 * DATA
creatureAsset = {
    spriteAnimation : {
        move: {
          imageUrl: "../asset/sheet.png"  
          spriteSheet: [{ sheetLocX: 0, sheetLocY: 0 }]
          imageOrder: [0]
        },
        die: {
          imageUrl: "../asset/die.png"  
          spriteSheet: [{ sheetLocX: 0, sheetLocY: 0 }]
          imageOrder: [0]
        },
        prone: {
          imageUrl: "../asset/sheet.png"  
          spriteSheet: [{ sheetLocX: 0, sheetLocY: 0 }]
          imageOrder: [0]
        },
    }
}

dice = {
    spriteAnimation : {
        roll: {
          imageUrl: "../asset/dice.png"  
          spriteSheet: [{ sheetLocX: 10, sheetLocY: 12 }, { sheetLocX: 21, sheetLocY: 24 } ]
          imageOrder: [0 , 1]
        },
    }
}


CLASSES

class MapAsset() {
    public spriteAnimation: {[key: string]: SpriteAnimation}
    public name: string
    public id: string
    public location: Location

    constructor(animationService: AnimationService)

    public animateIdle(): void {
        AnimationService.start(id, spriteAnimation, "idle")
    }

    public async animateMove(): void {
       AnimationService.start(id, spriteAnimation, "move")
    }

    public async move(toCell: Cell): {
      // start movement
    }
}

class CreatureAsset extends MapAsset {
    Attributes: Attributes

    public async animateDeath(): Promise<void> {
      AnimationService.start(id, spriteAnimation, "death")
    }

    public async animateProne(): Promise<void> {
      AnimationService.start(id, spriteAnimation, "prone")
    }

    public async animateAttack(type: string): Promise<void> {
      AnimationService.start(, currentWeapon.attack.spriteAnimation, type, true ) // true allows for multiple animations
    }

    public async animateMagic(spell: string): Promise<void> {
      AnimationService.start(id, currentWeapon.attack.spriteAnimation, type, true ) // true allows for multiple animations
    }
}


class Animation {
  

}

class AssetAnimation {

}

class 

class attackAnimation extends Animation {
  constructor(public sprite: SpriteModel) {
    
  }




}

class PopCan {
  height: number = 5
  color: number = gold
  brandName: string = "diet coke"
  oz: number = 12
  
  public sip() {
    this.oz =  oz- 1
  }
}



application ScoreTheBasket

Class game {
  player: string
  score: string

  throw(): {
    
  }
}



AnimationService.start(creatureAsset, "move")
AnimationService.start(creatureAsset, "die")
AnimationService.start(creatureAsset, "prone")
AnimationService.start(dice, "roll")

 */