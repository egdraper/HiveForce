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

  @HostListener('document:keypress', ['$event'])
  public move(event): void {
    const x = this.creatureAsset.cell.x
    const y = this.creatureAsset.cell.y
    if (event.code === 'KeyW') {      
      // this.creatureAsset.moveCharacter("up", this.grid[`x${x}:y${y - 1}`], this.gridCreatures)
      debugger
      this.creatureAsset.startMovement([this.grid[`x${x}:y${y-1}`], this.grid[`x${x}:y${y}`]])
    }

    if (event.code === 'KeyA') {
      this.creatureAsset.moveCharacter("left", this.grid[`x${x - 1}:y${y}`], this.gridCreatures)
    }

    if (event.code === 'KeyD') {
      this.creatureAsset.moveCharacter("right", this.grid[`x${x + 1}:y${y}`], this.gridCreatures)
    }

    if (event.code === 'KeyS') {
      this.creatureAsset.moveCharacter("down", this.grid[`x${x}:y${y + 1}`], this.gridCreatures)
    }

  }
  
  public onCreatureSelect(): void {
    this.creatureAsset.selected = !this.creatureAsset.selected;
  }
}
