import { CreatureAsset, AttackAction, MoveAction } from '@hive-force/assets';
import { Weapon } from '@hive-force/items';
import { SpriteDB } from "./db/sprite.db"
import { Sprite, SlashHitAnimation, SlashAnimation, AnimatingWeapon } from '@hive-force/animations';

export class CreaturesList {
  public creatures: CreatureAsset[] = [];
  public xIndex = 0
  public motionIndex = 3

  constructor() {
    const steve = this.createAttributes("Steve", "basicSkeletonSprite")
    steve.attributes.immunities.push("stunning")
    steve.aggressive = true
    this.creatures.push(steve);
    this.creatures.push(this.createAttributes("Allen", "basicSkeletonSprite"));
    this.creatures.push(this.createAttributes("Martha" ,"basicSkeletonSprite"));
    const bobby = this.createAttributes("Bobby", "basicSkeletonSprite")
    bobby.attributes.resistances.push("nonmagical")
    this.creatures.push(bobby);
  }

  public addCreature(name: string, hp: number = 66) {
    const newCreature = this.createAttributes(name, "basicSkeletonSprite")
    newCreature.attributes.maxHitPoints = hp
    newCreature.attributes.currentHitPoints = hp
   
    this.creatures.push(newCreature)
  }

  createAttributes(name: string, creature: string, height = "75", width = "50" ): CreatureAsset {
    const zombieFred = new CreatureAsset();
    this.xIndex += 55
    this.motionIndex += 3
    zombieFred.frame = this.motionIndex
    zombieFred.id = `Zombie${name}`
    
    const sprite = new Sprite(new SpriteDB().get(creature))
    zombieFred.activeSprite = sprite;
    zombieFred.name = `Zombie ${name}`;
    zombieFred.level = 1;
    zombieFred.aggressive = true
    zombieFred.inventory = [];
    zombieFred.nonPlayableCharacter = true;
    const moveAction = new MoveAction()
    zombieFred.attributes = {
      attacksRemaining: 2,
      numberOfAttacksAllowed: 2,
      hasAdvantage: false,
      hasDisadvantage: false,
      actions: [ moveAction , new AttackAction() ],
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
      selectedAction: moveAction,
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
    
    const claw = new AnimatingWeapon()
    claw.description = 'Long Dirty Fingernails',
    claw.diceEquation = '1d6',
    claw.id = '12373',
    claw.name = 'Claw',
    claw.use = 'Weapon',
    claw.ranged = true,
    claw.range = 5,
    claw.equipped = true,
    claw.selected = true,
    claw.weaponType = 'versatile'
    claw.modifier = "strength"
    claw.overcomes = []
    claw.strikeAnimation = new SlashAnimation()
    claw.hitAnimation = new SlashHitAnimation()

    const bite = new AnimatingWeapon()
    bite.description = 'Teeth',
    bite.diceEquation = '1d6',
    bite.id = '12373',
    bite.name = 'Bite',
    bite.use = 'Weapon',
    bite.equipped = false,
    bite.ranged = true,
    bite.range = 5,
    bite.selected = false,
    bite.weaponType = 'versatile'
    bite.overcomes = []
    bite.strikeAnimation = new SlashAnimation()
    bite.hitAnimation = new SlashHitAnimation()

    zombieFred.inventory.push(claw, bite)
    return zombieFred
  }
}
