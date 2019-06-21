// tslint:disable: radix
import { Component } from '@angular/core';
import { stringify } from '@angular/compiler/src/util';

import { Character, Attack } from "@hive-force/user"
import { compileBaseDefFromMetadata } from '@angular/compiler';

@Component({
  selector: 'hive-force-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public title = 'hive-force';
  public totalRollAmount = 0
  public characters: Array<Character> = []
  public id = 0
  public selectedCharacter: Character
  public message = ""

  public onClick(): void {
    const dice = new Dice();
    this.totalRollAmount = dice.roll('2d8+3 3d4 4d8+10').modifiedRollValue;
  }

  public addCharacter(): void {
    this.id++
    const character = new Character()
    character.proficiencyBonus = 2
    character.actions = []
    character.actionsRemaining = 2
    character.armorClas = 17
    character.attack = new Attack()
    character.bonusAction = ()=> { return }
    character.bonusActionsRemaining = 1
    character.bonusHp = 0
    character.challengeLevel = 0
    character.charisma = 15
    character.charismaModifier = 2
    character.constitution = 12
    character.constitutionModifier = 1
    character.currentHitPoints = 35
    character.damage = 0
    character.dexterity = 17
    character.dexterityModifier = 3
    character.experience = 1000
    character.height = 6
    character.hostile = false
    character.id = "123456-" + this.id
    character.immunities = []
    character.intelligence = 15
    character.intelligenceModifier = 2
    character.maxActions = 1
    character.maxBonusActions = 2
    character.maxHitPoints = 35
    character.name = "Steve" + this.id
    character.race = "Elf"
    character.senses = []
    character.skills = []
    character.speed = 45
    character.strength = 12
    character.strengthModifier = 2
    character.weight = 200
    character.wisdom = 16
    character.wisdomModifier = 3
    
    this.characters.push(character)
  }

  public attack(character: Character): void {
    const currentPlayer = character
    let rollEquation = `2d8+${currentPlayer.dexterityModifier}`
    const dice = new Dice();
    const attackRoll = dice.roll(`d20+${currentPlayer.dexterityModifier + currentPlayer.proficiencyBonus}`)

    if(attackRoll.actualRollValue === 20) {
      rollEquation = `4d8+${currentPlayer.dexterityModifier * 2}`
    }

    if(attackRoll.modifiedRollValue > this.selectedCharacter.armorClas) {
      const damage = new Dice().roll(rollEquation)
      this.selectedCharacter.currentHitPoints -= damage.modifiedRollValue
      this.message = `${currentPlayer.name} hit ${this.selectedCharacter.name} and took ${damage.modifiedRollValue} damage`
    } else {
      this.message = `${currentPlayer.name} missed!`
    }
  }

  public selectCharacter(character: Character): void {
    this.selectedCharacter = character
  }
}

export class Dice {
  public savedRoll: Array<DiceEquation> = [];

  public roll(diceEquation: string): Roll {
    const roll = new Roll()
    this.parseEquation(diceEquation);
    this.savedRoll.forEach(sr => {
      for( let i = 0; i < sr.numberOfRolls; i++ ) {
        roll.actualRollValue = this.getRandomInt(sr.numberOfSides)
        roll.modifiedRollValue += roll.actualRollValue
        console.log(`Roll${i}: d${sr.numberOfSides} for ${roll.actualRollValue}`)
      }
      console.log(`TotalRoll: d${sr.numberOfSides} for ${roll.modifiedRollValue}+${sr.rollModifier}=${roll.modifiedRollValue+sr.rollModifier}`)
      roll.modifiedRollValue += sr.rollModifier
    })

    return roll
  }

  public getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max) + 1 );
  }

  public parseEquation(diceEquation: string): any {
    const rolls = diceEquation.match(/(\d+d|d)([4,6,8]|\d+[10,12,20,100])(\+\d+|)/g);
    rolls.forEach(r => {
      const numberOfRolls = r.match(/\d+(?=d)/g);
      const dice = r.match(/(?<=d)(\?*\d+)/g);
      const modifer = r.match(/(?<=\+)(\?*\d+)/g);

      this.savedRoll.push(
        new DiceEquation(
          dice ? Number.parseInt(dice[0]) : 0,
          numberOfRolls ? Number.parseInt(numberOfRolls[0]) : 1,
          modifer ? Number.parseInt(modifer[0]) : 0,
          r
        )
      );
    });
  }
}

export class DiceEquation {
  constructor(
    public numberOfSides: number,
    public numberOfRolls: number,
    public rollModifier: number,
    public stringFormat: string,
  ) {}
}

export class Roll {
  public actualRollValue = 0
  public modifiedRollValue = 0
  public hasAdvantage = false
  public hasDisadvantage = false
}

