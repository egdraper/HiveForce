import { Attributes, CreatureAsset } from '@hive-force/assets';
import { Class } from './base.class';
import { Action, AttackAction } from '@hive-force/actions';
import { StunningStrike } from './class-features/monk-features/stunning-strike.feature';
import { FurryOFBlows } from './class-features/monk-features/furry-of-blows.feature';
import { Weapon, Item } from '@hive-force/items';
import { UnarmoredDefense } from './class-features/monk-features';
import { UnarmedStrike } from './class-features/monk-features/unarmed-strike.feature';
import { Subject } from 'rxjs';
import { HillDwarf } from '@hive-force/race';

export class Monk extends Class {
  public className = 'Monk';
  public ki = 2;

  constructor(public level: number = 1, public name: string) {
    super();

    this.createClass();
    for (let i = 1; i < level; i++) {
      this.levelUp[`toLevel${i.toString()}`]();
    }
  }

  public levelUp = {
    toLevel1: () => {
      this.attributes.actions.push(new AttackAction());
      const unarmored = new UnarmoredDefense();
      unarmored.execute(this);
    },
    toLevel2:() => {
      this.attributes.actions.push(new UnarmedStrike(this.actionPerformed));
    },
    toLevel3:() => {
      this.attributes.actions.push(new FurryOFBlows(this.actionPerformed));
    },
    toLevel4:() => {

    },
    toLevel5:() => {
      this.attributes.numberOfAttacksAllowed = 2;
      this.attributes.actions.push(new StunningStrike(this.actionPerformed));
    },
    toLevel6:() => {
      const unarmedWeapon = this.inventory.find(a => a.name === "Fist") as Weapon
      unarmedWeapon.overcomes.push("nonmagical attack")
      unarmedWeapon.overcomes.push("nonmagical damage")
    }
  }

  public attack(): void {
    
  }


  public createClass(): void {
    this.createBaseCreature();
    this.getItems().forEach(a => this.inventory.push(a));
  }

  public loadClass(): void {
    // TODO - after db is setup
  }

  // for demo purposes
  private getItems(): Array<Weapon> {
    return [
      {
        description: 'Strong Weapon',
        diceEquation: '2d8',
        id: '1234',
        name: 'Mace',
        use: 'Weapon',
        equipped: true,
        selected: true,
        type: 'Brute'
      },
      {
        description: 'Small and Pokey',
        diceEquation: '1d4',
        id: '1237',
        name: 'Short Sword',
        use: 'Weapon',
        equipped: false,
        selected: false,
        type: 'Versatile'
      },
      {
        description: 'Fists of Fury',
        diceEquation: '1d6',
        id: '1235',
        equipped: true,
        name: 'Fist',
        use: 'Weapon',
        selected: false,
        type: 'Finesse',
        overcomes: []
      },
      {
        description: 'Long Bow',
        diceEquation: '1d12',
        id: '1236',
        name: 'Silver Bow',
        use: 'Weapon',
        equipped: false,
        selected: true,
        type: 'Ranged'
      }
    ];
  }

  public createBaseCreature(): void {
    this.id = '123456-' + this.name
    this.level = 6
    this.name = this.name || 'Steve'
    this.effects = []
    this.inventory = [];
    this.attributes = {
      attacksRemaining: 2,
      numberOfAttacksAllowed: 2,
      hasAdvantage: false,
      hasDisadvantage: false,
      actions: [],
      actionsPerformed: [],
      actionsQueued: [],
      actionsRemaining: 2,
      armorProficiencies: [],
      armorClass: 13,
      bonusActions: [],
      bonusActionsRemaining: 3,
      bonusHp: 0,
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
      maxActions: 1,
      maxBonusActions: 2,
      maxHitPoints: 35,
      proficiencyBonus: 2,
      senses: [],
      size: "medium",
      skills: [],
      skillProficiencies: [],
      strength: 12,
      strengthModifier: 2,
      weight: 200,
      weaponProficiencies: [],
      wisdom: 16,
      wisdomModifier: 3,
      resistances: ["nonmagical attack", "nonmagical damage"],
      vulnerabilities: [],
    }

    this.inventory = [];
    const hillDwarf = new HillDwarf(this.attributes);
    hillDwarf.buildCharacter();
    this.race = hillDwarf;
  }



  public ToLevel3() {

  }

  public ToLevel4() {
    // Slow Fall
  }

  public ToLevel5() {

  }

  public ToLevel6() {
  
  }

  public ToLevel7() {}
  public ToLevel8() {}
  public ToLevel9() {}
  public ToLevel10() {}
  public ToLevel11() {}
  public ToLevel12() {}
  public ToLevel13() {}
  public ToLevel14() {}
  public ToLevel15() {}
  public ToLevel16() {}
  public ToLevel17() {}
  public ToLevel18() {}
  public ToLevel19() {}
  public ToLevel20() {}
}
