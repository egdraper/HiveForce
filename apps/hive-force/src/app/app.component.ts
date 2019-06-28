// tslint:disable: radix
import { Component } from '@angular/core'
import { MasterLog } from "@hive-force/log"
import { Dice, Rollable } from "@hive-force/dice"
import { Action, AttackAction, HideAction, HelpAction, DisengageAction,
  DodgeAction, DashAction, CastAction, HealAction,  } from "@hive-force/actions"
import { Weapon, Item } from '@hive-force/items';
import { CreatureAsset } from '@hive-force/assets';
import { HillDwarf } from '@hive-force/race';
import { Monk, ClassFeature, FurryOFBlows } from '@hive-force/class';

@Component({
  selector: 'hive-force-root',
  templateUrl: './app.component.html',  
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public message = ""
  public title = 'hive-force';
  public totalRollAmount = 0;
  public player: CreatureAsset;
  public creatures: Array<CreatureAsset> = [];
  public id = 0;

  public ngOnInit(): void {
    this.player = this.createCreature("Jahml");
    MasterLog.subscribe((m) => {
      this.message = m
    })
  }

  public onClick(): void {
    const dice = new Dice();
    this.totalRollAmount = dice.roll('2d8+3 3d4 4d8+10').modifiedRollValue;
  }

  public addCharacter(): void {
    this.creatures.push(this.createCreature());
  }

  public createCreature(name?: string): CreatureAsset {
    this.id++
    const creature = new CreatureAsset()

    creature.id = '123456-' + this.id,
    creature.name = name || 'Steve' + this.id,
    creature.primaryWeapon 
    creature.attributes = {
      actions: [],
      actionsRemaining: 2,
      armorProficiencies: [],
      armorClass: 12,
      bonusActions: [],
      bonusActionsRemaining: 3,
      bonusHp: 0,
      challengeLevel: 0,
      charisma: 15,
      charismaModifier: 2,
      constitution: 12,
      constitutionModifier: 1,
      currentHitPoints: 35,
      dexterity: 17,
      dexterityModifier: 3,
      experience: 1000,
      height: 6,
      hostile: false,
      immunities: [],
      intelligence: 15,
      intelligenceModifier: 2,
      inventory: this.getItems(),
      maxActions: 1,
      maxBonusActions: 2,
      maxHitPoints: 35,
      proficiencyBonus: 2,
      senses: [],
      size: "medium",
      skills: [],
      skillProficiencies: [],
      speed: 45,
      strength: 12,
      strengthModifier: 2,
      weight: 200,
      weaponProficiencies: [],
      wisdom: 16,
      wisdomModifier: 3,
      vision: 0,
    }  

    const hillDwarf = new HillDwarf(creature.attributes)
    const monk = new Monk(creature.attributes)
    monk.createClass()
    hillDwarf.buildCharacter()
    creature.class = monk
    creature.race = hillDwarf
    return creature;
  }

  public selectCharacter(character: CreatureAsset): void {
    character.selected = !character.selected;
  }

  public getSelectedCreatures(): Array<CreatureAsset> {
    return this.creatures.filter(c => c.selected) || []
  }

  public getAction(actionName: string): Action {
     switch(actionName){
     case "Attack":
       return new AttackAction()
     case "Help": 
       return new HelpAction() 
     case "Disengage":
       return new DisengageAction()
     case "Dash":
       return new DashAction()
     case "Hide":
       return new HideAction()  
     case "Cast":
       return new CastAction()
     case "Dodge": 
       return new DodgeAction() 
     case "Heal":
       return new HealAction()    
     }
  }

  private getClassFeature(name: string): ClassFeature {
    return new FurryOFBlows()
  }

  // for demo purposes
  private getItems(): Array<Weapon> {
    return [
      {
        description: 'Strong Weapon',
        diceEquation: '2d8',
        id: '1234',
        name: 'Mace',
        use: "Weapon",
        equipped: true,
        selected: false,
        type: "Brute",
      },
      {
        description: 'Small and Pokey',
        diceEquation: '1d4',
        id: '1237',
        name: 'Short Sword',
        use: "Weapon",
        equipped: false,
        selected: false,
        type: "Versatile",
      },
      {
        description: 'Fists of Fury',
        diceEquation: '1d6',
        id: '1235',
        equipped: true,
        name: 'Unarmed',        
        use: "Weapon",
        selected: true,
        type: "Finesse",
      },      
      {
        description: 'Long Bow',
        diceEquation: '1d12',
        id: '1236',
        name: 'Silver Bow',        
        use: "Weapon",
        equipped: false,
        selected: true,
        type: "Ranged",
      },
    ];
  } 
}

export class PlayerRace {
  public RaceName: string
  public size: number
}

export class PlayerClass {
  public archetype: string
}
