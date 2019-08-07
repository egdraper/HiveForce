import { Item, Weapon } from '@hive-force/items';
import { Spell } from '@hive-force/spells';
import { Dice, Roll } from '@hive-force/dice';
import { Subject } from 'rxjs';
import { MasterLog } from '@hive-force/log';
import { SelectableAsset } from '../assets.model';
import { Race } from './race/base.race';
import { Effect } from './effects/effects.model';
import { Action } from './actions/action.model';
import { Cell } from '../model';
import { cloneDeep, remove } from "lodash"
import { ShortestPath } from './shortest-path';

export class SpriteSection {
  order: number[];
  sprite: Array<{ x: number; y: number }>;
}

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
  
  // visual attritubes
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

  public executeAction(action: Action, creature: CreatureAsset): void {
    action.execute(this, creature);
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
  public vulnerabilities: string[];
  public weaponProficiencies: string[];
  public weight: number;
  public wisdom: number;
  public wisdomModifier: number;
  public spells?: Spell[];
}

export class Movement {
  public moving = false
  public path: any
  public nextCell: Cell
  public redirect: any

  constructor(
    public player: CreatureAsset) {}

  public moveCharacter(direction: string, cell: Cell, creaturesOnGrid: Array<CreatureAsset>, creatureFacingOverride?: string): void {
    // creatureFacingOverride prevents the creature from turning around when knocked back
    
    if(this.player.attributes.currentHitPoints <= 0) { 
      return 
    }
    
    if (this.player.activePlayer) {
      this.player.sprite.direction = creatureFacingOverride || direction


      // Up
      if (direction === "up" && this.player.location.cell.y > 0) {
        if (cell.obstacle || !!this.checkForCreatureAtCell(cell, creaturesOnGrid)) {
          return;
        }
        this.player.location.zIndex --
        this.player.location.cell = cell
        this.player.location.readyPositionY = this.player.location.cell.y * 50;
        this.checkSurroundings(cell, creaturesOnGrid);
      }

      // Left
      if (direction === "left" && this.player.location.cell.x > 0) {
        if (cell.obstacle || !!this.checkForCreatureAtCell(cell, creaturesOnGrid)) {
          return;
        }
        this.player.location.cell = cell;
        this.player.location.readyPositionX = this.player.location.cell.x * 50;
        this.checkSurroundings(cell, creaturesOnGrid);
      }

      // Right
      if (direction === "right"  && this.player.location.cell.x < 15) {
        if (cell.obstacle || !!this.checkForCreatureAtCell(cell, creaturesOnGrid)) {
          return;
        }
        this.player.location.cell = cell;
        this.player.location.readyPositionX =
          this.player.location.cell.x * 50;
          this.checkSurroundings(cell, creaturesOnGrid);
      }

      // Down
      if (direction === "down" && this.player.location.cell.y < 15) {
        if (cell.obstacle || !!this.checkForCreatureAtCell(cell, creaturesOnGrid)) {
          return;
        }
        this.player.location.zIndex ++
        this.player.location.cell = cell;
        this.player.location.readyPositionY =
          this.player.location.cell.y * 50;
          this.checkSurroundings(cell, creaturesOnGrid);
      }
    }  
  }

  public checkSurroundings(cell: Cell, creaturesOnGrid: Array<CreatureAsset> ): void {    // looks for other creatures within 5 feet
    let engagedWith 
    const enemies: CreatureAsset[] = [] 
    this.player.engagedWith.forEach(a => enemies.push(a))
    
    this.player.engagedWith.forEach(a => {  
      engagedWith = a.engagedWith.find(d => d.id === this.player.id)
      remove(a.engagedWith, d => d.id === this.player.id )
    })
   
    this.player.engagedWith = []

    this.player.location.cell.neighbors.forEach(a => {
      const enemy = creaturesOnGrid.find(c => c.location.cell.id === a.id)

      this.player.engagedWith.forEach(e => {
        
      })

      if(enemy && (enemy.aggressive !== this.player.aggressive)) { 
        enemy.engagedWith.push(this.player)
        this.player.engagedWith.push(enemy)
      }

    })
    
    enemies.forEach(a => {
      if(!this.player.engagedWith.find(c => c.id === a.id)) {
        a.opportunityAttack(this.player)
      }
    })

  }

  public checkForCreatureAtCell(cell: Cell, creaturesOnGrid: Array<CreatureAsset>): CreatureAsset {
    const creature = creaturesOnGrid.find(a => a.location.cell.id === cell.id)
    return creature
  }

  public autoMove(end: Cell): void {
      const shortestPath = new ShortestPath()
      const path = shortestPath.find(this.player.location.cell, end, this.player.location.creaturesOnGrid)
      this.startMovement("left", path )
  }


  public startMovement(direction: string, path: Cell[]) {
    if((this.player.activePlayer || this.player.selected) && !this.moving) {
      this.path = path
      const startingPoint = this.path.pop();
      // this.redirect.path = path;
      this.moveCreature(direction);
    }
  }

    public moveCreature(direction: string): void {

      this.player.sprite.direction = direction
      // this.doImageAdjustment()

      this.nextCell = this.path.pop();
      
      if(this.nextCell.x !== this.player.location.cell.x) {
        this.player.sprite.direction = this.nextCell.x > this.player.location.cell.x ? "right" : "left"
      } else if ( this.nextCell.y !== this.player.location.cell.y ) {
        this.player.sprite.direction = this.nextCell.y > this.player.location.cell.y ? "down" : "up"
      }
      
      if (this.nextCell && (!this.nextCell.obstacle && !this.checkForCreatureAtCell(this.nextCell, this.player.location.creaturesOnGrid))) { 
          this.moving = true     
          this.move(this.nextCell.posX, this.nextCell.posY);
        } 
    }


    public move(x: number, y: number) {
      // if (this.player.location.positionX % 50 === 0 && this.player.location.positionY % 50 === 0) {
      //   if (this.redirect) {
      //     x = this.redirect.x;
      //     y = this.redirect.y;
      //     this.redirect = null;
      //     this.startMovement(redirect.pathx, y);
      //   }

      //   if (this.stop) {
      //     this.moving = false
      //   }
      // }
  
      const xMove = ((this.player.location.positionX - x) < 0) ? 5 : -5;
      const yMove = ((this.player.location.positionY - y) < 0) ? 5 : -5;
  
      const xDistance = Math.ceil((x - this.player.location.positionX) / 2);
      const yDistance = Math.ceil((y - this.player.location.positionY) / 2);
      let xArrived = false;
      let yArrived = false;
  
      if (xDistance >= 1 || xDistance <= -1) {
        this.player.location.readyPositionX += xMove;
      } else {
        xArrived = true;
      }
  
      if (yDistance >= 1 || yDistance <= -1) {
        this.player.location.readyPositionY += yMove;
      } else {
        yArrived = true;
      }
  
      if (xArrived && yArrived) {
        this.player.location.cell = this.nextCell
        this.player.location.zIndex = this.player.location.cell.y
        this.checkSurroundings(this.nextCell, this.player.location.creaturesOnGrid);

        if(this.path.length !== 0) {
          // starts redirect if creature moves into path
          let creatureInPath = false
          let creatureAtDest = false
          this.path.forEach((b, i) => {
            const foundCreature = this.player.location.creaturesOnGrid.find( c => c.location.cell.id === b.id)
            
            if(foundCreature && i !== 0) { creatureInPath = true }
            if(i === 0 && !!foundCreature) { creatureAtDest = true}
          })

          // creatures a new path
          if(creatureInPath){
            this.getNewShortestPath()
          }

          if(creatureAtDest){
            if(this.path.length > 1){
              this.path.shift()
              // TODO find a closer cell
            } else {
              this.player.sprite.direction = "down"
              this.moving = false
            }
          }

          this.moveCreature(this.player.sprite.direction);
        } else {
          this.player.sprite.direction = "down"
          this.moving = false
        }
      }
    }

    private getNewShortestPath(): void {
      const newShortestPath = new ShortestPath()
      newShortestPath.setGrid(this.player.location.grid)
      this.path = newShortestPath.find(this.player.location.cell, this.path[0], this.player.location.creaturesOnGrid)
      this.path.pop()
    }
}


export class PlayerLocationService {
  // player grid position info

  public zIndex = 7;
  public positionX = 7 * 50;
  public positionY = 7 * 50;
  public readyPositionX = 7 * 50;
  public readyPositionY = 7 * 50;
  public grid: { [cell: string]: Cell }
  public cell: Cell
  public creaturesOnGrid: Array<CreatureAsset>
}

export class Sprite {
  // sprite info
  public containerWidth? = 50;
  public containerHeight? = 75;
  public imgSource? = '../assets/motw.png';
  public imgSheetWidth? = '';
  public imgSpriteTopOffset? = -9;
  public imgSpriteLeftOffset? = -1;
  public imgBottomOffset? = 0;
  public imageHeight? = 'auto';
  public imageWidth? = '100%';
  // up, down, left, right, die, fly.., attack..,
  public imageAdjustment?: { [section: string]: SpriteSection } = {};
  public direction = 'down';
  public positionNumber = 0

  public doImageAdjustment(): void {
    if (this.imageAdjustment && this.imageAdjustment[this.direction]) {
      const a = this.imageAdjustment[this.direction];
      this.positionNumber >= a.order.length - 1
        ? (this.positionNumber = 0)
        : this.positionNumber++;
      this.imgSpriteLeftOffset = a.sprite[a.order[this.positionNumber]].x;
      this.imgSpriteTopOffset = a.sprite[a.order[this.positionNumber]].y;
    }
  }
}