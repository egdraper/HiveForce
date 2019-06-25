import { Asset } from './assets.model';
import { Item } from '@hive-force/items';
import { Spell } from '@hive-force/spells';
import { Class } from "@hive-force/class";
import { Race }  from "@hive-force/race";

export class CreatureAsset extends Asset {
    public class?: Class
    public race?: Race
    public attributes: Attributes

 
  
    public calculateNewHitpoints(creature: CreatureAsset, amount: number) {
      const newHitPointsValue = creature.attributes.maxHitPoints + amount;
  
      // Character is dead
      if (newHitPointsValue <= 0) {
        creature.attributes.currentHitPoints = 0;
        return;
      }
  
      // Character is fully healed
      if (newHitPointsValue >= creature.attributes.maxHitPoints) {
        creature.attributes.currentHitPoints = creature.attributes.maxHitPoints + creature.attributes.bonusHp;
        return;
      }
  
      // Character's adjusted hitpoints
      creature.attributes.currentHitPoints = newHitPointsValue;
    }
  
    public reaction(type: string): void {
      // this.reactionService.getReaction(type)
    }
  
    public takeDamage(amount: number): void {
      this.attributes.currentHitPoints -= amount;
      if (this.attributes.currentHitPoints <= 0) {
        this.attributes.currentHitPoints = 0;
        // send subscription for user death
      }
    }
}

export class Attributes {
    public proficiencyBonus: number;
    public skillPoficiencies: Array<{skill: string, specialization?: string}>
    public weaponProficiencies: string[]
    public armorProficiencies: string[]
    public hostile: boolean;
    public bonusHp: number;
    public actions: string[];
    public bonusActions: string[];
    public maxActions: number;
    public maxBonusActions: number;
    public actionsRemaining: number;
    public bonusActionsRemaining: number;
    public armorClas: number;
    public challengeLevel: number;
    public damage: string;
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
    public senses: Array<any>;
    public size: "small" | "medium" | "large"
    public selected: boolean;
    public skills: Array<any>;
    public speed: number;
    public strength: number;
    public strengthModifier: number;
    public wisdom: number;
    public wisdomModifier: number;
    public height: number;
    public weight: number;
    public vision: number;
}