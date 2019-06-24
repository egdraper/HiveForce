// tslint:disable: radix
import { Component } from '@angular/core';

import {
  Character,
  AttackAction,
  HealAction,
  Dice,
  Item,
  Weopon,
  Action,
  Rollable,
  Roll,
  RollableItem,
  MasterLog
} from '@hive-force/user';

@Component({
  selector: 'hive-force-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public message = ""
  public title = 'hive-force';
  public totalRollAmount = 0;
  public player: Character;
  public characters: Array<Character> = [];
  public id = 0;
  public selectedCharacters: Array<Character>;

  public ngOnInit(): void {
    this.player = this.createCharacter("Jahml");
    MasterLog.subscribe((m) => {
      debugger
      this.message = m
    })
  }

  public onClick(): void {
    const dice = new Dice();
    this.totalRollAmount = dice.roll('2d8+3 3d4 4d8+10').modifiedRollValue;
  }

  public addCharacter(): void {
    this.characters.push(this.createCharacter());
  }

  public createCharacter(name?: string): Character {
    this.id++;
    const character = new Character();
    character.proficiencyBonus = 2;
    character.actionsRemaining = 2;
    character.armorClas = 17;
    character.actions = [ "Attack", "Heal", "Move" ];
    character.bonusActions = [];
    character.bonusActionsRemaining = 3;
    character.bonusHp = 0;
    character.challengeLevel = 0;
    character.charisma = 15;
    character.charismaModifier = 2;
    character.constitution = 12;
    character.constitutionModifier = 1;
    character.currentHitPoints = 35;
    character.damage = 0;
    character.dexterity = 17;
    character.dexterityModifier = 3;
    character.experience = 1000;
    character.height = 6;
    character.hostile = false;
    character.id = '123456-' + this.id;
    character.immunities = [];
    character.inventory = this.getItems();
    character.intelligence = 15;
    character.intelligenceModifier = 2;
    character.maxActions = 1;
    character.maxBonusActions = 2;
    character.maxHitPoints = 35;
    character.name = name || 'Steve' + this.id;
    character.race = 'Elf';
    character.senses = [];
    character.skills = [];
    character.selected = false;
    character.speed = 45;
    character.strength = 12;
    character.strengthModifier = 2;
    character.weight = 200;
    character.wisdom = 16;
    character.wisdomModifier = 3;
    return character;
  }

  public executeAction(action: Action, rollable?: Rollable): void {
    action.execute(this.player, this.characters, rollable);
  }

  public performFeature(feature: ClassFeature) {
    feature.perform(this.player, this.characters)
  }

  public selectCharacter(character: Character): void {
    character.selected = !character.selected;
  }

  public getAction(actionName: string): Action {
     switch(actionName){
     case "Attack":
       return new AttackAction()
     case "Heal": 
       return new HealAction() 
     case "Disengage":
       return new HealAction()
     case "Dash":
       return new HealAction()
     case "Hide":
       return new HealAction()  
     }
  }

  private getClassFeature(name: string): ClassFeature {
    return new FurryOFBlows()
  }

  // for demo purposes
  private getItems(): Array<Weopon> {
    return [
      {
        description: 'Strong Weopon',
        diceEquation: '2d8',
        id: '1234',
        name: 'Mace',
        type: 'Finess',
        strengthRequiremnt: 0,
      },
      {
        description: 'Fists of Fury',
        diceEquation: '1d6',
        id: '1235',
        name: 'Unarmed Strike',
        type: "Meele",
        strengthRequiremnt: 0,
      },
    ];
  } 


}

export class ClassFeature { 
 public startLevel: number
 public name: string
 public savingThrow?: string
 public usesAction?: boolean
 public usesBonusAction?: boolean
 public usesReaction?: boolean
 public usesActionPoints?: boolean
 public actionPointAmmount?: number
 public durration?: string

 public perform(player?: Character, characters?: Array<Character>) {} 
  

}

export class FurryOFBlows implements ClassFeature {
  public name = "Furry of Blows"
  public startLevel = 3
  public durration = "action"
  public usesActionPoints = true
  public usesBonusAction = true
  public 
  public perform(player?: Character, characters?: Array<Character>) {
    if(player.bonusActionsRemaining > 0) { 
      player.bonusActionsRemaining--
    } else {
      console.log("You have no Bonus Action Remaining")
      return
    }
  //  if(player.class.ki > 0) { 
  //     player.class.ki -- 
  //   } else {
  //     console.log("You have insificient Ki points")
  //   }
   
    new AttackAction().execute(player, characters,  { diceEquation: '1d6' })
  
    new AttackAction().execute(player, characters, { diceEquation: '1d6' })
    MasterLog.log(player, "Did Furry of blows")

  } 
}

export class PlayerRace {
  public RaceName: string
  public size: number
}

export class PlayerClass {
  public archetype: string
  
  public ToLevel1() {}
  public ToLevel2() {}
  public ToLevel3() {}
  public ToLevel4() {}
  public ToLevel5() {}
  public ToLevel6() {}
  public ToLevel7() {}
  public ToLevel8() {}
  public ToLevel9() {}
  public ToLevel10() {}
  public ToLevel11() {}
  public ToLevel12() {}
  public ToLevel13() {}
  public ToLevel14() {}
}
