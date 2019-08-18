import { Item, Weapon } from '@hive-force/items';
import { Dice, Roll } from '@hive-force/dice';
import { Subject } from 'rxjs';
import { MasterLog } from '@hive-force/log';
import { SelectableAsset } from '../assets.model';
import { Race } from './race/base.race';
import { Effect } from './effects/effects.model';
import { Action, CreaturesEffect } from './actions/action.model';
import { Movement } from './creature-view/movement';
import { Sprite } from './creature-view/sprite';
import { PlayerLocationService } from './creature-view/location';
import { Attributes } from './attributes/attributes';

export class CreatureAsset extends SelectableAsset {
  public startPos = Math.floor(Math.random() * Math.floor(15) + 1);
  public id: string;
  public name: string;
  public level: number;
  public nonPlayableCharacter: boolean;
  public race?: Race;
  public attributes: Attributes;
  public effects: Effect[] = [];
  public inventory: Array<Item>;
  public disabled: boolean;
  public aggressive = false;
  public inInitiative = false;
  public actionPerformed = new Subject<Action[]>();

  // battle
  public engagedWith: Array<CreatureAsset> = [];
  
  // visual attributes
  public location = new PlayerLocationService()
  public movement = new Movement(this)
  public sprite = new Sprite()
  public frameDelay = true;
  public frame = 0;

  public update(): void {
    this.frame >= 60 ? (this.frame = 0) : this.frame++;

    // updates the sprite image 3 times a second.
    if (this.movement.moving && (
      this.frame === 0  || 
      this.frame === 10 || 
      this.frame === 20 || 
      this.frame === 30 ||
      this.frame === 40 ||
      this.frame === 50)) 
      {
      this.sprite.doImageAdjustment()
    } else if(this.frame === 0 || this.frame === 20 || this.frame === 40 ){
      this.sprite.doImageAdjustment()
    }
    
    // Update is called 60 times a second. For animation we want 30 times a second. This only runs every other update for graphics.
    if (this.frameDelay) {
      this.location.positionX = this.location.readyPositionX;
      this.location.positionY = this.location.readyPositionY;
      
      if(this.movement.moving) {
        this.movement.move(this.movement.nextCell.posX, this.movement.nextCell.posY)
      }
    }
    this.frameDelay = !this.frameDelay;
  }

  public onCreatureSelect(): void {    
    this.selected = !this.selected;
  }

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
    const roll = new Dice().roll(`d20+${this.attributes.dexterityModifier}`);
    return roll.modifiedRollValue;
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
    return !!this.attributes.immunities.find(i => i === name);
  }

  public checkForImmunities(weapon: Weapon): boolean {
    return !!this.attributes.immunities.find(
      a =>
        a === weapon.attackType ||
        a === weapon.weaponType ||
        a === weapon.damageType
    );
  }

  public checkForResistances(weapon: Weapon): string[] {
    return this.attributes.resistances.filter(
      r =>
        r === weapon.attackType ||
        r === weapon.weaponType ||
        r === weapon.damageType
    );
  }

  public checkForVulnerabilities(weapon: Weapon): boolean {
    return !!this.attributes.vulnerabilities.find(
      v =>
        v === weapon.attackType ||
        v === weapon.weaponType ||
        v === weapon.damageType
    );
  }

  public executeAction(action: Action, creature: CreatureAsset): boolean | void | CreatureAsset | CreaturesEffect | CreaturesEffect[] {
    return action.execute(this, creature);
   
  }

  public applyReaction(
    weapon: Weapon,
    creature?: CreatureAsset,
    action?: Action
  ): boolean {
    return false;
  }

  public applyEffects(effect: Effect): void {
    this.effects.push(effect);
  }

  public modifyDamage(dice: Roll): Roll {
    return null;
  }

  public checkIfOvercomes(weapon: Weapon, creature: CreatureAsset): boolean {
    let immunity;
    let resistance;
    weapon.overcomes.forEach(overcome => {
      immunity = creature.attributes.immunities.find(i => i === overcome);
      resistance = creature.attributes.resistances.find(r => r === overcome);
    });

    return immunity || resistance;
  }

  public opportunityAttack(enemy: CreatureAsset): void {
    const attackAction = this.attributes.actions.find(a => a.name === 'Attack');

    MasterLog.log('');
    MasterLog.log(`${this.name} is performing an opportunity attack.`);
    const selected = enemy.selected
    enemy.selected = true;
    attackAction.executeAsReaction = true;
    attackAction.execute(this, enemy);
    enemy.selected = selected;
    MasterLog.log('-------');
  } 
}






