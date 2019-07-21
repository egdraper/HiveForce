import { SelectableAsset } from './assets.model';
import { Item, Weapon } from '@hive-force/items';
import { Spell } from '@hive-force/spells';
import { Class } from '@hive-force/class';
import { Race } from '@hive-force/race';
import { Dice, Roll } from '@hive-force/dice';
import { Action } from '@hive-force/actions';
import { Subject } from 'rxjs';
import { MasterLog } from '@hive-force/log';


export class CreatureAsset extends SelectableAsset {
  public id: string;
  public name: string;
  public level: number;
  public nonPlayableCharacter: boolean;

  public race?: Race;
  public attributes: Attributes;
  public effects: Effect[] = []
  public inventory: Array<Item>;
  public disabled: boolean;

  public actionPerformed = new Subject<Action[]>()

  public savingThrow(DC: number, skill?: string): boolean {
    MasterLog.log('Perform Saving Throw?: yes');

    const dice = new Dice();
    const modifierAmount = this.attributes[`${skill}Modifier`];
    const result = dice.roll(`d20+${modifierAmount}`);
    const saved = result.modifiedRollValue >= DC;
    MasterLog.log(saved ? `${this.name} saved!` : `${this.name} failed!`);
    MasterLog.log(`Rolled ${result.modifiedRollValue}: Needed ${DC}!`);
    MasterLog.log(`-------`);
    return result.modifiedRollValue >= DC;

  }

  public disarm(): Weapon {
    const weapon = this.inventory.find(i => i.selected) as Weapon;
    this.inventory.forEach(i => (i.selected = false));
    return weapon;
  }

  public selectItem(item: Weapon): Weapon {
    const weapon = this.inventory.find(i => i.selected) as Weapon;
    this.inventory.forEach(i => (i.selected = false));
    item.selected = true;
    item.equipped = true;

    return weapon;
  }

  public rollInitiative(): number {
    const roll = new Dice().roll(`d20+${this.attributes.dexterityModifier}`)
    return roll.modifiedRollValue
  }

  public getSelectedItem(): Item {
    return this.inventory.find(i => i.selected === true);
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

  public checkForConditionImmunities(name: string): boolean {
    return !!this.attributes.immunities.find(i => i === name)
  }
  
  public checkForImmunities(weapon: Weapon): boolean {
    return !!this.attributes.immunities.find(a => a === weapon.attackType || a === weapon.weaponType || a === weapon.damageType)
  }

  public checkForResistances(weapon: Weapon): string[] {
    return this.attributes.resistances.filter(r => r === weapon.attackType || r === weapon.weaponType || r === weapon.damageType)
  }

  public checkForVulnerabilities(weapon: Weapon): boolean {
    return !!this.attributes.vulnerabilities.find(v => v === weapon.attackType || v === weapon.weaponType || v === weapon.damageType)
  }

  public executeAction(action: Action, creature: CreatureAsset): void {
    action.execute(this, creature)
  }

  public applyReaction(weapon: Weapon, creature?: CreatureAsset, action?: Action): boolean {
    return false
  }

  public applyEffects(effect: Effect): void {
    this.effects.push(effect)
  }

  public modifyDamage(dice: Roll): Roll {
    return null
  }
}

export interface Effect {
  name: string;
  description: string;
  duration: number;
  startTime: string;
  endTime: string;
  effects: string[];

  applyRule: (attacker?: CreatureAsset, attackee?: CreatureAsset, action?: Action) => void
  removeRule: (attacker?: CreatureAsset, attackee?: CreatureAsset, action?: Action) => void
  check: () => void
}

export class Attributes {
  public actions: Array<Action>;
  public actionsPerformed: Array<Action>;
  public actionsQueued: Array<Action>;
  public actionsRemaining: number;
  public armorClass: number;
  public armorProficiencies: string[];
  public attacksRemaining: number;
  public bonusActions: string[];
  public bonusActionsRemaining: number;
  public bonusHp: number;
  public charisma: number;
  public charismaModifier: number;
  public constitution: number;
  public constitutionModifier: number;
  public currentHitPoints: number;
  public dexterity: number;
  public dexterityModifier: number;
  public experience: number;
  public hasAdvantage: boolean;
  public hasDisadvantage: boolean;
  public height: number;
  public hostile: boolean;
  public immunities: string[];
  public intelligence: number;
  public intelligenceModifier: number;
  public maxActions: number;
  public maxBonusActions: number;
  public maxHitPoints: number;
  public numberOfAttacksAllowed: number;
  public proficiencyBonus: number;
  public resistances: string[];
  public senses: Array<any>;
  public size: 'small' | 'medium' | 'large';
  public skillProficiencies: Array<{ skill: string; specialization?: string }>;
  public skills: Array<any>;
  public strength: number;
  public strengthModifier: number;
  public vulnerabilities: string[]
  public weaponProficiencies: string[];
  public weight: number;
  public wisdom: number;
  public wisdomModifier: number;
  public spells?: Spell[]
}
