// tslint:disable: radix
import { Component, Input, HostListener } from '@angular/core';
import { CreatureAsset, Cell } from '@hive-force/assets';
import { SquareComponent } from './grid/square/square.component';
import { remove, cloneDeep } from "lodash"


@Component({
  selector: 'creature-asset',
  templateUrl: './creature.component.html',
  styleUrls: ['./creature.component.scss']
})
export class CreatureAssetComponent {
  @Input() public creatureAsset: CreatureAsset;
  @Input() public gridCreatures: Array<CreatureAsset>;
  @Input() public grid: { [cell: string]: any };

  private ctrIsHeld = false

  public ngOnInit(): void {
    this.creatureAsset.location.grid = this.grid
    this.creatureAsset.location.creaturesOnGrid = this.gridCreatures
    this.creatureAsset.sprite.doImageAdjustment()
  }

  @HostListener("document:keydown", ["$event"]) 
  public keydown(event): void {
    if(event.key === "Control") {
      this.ctrIsHeld = true
    }
  }

  
  @HostListener("document:keyup", ["$event"]) 
  public keyup(event): void {
    if(event.key === "Control") {
      this.ctrIsHeld = false
    }
  }

  @HostListener('document:keypress', ['$event'])
  public move(event): void {
    const x = this.creatureAsset.location.cell.x
    const y = this.creatureAsset.location.cell.y

    if (event.code === 'KeyW') {      
      // this.creatureAsset.moveCharacter("up", this.grid[`x${x}:y${y - 1}`], this.gridCreatures)
      this.creatureAsset.movement.startMovement("up", this.creatureAsset.movement.path = [this.grid[`x${x}:y${y-1}`], this.grid[`x${x}:y${y}`]])
    }

    if (event.code === 'KeyA') {
      // this.creatureAsset.movement.moveCharacter("left", this.grid[`x${x - 1}:y${y}`], this.gridCreatures)
      this.creatureAsset.movement.startMovement("left", this.creatureAsset.movement.path = [this.grid[`x${x - 1}:y${y}`], this.grid[`x${x}:y${y}`]])
    }
    
    if (event.code === 'KeyD') {
      // this.creatureAsset.movement.moveCharacter("right", this.grid[`x${x + 1}:y${y}`], this.gridCreatures)
      this.creatureAsset.movement.startMovement("right", this.creatureAsset.movement.path = [this.grid[`x${x + 1}:y${y}`], this.grid[`x${x}:y${y}`]]
      )
    }
    
    if (event.code === 'KeyS') {
      // this.creatureAsset.movement.moveCharacter("down", this.grid[`x${x}:y${y + 1}`], this.gridCreatures)
      this.creatureAsset.movement.startMovement("down", this.creatureAsset.movement.path = [this.grid[`x${x}:y${y + 1}`], this.grid[`x${x}:y${y}`]]
      )
    }
  }
  
  public onCreatureSelect(): void {
    if(!this.ctrIsHeld) {
      this.gridCreatures.forEach(a => a.selected = false)
    }

    this.creatureAsset.selected = true
  }
}
