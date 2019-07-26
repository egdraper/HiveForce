// tslint:disable: radix
import { Component, Input, HostListener } from '@angular/core';
import { CreatureAsset, Cell } from '@hive-force/assets';
import { SquareComponent } from './grid/square/square.component';


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
    if (this.creatureAsset.selected) {
      const x = this.creatureAsset.cell.x
      const y = this.creatureAsset.cell.y

      // Up
      if (event.code === 'KeyW' && this.creatureAsset.cell.y > 0) {
        const cell = this.grid[`x${x}:y${y - 1}`]
        this.creatureAsset.direction = "up"
        if (cell.obstacle) {
          return;
        }
        this.creatureAsset.zIndex --
        this.creatureAsset.cell = cell
        this.creatureAsset.readyPositionY = this.creatureAsset.cell.y * 50 + 2;
        this.checkSurroundings(cell);
      }

      // Left
      if (event.code === 'KeyA' && this.creatureAsset.cell.x > 0) {
        this.creatureAsset.direction = "left"
        const cell = this.grid[`x${x - 1}:y${y}`]
        if (cell.obstacle) {
          return;
        }
        this.creatureAsset.cell = cell;
        this.creatureAsset.readyPositionX = this.creatureAsset.cell.x * 50 + 2;
        this.checkSurroundings(cell);
      }

      // Right
      if (event.code === 'KeyD' && this.creatureAsset.cell.x < 100) {
        this.creatureAsset.direction = "right"
        const cell = this.grid[`x${x + 1}:y${y}`]
        if (cell.obstacle) {
          return;
        }
        this.creatureAsset.cell = cell;
        this.creatureAsset.readyPositionX =
          this.creatureAsset.cell.x * 50 + 2;
          this.checkSurroundings(cell);
      }

      // Down
      if (event.code === 'KeyS' && this.creatureAsset.cell.y < 100) {
        this.creatureAsset.direction = "down"
        const cell = this.grid[`x${x}:y${y + 1}`]
        if (cell.obstacle) {
          return;
        }
        this.creatureAsset.zIndex ++
        this.creatureAsset.cell = cell;
        this.creatureAsset.readyPositionY =
          this.creatureAsset.cell.y * 50 + 2;
          this.checkSurroundings(cell);
      }
    }
  }

  public onCreatureSelect(): void {
    this.creatureAsset.selected = !this.creatureAsset.selected;
  }

  public checkSurroundings(cell: Cell): void {    // looks for other creatures within 5 feet
    this.gridCreatures.forEach(a => {
      this.creatureAsset.cell.neighbors.forEach(c => {
        if(c.id === a.cell.id) {
        }
      })
    })
  }
}
