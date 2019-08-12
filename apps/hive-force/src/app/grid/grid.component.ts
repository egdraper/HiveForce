import { Component, Input } from "@angular/core";
import { CreatureAsset, Cell } from '@hive-force/assets';

@Component({
  selector: "app-grid",
  templateUrl: "./grid.component.html",
  styleUrls: ["./grid.component.scss"]
})
export class GridComponent {
  @Input() creatures: Array<CreatureAsset>
  public grid: {[cell: string]: Cell } = { };
  public gridDisplay: any[][] = [];
  
  private index = 5

  constructor() {
    this.generateGrid();
  }
  
  public ngOnInit(): void {
    this.creatures.forEach(a => {
      a.location.cell = this.grid[`x${this.index}:y${this.index}`]
      a.location.positionX = a.location.cell.posX
      a.location.positionY = a.location.cell.posY
      a.location.readyPositionX = a.location.cell.posX
      a.location.readyPositionY = a.location.cell.posY
      a.location.grid = this.grid
      a.location.creaturesOnGrid = this.creatures
      this.index++
    })
      this.index = 5
  }

  public cellClick(cell: Cell): void {
    const creature = this.creatures.find(c => c.activePlayer)
 
    creature.attributes.actions.forEach(a => {
      if(a.name === "Move" && a.selected) {
        creature.movement.autoMove(cell)
      }
    })
  }

  private generateGrid() {
    for (let i = 0; i < 50; i++) {
      this.gridDisplay[i] = [];

      for (let l = 0; l < 50; l++ ) {
        const obstacle = ((i % 3 === 0 && l % 10 === 0) || (i % 10 === 0 && l === 3) || (i % 6 && l === 2));
        this.grid[`x${l}:y${i}`] = { x: l, y: i, posX: l * 50, posY: i * 50, obstacle, id: `x${l}:y${i}` };
        this.gridDisplay[i][l] = this.grid[`x${l}:y${i}`];
      }
    }

    for (let i = 0; i < 50; i++) {
      for (let l = 0; l < 50; l++ ) {
        const cell = this.grid[`x${l}:y${i}`];
        cell.neighbors = [];
        cell.neighbors[5] = this.grid[`x${l + 1}:y${i + 1}`];
        cell.neighbors[0] = this.grid[`x${l}:y${i - 1}`];
        cell.neighbors[2] = this.grid[`x${l}:y${i + 1}`];
        cell.neighbors[4] = this.grid[`x${l + 1}:y${i - 1}`];
        cell.neighbors[1] = this.grid[`x${l + 1}:y${i}`];
        cell.neighbors[6] = this.grid[`x${l - 1}:y${i + 1}`];
        cell.neighbors[3] = this.grid[`x${l - 1}:y${i}`];
        cell.neighbors[7] = this.grid[`x${l - 1}:y${i - 1}`];
      }
    } 
  }
}