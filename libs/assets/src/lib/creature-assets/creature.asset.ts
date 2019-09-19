import { Item, Weapon } from '@hive-force/items';
import { Dice, Roll } from '@hive-force/dice';
import { Subject } from 'rxjs';
import { MasterLog } from '@hive-force/log';
import { SelectableAsset } from '../assets.model';
import { Race } from './race/base.race';
import { Effect } from './effects/effects.model';
import { Action, CreaturesEffect } from './actions/action.model';
import { PlayerLocationService } from './creature-view/location';
import { Attributes } from './attributes/attributes';
import { Sprite } from '@hive-force/animations';
import { ShortestPath } from './creature-view/shortest-path';
import { Cell } from '@hive-force/spells';
import { remove } from "lodash"

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
  public selectedAction: Action

  // battle
  public engagedWith: Array<CreatureAsset> = [];
  
  // visual attributes
  public location = new PlayerLocationService()
  public sprite: Sprite
  public frameDelay = true;
  public frame = 0;

  // Movement 

  public moving = false
  public path: any
  public nextCell: Cell
  public redirect: any
  public movementResolve: any

  public update(): void {
    this.frame >= 60 ? (this.frame = 0) : this.frame++;

    // updates the sprite image 3 times a second.
    if (this.moving && (
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
      
      if(this.moving) {
        this.move(this.nextCell.posX, this.nextCell.posY)
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

  
  public moveCharacter(direction: string, cell: Cell, creaturesOnGrid: Array<CreatureAsset>, creatureFacingOverride?: string): void {
    // creatureFacingOverride prevents the creature from turning around when knocked back
    
    if(this.attributes.currentHitPoints <= 0) { 
      return 
    }
    
    if (this.activePlayer) {
      this.sprite.key = creatureFacingOverride || direction
  
      // Up
      if (direction === "up" && this.location.cell.y > 0) {
        if (cell.obstacle || !!this.checkForCreatureAtCell(cell, creaturesOnGrid)) {
          return;
        }
        this.location.zIndex --
        this.location.cell = cell
        this.location.readyPositionY = this.location.cell.y * 50;
        this.checkSurroundings(cell, creaturesOnGrid);
      }

      // Left
      if (direction === "left" && this.location.cell.x > 0) {
        if (cell.obstacle || !!this.checkForCreatureAtCell(cell, creaturesOnGrid)) {
          return;
        }
        this.location.cell = cell;
        this.location.readyPositionX = this.location.cell.x * 50;
        this.checkSurroundings(cell, creaturesOnGrid);
      }

      // Right
      if (direction === "right"  && this.location.cell.x < 15) {
        if (cell.obstacle || !!this.checkForCreatureAtCell(cell, creaturesOnGrid)) {
          return;
        }
        this.location.cell = cell;
        this.location.readyPositionX =
        this.location.cell.x * 50;
        this.checkSurroundings(cell, creaturesOnGrid);
      }

      // Down
      if (direction === "down" && this.location.cell.y < 15) {
        if (cell.obstacle || !!this.checkForCreatureAtCell(cell, creaturesOnGrid)) {
          return;
        }
        this.location.zIndex ++
        this.location.cell = cell;
        this.location.readyPositionY =
        this.location.cell.y * 50;
        this.checkSurroundings(cell, creaturesOnGrid);
      }
    }  
  }

  public checkSurroundings(cellToCheck: Cell, creaturesOnGrid: Array<CreatureAsset> ): void {    // looks for other creatures within 5 feet
    let engagedWith 
    const enemies: CreatureAsset[] = [] 
    this.engagedWith.forEach(a => enemies.push(a))
    
    this.engagedWith.forEach(a => {  
      engagedWith = a.engagedWith.find(d => d.id === this.id)
      remove(a.engagedWith, d => d.id === this.id )
    })
   
    this.engagedWith = []

    this.location.cell.neighbors.forEach(cell => {
      if(!cell) { return}

      const enemy = creaturesOnGrid.find(c => c.location.cell.id === cell.id)

      this.engagedWith.forEach(e => {
        
      })

      if(enemy && (enemy.aggressive !== this.aggressive)) { 
        enemy.engagedWith.push(this)
        this.engagedWith.push(enemy)
      }

    })
    
    enemies.forEach(a => {
      if(!this.engagedWith.find(c => c.id === a.id)) {
        a.opportunityAttack(this)
      }
    })
  }

  public checkForCreatureAtCell(cell: Cell, creaturesOnGrid: Array<CreatureAsset>): CreatureAsset {
    const creature = creaturesOnGrid.find(a => a.location.cell.id === cell.id && a.id !== this.id)
    return creature
  }

  public async autoMove(end: Cell): Promise<any> {
      const movementComplete = new Promise((resolve) => {
        this.movementResolve = resolve
        const shortestPath = new ShortestPath()
        const path = shortestPath.find(this.location.cell, end, this.location.creaturesOnGrid)
        this.startMovement("left", path )
      })
      return movementComplete
  }


  public startMovement(direction: string, path: Cell[], manual: boolean = false) {
      if((this.activePlayer || this.selected) && !this.moving) {
      this.path = path
      const startingPoint = this.path.pop();
      // this.redirect.path = path;
      this.moveCreature(direction);
    }
  }

    public moveCreature(direction: string): void {

      this.sprite.key = direction
      // this.doImageAdjustment()

      this.nextCell = this.path.pop();

      if(this.inInitiative && !this.attributes.actions.find(a => a.name === "Move").areaOfEffect[this.nextCell.id]) {
        this.moving = false
        return
      }

      if(this.nextCell.x !== this.location.cell.x) {
        this.sprite.key = this.nextCell.x > this.location.cell.x ? "right" : "left"
      } else if ( this.nextCell.y !== this.location.cell.y ) {
        this.sprite.key = this.nextCell.y > this.location.cell.y ? "down" : "up"
      }
      
      if (this.nextCell && (!this.nextCell.obstacle && !this.checkForCreatureAtCell(this.nextCell, this.location.creaturesOnGrid))) { 
          this.location.cell = this.nextCell
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
  
      const xMove = ((this.location.positionX - x) < 0) ? 5 : -5;
      const yMove = ((this.location.positionY - y) < 0) ? 5 : -5;
  
      const xDistance = Math.ceil((x - this.location.positionX) / 2);
      const yDistance = Math.ceil((y - this.location.positionY) / 2);
      let xArrived = false;
      let yArrived = false;
  
      if (xDistance >= 1 || xDistance <= -1) {
        this.location.readyPositionX += xMove;
      } else {
        xArrived = true;
      }
  
      if (yDistance >= 1 || yDistance <= -1) {
        this.location.readyPositionY += yMove;
      } else {
        yArrived = true;
      }
  
      if (xArrived && yArrived) {
 
        this.location.zIndex = this.location.cell.y
        this.checkSurroundings(this.nextCell, this.location.creaturesOnGrid);
       
        if(this.path.length !== 0) {
          // starts redirect if creature moves into path
          let creatureInPath = false
          let creatureAtDest = false
          this.path.forEach((b, i) => {
            const foundCreature = this.location.creaturesOnGrid.find( c => c.location.cell.id === b.id)
            
            if(foundCreature && i !== 0) { creatureInPath = true }
            if(i === 0 && !!foundCreature) { creatureAtDest = true}
          })

          // creatures a new path
          if(creatureInPath){
            this.getNewShortestPath()
          }

          if(creatureAtDest){
            if(this.path.length > 1){
              this.getNewShortestPath()
            } else {
              this.moving = false
            }
          }

          this.moveCreature(this.sprite.key);
        } else {
          this.moving = false
          this.movementResolve()
        }
      }
    }

    private getNewShortestPath(): void {
      const newShortestPath = new ShortestPath()
      newShortestPath.setGrid(this.location.grid)
      this.path = newShortestPath.find(this.location.cell, this.path[0], this.location.creaturesOnGrid)
      this.nextCell = this.path.pop()
    }
}







