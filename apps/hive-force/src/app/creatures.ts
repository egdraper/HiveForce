import { CreatureAsset, AttackAction, Sprite, Cell } from '@hive-force/assets';
import { Weapon } from '@hive-force/items';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { setTestabilityGetter } from '@angular/core';
import { bindNodeCallback } from 'rxjs';

export class CreaturesList {
  public creatures: CreatureAsset[] = [];
  public xIndex = 0
  public motionIndex = 3

  constructor() {
    const steve = this.createAttributes("Steve", "../assets/zombie1.png")
    steve.attributes.immunities.push("stunning")
    steve.aggressive = true
    this.creatures.push(steve);
    this.creatures.push(this.createAttributes("Allen", "../assets/zombie1.png"));
    this.creatures.push(this.createAttributes("Martha" ,"../assets/zombie1.png"));
    const bobby = this.createAttributes("Bobby", "../assets/Axion_Dragon.png", "115", "100")
    bobby.attributes.resistances.push("nonmagical")
    this.creatures.push(bobby);
  }

  public addCreature(name: string, hp: number = 66) {
    const newCreature = this.createAttributes(name, "../asset/zombie1.png")
    newCreature.attributes.maxHitPoints = hp
    newCreature.attributes.currentHitPoints = hp
   
    this.creatures.push(newCreature)
  }

  createAttributes(name: string, imagePath: string, height = "75", width = "50" ): CreatureAsset {
    const zombieFred = new CreatureAsset();
    this.xIndex += 55
    this.motionIndex += 3
    zombieFred.frame = this.motionIndex
    zombieFred.id = `Zombie${name}`
    
    const sprite = new Sprite()
    sprite.imageAdjustment = {
      down: { order: [0,1,2,1], sprite: [{x: -313, y: -2},   {x: -365, y: -2 },   {x: -417, y: -2 }] },
      left: { order: [0,1,2,1], sprite: [{x: -313, y: -75},  {x: -365,  y: -75 },  {x: -417, y: -75 }] },
      right: { order: [0,1,2,1], sprite: [{x: -313, y: -147}, {x: -365,  y: -147 }, {x: -417, y: -147 }] },
      up: { order: [0,1,2,1], sprite: [{x: -313, y: -221}, {x: -365,  y: -221 }, {x: -417, y: -221 }] }
    }
    sprite.imgSource = "../assets/motw.png"
    sprite.imgBottomOffset = 5;
    zombieFred.sprite = sprite;
    zombieFred.name = `Zombie ${name}`;
    zombieFred.level = 1;
    zombieFred.aggressive = true
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
    claw.equipped = true,
    claw.selected = true,
    claw.weaponType = 'versatile'
    claw.modifier = "strength"
    claw.overcomes = []

    const bite = new Weapon()
    bite.description = 'Teath',
    bite.diceEquation = '1d6',
    bite.id = '12373',
    bite.name = 'Bite',
    bite.use = 'Weapon',
    bite.equipped = false,
    bite.selected = false,
    bite.weaponType = 'versatile'
    bite.overcomes = []

    zombieFred.inventory.push(claw, bite)
    return zombieFred
  }
}
