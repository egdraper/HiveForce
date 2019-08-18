import { UnarmedStrike } from '../class-features/monk-features/unarmed-strike.feature';
import { Weapon } from '@hive-force/items';
import { Dice, Roll } from '@hive-force/dice';
import { MasterLog } from '@hive-force/log';
import { AttackAction } from '../actions/attack-action';
import { UnarmoredDefense } from '../class-features/monk-features/unarmored-defence.feature';
import { FurryOFBlows, KnockProne, DisableReaction, KnockBack } from '../class-features/monk-features/furry-of-blows.feature';
import { StunningStrike } from '../class-features/monk-features/stunning-strike.feature';
import { StillnessOfMind } from '../class-features/monk-features/stillness-of-mind.feature';
import { Effect } from '../effects/effects.model';
import { CreatureAsset } from '../creature.asset';
import { Action } from '../actions/action.model';
import { HillDwarf } from '../race/dwarf.race';
import { Class } from './base.class';
import { MoveAction } from '../actions/move-action';
import { SlashAnimation, SlashHitAnimation } from '../animation';

export class Monk extends Class {
  public className = 'Monk';
  public ki = 2;

  constructor(public level: number = 1, public name: string, public archetype: string) {
    super();

    this.createClass();
    this.level = level
    
    for (let i = 1; i <= this.level; i++) {
      this.levelUp[`toLevel${i.toString()}`]();
    }

    this.attributes.selectedAction = this.attributes.actions[0]
  }

  public levelUp = {
    toLevel1: () => {
      this.attributes.actions.push(new MoveAction())
      this.attributes.actions.push(new AttackAction());
      const unarmored = new UnarmoredDefense();
      unarmored.execute(this);
    },
    toLevel2:() => {
      this.attributes.actions.push(new UnarmedStrike(this.actionPerformed));
    },
    toLevel3:() => {
      const furryOfBlows = new FurryOFBlows(this.actionPerformed)
      
      if(this.archetype === "Way of the Open Hand") {
        furryOfBlows.subActions.push(new KnockProne())
        furryOfBlows.subActions.push(new DisableReaction())
        furryOfBlows.subActions.push(new KnockBack())
      }

      this.attributes.actions.push(furryOfBlows);
    },
    toLevel4:() => {

    },
    toLevel5:() => {
      this.attributes.numberOfAttacksAllowed = 2;
      this.attributes.actions.push(new StunningStrike(this.actionPerformed));
    },
    toLevel6:() => {
      const unarmedWeapon = this.inventory.find(a => a.name === "Fist") as Weapon
      unarmedWeapon.overcomes.push("nonmagical")
    },
    toLevel7:() => {
       this.attributes.actions.push(new StillnessOfMind())
    },
    toLevel8:() => {

    },
    toLevel9:() => {

    },
    toLevel10:() => {
      this.attributes.immunities.push("disease")
      this.attributes.immunities.push("poison")
    },
    toLevel11:() => {

    },
    toLevel12:() => {

    },
    toLevel13:() => {

    },
    toLevel14:() => {

    },
    toLevel15:() => {

    },
    toLevel16:() => {

    },
    toLevel17:() => {

    },
    toLevel18:() => {

    },
    toLevel19:() => {

    },
    toLevel20:() => {

    },
  }

  public rollInitiative(): number {
    const roll = new Dice().roll(`d20+${this.attributes.dexterityModifier}`)

    if(this.level >= 20 && this.ki === 0) {
      this.ki = 4
    }

    return roll.modifiedRollValue
  }

  public applyEffects(effect: Effect): void {
    if(this.level >= 10 && effect.name === "Poison" || effect.name === "Disease") {
      return
    }

    if(this.level >= 15 && effect.name === "Age") {
      return
    }

    this.effects.push(effect)
  }

  public applyReaction(weapon: Weapon, creature: CreatureAsset, action: AttackAction): boolean {
    if(weapon.ranged) {
      action.creatureModifiesDamage = true
      return false
    }
  }

  public modifyDamage(damageRoll: Roll): Roll {
    if(this.level < 3) { return damageRoll }
    
    MasterLog.log(`${this.name} used Deflect Missiles` )
    const saveRoll = new Dice().roll(`1d10+${this.attributes.dexterityModifier + this.level}`)
    
    damageRoll.modifiedRollValue -= saveRoll.modifiedRollValue
    if(damageRoll.modifiedRollValue <= 0 ) {
      damageRoll.modifiedRollValue = 0
      MasterLog.log("The damage was Reduced to 0")
      // TODO: Monk needs to perform an action here 
    }
    return damageRoll
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
      const shortSword = new Weapon()
      shortSword.description = 'Small and Pokey',
      shortSword.diceEquation = '1d4',
      shortSword.id = '1237',
      shortSword.name = 'Short Sword',
      shortSword.use = 'Weapon',
      shortSword.equipped = true,
      shortSword.selected = true,
      shortSword.weaponType = 'finesse'
      shortSword.damageType = "Slashing"
      shortSword.attackType = "nonmagical"
      shortSword.ranged = false
      shortSword.modifier = "strength"
      shortSword.strikeAnimation = new SlashAnimation()
      shortSword.hitAnimation = new SlashAnimation()
      
      const fist = new Weapon()
      fist.description = 'Fists of Fury'
      fist.diceEquation = '1d6'
      fist.id = '1235'
      fist.equipped = true
      fist.selected = false
      fist.name = 'Fist'
      fist.use = 'Weapon'
      fist.weaponType = 'none'
      fist.damageType = "Bludgeoning"
      fist.attackType = "nonmagical"
      fist.ranged = false
      fist.modifier = "strength"  
      shortSword.strikeAnimation = new SlashAnimation()
      shortSword.hitAnimation = new SlashHitAnimation()

      return [fist, shortSword]
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
      selectedAction: undefined,
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
}
