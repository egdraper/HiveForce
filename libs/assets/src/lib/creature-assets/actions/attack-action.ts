
import { Dice, Roll } from '@hive-force/dice';
import { Action, CreaturesEffect } from './action.model';
import { Weapon } from '@hive-force/items';
import { MasterLog } from '@hive-force/log';
import { cloneDeep } from 'lodash';
import { CreatureAsset } from '../creature.asset';
import { ActionAnimation, ActionResultTextAnimation, AnimatingWeapon} from '@hive-force/animations';

export enum DamageStatus {
  doubled,
  halved,
  regular,
  squelched
}

export class AttackAction extends Action {
  public name = 'Attack';
  public range = 1
  public disabled = false;
  public executeAsBonusAction = false;
  public executeAsReaction = false;
  public damageStatus: DamageStatus = DamageStatus.regular;
  public creatureModifiesDamage = false;  
  public iconUrl = "../assets/attack.png"
  public performanceAnimation: ActionAnimation
  public effectAnimation: ActionAnimation
  
  private halvedTimes = 1
  constructor(public usedFor: string = "Regular Attack") {
    super(usedFor)
  }

  public execute(
    player: CreatureAsset,
    creature: CreatureAsset
  ): CreaturesEffect {
    const weapon = player.getSelectedItem() as AnimatingWeapon
    this.performanceAnimation = weapon.strikeAnimation
    this.effectAnimation = weapon.hitAnimation
    
    if (!this.checkDependencies(player, creature, weapon)) {
      return;
    }

    const results = this.performAction(player, creature, weapon);

    // disables the attack button
    if (!this.executeAsBonusAction && !this.executeAsReaction) {
      // player.attributes.actionsPerformed.push(cloneDeep(this));
      player.attributes.attacksRemaining--;
    }

    if (player.attributes.attacksRemaining <= 0) {
      const playersAttack = player.attributes.actions.find(
        a => a.name === 'Attack'
      );
      playersAttack.disabled = true;
    }
    return results;
  }

  private checkDependencies(
    player: CreatureAsset,
    creature?: CreatureAsset,
    weapon?: Weapon
  ): boolean {
    // Must have creature selected
    if (!creature.selected) {
      return false;
    }

    // Allow action if a bonus action
    if (this.executeAsBonusAction) {
      return true;
    }

    // Must have attack actions remaining
    if (player.attributes.attacksRemaining === 0) {
      MasterLog.log(
        'You have no Attack Actions Remaining for this turn!!!',
        'ATTACK STOPPED'
      );
      return false;
    }

    if (player.applyReaction(weapon, creature, this)) {
      return false;
    }

    this.checkResilience(player,creature, weapon)

    if(this.damageStatus === DamageStatus.squelched) {
      return false
    }

    creature.effects.forEach(a => {
      if(a.affects.includes("Attack")) {
        a.applyRule(player, creature, this)
      }
    })

    return true;
  }

  public performAction(
    player: CreatureAsset,
    creature: CreatureAsset,
    weapon: Weapon
  ): CreaturesEffect {
    let totalHitPointsTaken: number;

    MasterLog.log(`${player.name} attacked ${creature.name} with the ${weapon.name}`);
    const attackRoll = this.rollAttack(player, weapon);

    const damageEquation = `${weapon.diceEquation}+${this.getWeaponTypeModifier(
      player,
      weapon
    )}`;

    if (attackRoll.modifiedRollValue > creature.attributes.armorClass) {
      MasterLog.log('DAMAGE');
      let damage = new Dice().roll(damageEquation);

      if (attackRoll.actualRollValue === 20) {
        MasterLog.log(`Critical Hit!!!`);
        const critDamage = new Dice().roll(damageEquation);
        damage.actualRollValue += critDamage.actualRollValue;
        damage.modifiedRollValue += critDamage.modifiedRollValue;
      }

      if(this.creatureModifiesDamage) {
       damage = creature.modifyDamage(damage)
      }

      switch (this.damageStatus) {
        case DamageStatus.halved:
          MasterLog.log(`${creature.name} is resistant to the attack`)
          totalHitPointsTaken = Math.floor(damage.modifiedRollValue / this.halvedTimes) * -1;
          creature.calculateNewHitPoints(totalHitPointsTaken);
          break;
        case DamageStatus.doubled: {
          MasterLog.log(`${creature.name} is vulnerable to ${weapon.name}`)
          totalHitPointsTaken = damage.modifiedRollValue * 2 * -1;
          creature.calculateNewHitPoints(totalHitPointsTaken);
          break;
        }
        case DamageStatus.regular: {
          totalHitPointsTaken = damage.modifiedRollValue * -1;
          creature.calculateNewHitPoints(damage.modifiedRollValue * -1);
          break;
        }
      }

      const textAnimation = new ActionResultTextAnimation()
      textAnimation.text = `${ totalHitPointsTaken }`
      textAnimation.color = "red"
      this.creaturesEffect = { creature: creature, effected: true, animationText: textAnimation };

      MasterLog.log(
        `${player.name} hit ${
          creature.name
        } and took ${totalHitPointsTaken} damage`
      );
    } else {
      const textAnimation = new ActionResultTextAnimation()
      textAnimation.text = "Missed!"
      textAnimation.color = "orange"
      this.creaturesEffect = { creature: creature, effected: false, animationText: textAnimation };
      MasterLog.log(`${player.name} missed!`);
    }

    return this.creaturesEffect;
  }

  public rollAttack(player: CreatureAsset, weapon: Weapon): Roll {
    const attackRoll = new Dice()
    attackRoll.withAdvantage = player.attributes.hasAdvantage
    attackRoll.withDisadvantage = player.attributes.hasDisadvantage
    
    const roll = attackRoll.roll(
      `d20+${this.getWeaponTypeModifier(player, weapon) +
      player.attributes.proficiencyBonus}`
    );

    return roll;
  }

  private getWeaponTypeModifier(
    player: CreatureAsset,
    weapon: Weapon
  ): number {
     if(weapon.weaponType === 'finesse') {
        return player.attributes.dexterityModifier >=
          player.attributes.strengthModifier
          ? player.attributes.dexterityModifier
          : player.attributes.strengthModifier;
     }

     if(weapon.modifier) {
       return player.attributes[`${weapon.modifier}Modifier`]
     }

     return 0
  }
  

  private checkResilience(player: CreatureAsset, creature: CreatureAsset, weapon: Weapon): void {
    if (player.checkIfOvercomes(weapon, creature)) {
      MasterLog.log(`${creature.name} overcame a resistance or immunity`)
      this.damageStatus = DamageStatus.regular;
      return;
    }

    if (creature.checkForImmunities(weapon)) {
      MasterLog.log(`${creature.name} is Immune to ${weapon.damageType} \n No Damage Taken`)
      
      this.damageStatus = DamageStatus.squelched;
    }

    if (creature.checkForVulnerabilities(weapon)) {
      this.damageStatus = DamageStatus.doubled; 
    }
    const resistances = creature.checkForResistances(weapon)
    if ( resistances.length > 0) {
      resistances.forEach( a => {
        this.halvedTimes = this.halvedTimes * 2 
        this.damageStatus = DamageStatus.halved
      })
      // half as many times as there is resistance
    }
  }
}
