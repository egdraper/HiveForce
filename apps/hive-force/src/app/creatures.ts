import { CreatureAsset, AttackAction } from '@hive-force/assets';
import { Weapon } from '@hive-force/items';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

export class CreaturesList {
  public creatures: CreatureAsset[] = [];
  public xIndex = 0

  constructor() {
    const steve = this.createAttributes("Steve")
    steve.attributes.immunities.push("stunning")
    this.creatures.push(steve);
    this.creatures.push(this.createAttributes("Allen"));
    this.creatures.push(this.createAttributes("Martha"));
    const bobby = this.createAttributes("Bobby")
    bobby.attributes.resistances.push("nonmagical")
    this.creatures.push(bobby);
  }

  public addCreature(name: string, hp: number = 66) {
    const newCreature = this.createAttributes(name)
    newCreature.attributes.maxHitPoints = hp
    newCreature.attributes.currentHitPoints = hp
    this.creatures.push()
  }

  createAttributes(name: string): CreatureAsset {
    const zombieFred = new CreatureAsset();
    this.xIndex += 55
    zombieFred.positionX = 55
    zombieFred.positionY = 65
    zombieFred.name = `Zombie ${name}`;
    zombieFred.level = 1;
    zombieFred.inventory = [];
    zombieFred.nonPlayableCharacter = true;
    zombieFred.attributes = {
      attacksRemaining: 2,
      numberOfAttacksAllowed: 2,
      hasAdvantage: false,
      hasDisadvantage: false,
      actions: [ new AttackAction() ],
      actionsPerformed: [],
      actionsQueued: [],
      actionsRemaining: 2,
      armorProficiencies: [],
      armorClass: 12,
      bonusActions: [],
      bonusActionsRemaining: 0,
      bonusHp: 0,
      charisma: 10,
      charismaModifier: 0,
      constitution: 18,
      constitutionModifier: 4,
      currentHitPoints: 66,
      dexterity: 8,
      dexterityModifier: -1,
      experience: 0,
      height: 6,
      hostile: true,
      immunities: ["poison", "bludgeoning"],
      intelligence: 8,
      intelligenceModifier: -1,
      maxActions: 1,
      maxBonusActions: 0,
      maxHitPoints: 66,
      proficiencyBonus: 0,
      senses: ["blood"],
      size: 'medium',
      skills: [],
      skillProficiencies: [],
      strength: 16,
      strengthModifier: 3,
      weight: 200,
      weaponProficiencies: [],
      wisdom: 8,
      wisdomModifier: -1,
      resistances: ['piercing damage'],
      vulnerabilities: ["fire"]
    };
    
    const claw = new Weapon()
    claw.description = 'Long Dirty Fingernails',
    claw.diceEquation = '1d6',
    claw.id = '12373',
    claw.name = 'Claw',
    claw.use = 'Weapon',
    claw.equipped = false,
    claw.selected = false,
    claw.weaponType = 'versatile'

    const bite = new Weapon()
    bite.description = 'Teath',
    bite.diceEquation = '1d6',
    bite.id = '12373',
    bite.name = 'Bite',
    bite.use = 'Weapon',
    bite.equipped = false,
    bite.selected = false,
    bite.weaponType = 'versatile'

    zombieFred.inventory.push(claw, bite)
    return zombieFred
  }
}
