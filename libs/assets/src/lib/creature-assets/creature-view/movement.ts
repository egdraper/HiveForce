import { CreatureAsset } from '../creature.asset';
import { remove } from "lodash"
import { ShortestPath } from './shortest-path';
import { Cell } from '@hive-force/maps';

export class Movement {
    public moving = false
    public path: any
    public nextCell: Cell
    public redirect: any  
  
    constructor(public player: CreatureAsset) {}
  
    public moveCharacter(direction: string, cell: Cell, creaturesOnGrid: Array<CreatureAsset>, creatureFacingOverride?: string): void {
      // creatureFacingOverride prevents the creature from turning around when knocked back
      
      if(this.player.attributes.currentHitPoints <= 0) { 
        return 
      }
      
      if (this.player.activePlayer) {
        this.player.sprite.key = creatureFacingOverride || direction
  
  
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
      const creature = creaturesOnGrid.find(a => a.location.cell.id === cell.id && a.id !== this.player.id)
      return creature
    }
  
    public autoMove(end: Cell): void {
        const shortestPath = new ShortestPath()
        const path = shortestPath.find(this.player.location.cell, end, this.player.location.creaturesOnGrid)
        this.startMovement("left", path )
    }
  
  
    public startMovement(direction: string, path: Cell[], manual: boolean = false) {
        if((this.player.activePlayer || this.player.selected) && !this.moving) {
        this.path = path
        const startingPoint = this.path.pop();
        // this.redirect.path = path;
        this.moveCreature(direction);
      }
    }
  
      public moveCreature(direction: string): void {
  
        this.player.sprite.key = direction
        // this.doImageAdjustment()
  
        this.nextCell = this.path.pop();

        if(!this.player.attributes.actions.find(a => a.name === "Move").areaOfEffect[this.nextCell.id]) {
          this.moving = false
          return
        }

        if(this.nextCell.x !== this.player.location.cell.x) {
          this.player.sprite.key = this.nextCell.x > this.player.location.cell.x ? "right" : "left"
        } else if ( this.nextCell.y !== this.player.location.cell.y ) {
          this.player.sprite.key = this.nextCell.y > this.player.location.cell.y ? "down" : "up"
        }
        
        if (this.nextCell && (!this.nextCell.obstacle && !this.checkForCreatureAtCell(this.nextCell, this.player.location.creaturesOnGrid))) { 
            this.player.location.cell = this.nextCell
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
                this.getNewShortestPath()
              } else {
                this.moving = false
              }
            }
  
            this.moveCreature(this.player.sprite.key);
          } else {
            this.moving = false
          }
        }
      }
  
      private getNewShortestPath(): void {
        const newShortestPath = new ShortestPath()
        newShortestPath.setGrid(this.player.location.grid)
        this.path = newShortestPath.find(this.player.location.cell, this.path[0], this.player.location.creaturesOnGrid)
        this.nextCell = this.path.pop()
      }
  }