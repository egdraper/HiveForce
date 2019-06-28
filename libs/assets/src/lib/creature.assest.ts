import { Asset, SelectableAsset } from './assets.model';
import { Item, Weapon } from '@hive-force/items';
import { Spell } from '@hive-force/spells';
import { Class, ClassFeature } from '@hive-force/class';
import { Race } from '@hive-force/race';
import { DiceEquation, Dice, Rollable } from '@hive-force/dice';
import { Action } from '@hive-force/actions';

export class CreatureAsset extends SelectableAsset {
  public id: string
  public name: string
  public nonPlayableCharacter: boolean
  public primaryWeapon: Weapon
  public secondaryWeapon: Weapon
  public rangedWeapon: Weapon

  public class?: Class
  public race?: Race
  public attributes: Attributes
  public effects: Effects[] 
  public disabled

  public savingThrow(DC: number, skill?: string): boolean {
    console.log('Perform Saving Throw?: yes');
    const dice = new Dice();
    const modifierAmount = this.attributes[`${skill}Modifier`];
    const result = dice.roll(`d20+${modifierAmount}`);
    const saved = result.modifiedRollValue >= DC;
    console.log(saved ? `${this.name} saved!` : `${this.name} failed!`)
    console.log(`Rolled ${result.modifiedRollValue}: Needed ${DC}!`)
    return result.modifiedRollValue >= DC;
  }

  public disarm(): Weapon {
    const weapon = this.attributes.inventory.find(i => i.selected) as Weapon 
    this.attributes.inventory.forEach(i => i.selected = false)
    return weapon
  }

  public selectItem(item: Weapon): Weapon {
    const weapon = this.attributes.inventory.find(i => i.selected) as Weapon 
    this.attributes.inventory.forEach(i => i.selected = false)
    item.selected = true
    item.equipped = true

    return weapon
  }

  public executeAction(
    action: Action,
    selectedCreatures: Array<CreatureAsset>,
  ): void {
    action.execute(this, selectedCreatures)
  }

  public getSelectedItem(): Item {
    return this.attributes.inventory.find(i => i.selected === true)
  }

  public calculateNewHitPoints(amount: number) {
    const newHitPointsValue = this.attributes.currentHitPoints + amount;

    // Character is dead
    if (newHitPointsValue <= 0) {
      this.attributes.currentHitPoints = 0;
      return;
    }

    // Character is fully healed
    if (newHitPointsValue >= this.attributes.maxHitPoints) {
      this.attributes.currentHitPoints =
        this.attributes.maxHitPoints + this.attributes.bonusHp;
      return;
    }

    // Character's adjusted hitpoints
    this.attributes.currentHitPoints = newHitPointsValue;
  }

}

export class Effects {
    name: string
    duration: number
    remainingTime: number
} 

export class Attributes {
  public actions: Array<Action>;
  public actionsRemaining: number;
  public armorClass: number;
  public armorProficiencies: string[];
  public bonusActions: string[];
  public bonusActionsRemaining: number;
  public bonusHp: number;
  public challengeLevel: number;
  public charisma: number;
  public charismaModifier: number;
  public constitution: number;
  public constitutionModifier: number;
  public currentHitPoints: number;
  public dexterity: number;
  public dexterityModifier: number;
  public experience: number;
  public height: number;
  public hostile: boolean;
  public immunities: Array<Spell>;
  public intelligence: number;
  public intelligenceModifier: number;
  public inventory: Array<Item>;
  public maxActions: number;
  public maxBonusActions: number;
  public maxHitPoints: number;
  public proficiencyBonus: number;
  public senses: Array<any>;
  public size: 'small' | 'medium' | 'large';
  public skillProficiencies: Array<{ skill: string; specialization?: string }>;
  public skills: Array<any>;
  public speed: number;
  public strength: number;
  public strengthModifier: number;
  public vision: number;
  public weaponProficiencies: string[];
  public weight: number;
  public wisdom: number;
  public wisdomModifier: number;
}
