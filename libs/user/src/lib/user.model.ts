import { Injectable } from '@angular/core';
import { isRegExp } from 'util';

export class UserInfo {
  id: string;
  userName: string;
  games: Array<Game>;
}

export class Game {
  id: string;
  name: string;
  players: { [id: string]: Player };
  maps: { [id: string]: Map };
}

export class Player {
  id: string;
  userName: string;
  character: PlayableCharacter;
}

export class Map {
  id: string;
  name: string;
  height: number;
  width: number;
  mapAssets: { [id: string]: MapAsset };
  playerAssets: { [id: string]: CreatureAsset };
}

export class Asset {
  id: string;
  name: string;
}

export class MapAsset extends Asset {
  xLocation: number;
  yLocation: number;
  xWidth: number;
  xHeight: number;
  shape: string;
  image: any;
}

export class TurrainAsset extends MapAsset {}

export class MoveableItemAsset extends MapAsset {}

export class NonMovableItemAsset extends MapAsset {}

export class CreatureAsset extends Asset {
  public proficiencyBonus: number;
  public race: string;
  public hostile: boolean;
  public bonusHp: number;
  public actions: string[];
  public bonusActions: Array<BonusAction>;
  public maxActions: number;
  public maxBonusActions: number;
  public actionsRemaining: number;
  public bonusActionsRemaining: number;
  public armorClas: number;
  public challengeLevel: number;
  public damage: Damage;
  public inventory: Array<Item>;
  public charisma: number;
  public charismaModifier: number;
  public constitution: number;
  public constitutionModifier: number;
  public dexterity: number;
  public dexterityModifier: number;
  public experience: number;
  public currentHitPoints: number;
  public maxHitPoints: number;
  public immunities: Array<Spell>;
  public intelligence: number;
  public intelligenceModifier: number;
  public senses: Array<Sense>;
  public selected: boolean;
  public skills: Array<Skill>;
  public speed: number;
  public strength: number;
  public strengthModifier: number;
  public wisdom: number;
  public wisdomModifier: number;

  public calculateNewHitpoints(character: Character, amount: number) {
    const newHitPointsValue = character.currentHitPoints + amount;

    // Character is dead
    if (newHitPointsValue <= 0) {
      character.currentHitPoints = 0;
      return;
    }

    // Character is fully healed
    if (newHitPointsValue >= character.maxHitPoints) {
      character.currentHitPoints = character.maxHitPoints + character.bonusHp;
      return;
    }

    // Character's adjusted hitpoints
    character.currentHitPoints = newHitPointsValue;
  }

  public reaction(type: string): void {
    // this.reactionService.getReaction(type)
  }

  public takeDamage(amount: number): void {
    this.currentHitPoints -= amount;
    if (this.currentHitPoints <= 0) {
      this.currentHitPoints = 0;
      // send subscription for user death
    }
  }

  private checkActionStatus(): void {
    // check to see how may actions or bonus actions remain.
  }
}

export class Action {
  public name: string;
  public execute(
    currentPlayer: Character,
    characters?: Array<Character>,
    rollable?: Rollable
  ): void {}
}

export class BonusAction extends Action {}

export class Roll {
  public actualRollValue = 0;
  public modifiedRollValue = 0;
  public hasAdvantage = false;
  public hasDisadvantage = false;
}

export class DiceEquation {
  constructor(
    public numberOfSides: number,
    public numberOfRolls: number,
    public rollModifier: number,
    public stringFormat: string
  ) {}
}

export class Dice {
  public savedRoll: Array<DiceEquation> = [];

  public roll(diceEquation: string): Roll {
    const roll = new Roll();
    this.parseEquation(diceEquation);
    this.savedRoll.forEach(sr => {
      for (let i = 0; i < sr.numberOfRolls; i++) {
        roll.actualRollValue = this.getRandomInt(sr.numberOfSides);
        roll.modifiedRollValue += roll.actualRollValue;
        console.log(
          `Roll${i}: d${sr.numberOfSides} for ${roll.actualRollValue}`
        );
      }
      console.log(
        `TotalRoll: d${sr.numberOfSides} for ${roll.modifiedRollValue}+${
          sr.rollModifier
        }=${roll.modifiedRollValue + sr.rollModifier}`
      );
      roll.modifiedRollValue += sr.rollModifier;
    });

    return roll;
  }

  public getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max) + 1);
  }

  public parseEquation(diceEquation: string): any {
    const rolls = diceEquation.match(
      /(\d+d|d)([4,6,8]|\d+[10,12,20,100])(\+\d+|)/g
    );
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

export class HealAction implements Action {
  public name = 'Heal';
  public execute(currentPlayer: Character, characters: Array<Character>): void {
    const rollEquation = `1d12+2`;
    const heal = new Dice().roll(rollEquation);

    characters.forEach(character => {
      if (!character.selected) {
        return;
      }

      character.calculateNewHitpoints(character, heal.modifiedRollValue);
      console.log(
        `${currentPlayer.name} healed ${character.name} for ${
          heal.modifiedRollValue
        }`
      );
    });
  }
}

export class AttackAction implements Action {
  public name = 'Attack';

  public execute(currentPlayer: Character, characters: Array<Character>, rollable: Rollable): void {
    const rollEquationWithModifer =
      rollable.diceEquation + '+' + currentPlayer.dexterityModifier;
    const dice = new Dice();
    const attackRoll = dice.roll(
      `d20+${currentPlayer.dexterityModifier + currentPlayer.proficiencyBonus}`
    );

    characters.forEach(character => {
      if (!character.selected) {
        return;
      }

      if (attackRoll.modifiedRollValue > character.armorClas) {
        const damage = new Dice().roll(rollEquationWithModifer);

        if (attackRoll.actualRollValue === 20) {
          const critDamage = new Dice().roll(rollEquationWithModifer);
          damage.actualRollValue += critDamage.actualRollValue;
          damage.modifiedRollValue += critDamage.modifiedRollValue;
        }

        character.calculateNewHitpoints(
          character,
          damage.modifiedRollValue * -1
        );
        console.log(
          `${currentPlayer.name} hit ${character.name} and took ${
            damage.modifiedRollValue
          } damage`
        );
      } else {
        console.log(`${currentPlayer.name} missed!`);
      }
    });
  }
}

export class Damage {}

export interface Rollable {
  diceEquation: string;
}

export class Spell {
  public id: string;
  public name: string;
  public description: string;
  public levels: string[];
}

export class Item {
  public id: string;
  public name: string;
  public description: string;
}

export class RollableItem extends Item implements Rollable {
  public diceEquation: string;
}

export class RollableSpell extends Spell implements Rollable {
  public diceEquation: string;
}

export class Weopon extends RollableItem {
  public strengthRequiremnt?: number;
  public type?: 'Meele' | 'Ranged' | 'Finess';
}

export class AttackSpell extends RollableSpell {

}

export class MagicalItem extends Item {}

export class Sense {}

export class Skill {}

export class Character extends CreatureAsset {
  height: number;
  weight: number;
}

export class NonPlayableCharacter extends Character {}

export class PlayableCharacter extends Character {
  level: number;
}
