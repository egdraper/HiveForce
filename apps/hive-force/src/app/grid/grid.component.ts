import { Component, Input, HostListener } from "@angular/core";
import { CreatureAsset, Cell, Engine } from '@hive-force/assets';
import { visitAll } from '@angular/compiler';

@Component({
  selector: "app-grid",
  templateUrl: "./grid.component.html",
  styleUrls: ["./grid.component.scss"]
})
export class GridComponent {
  @Input() public creatures: Array<CreatureAsset>
  @Input() public engine: Engine
  public grid: {[cell: string]: Cell } = { };
  public gridDisplay: any[][] = [];
  public editMode = false
  
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

  
  @HostListener("document:keydown", ["$event"]) 
  public async move(event): Promise<void> {    
    debugger
    if (event.code === 'KeyE') {
       this.editMode = !this.editMode
    }
  }


  public cellClick(cell: Cell, event: KeyboardEvent): void {
    if(this.editMode) {
      cell.obstacle = !cell.obstacle
    }
   
   // if(cell.obstacle) {
    //   cell.obstacle = false
    // } else {

    // const creatures = this.creatures.filter(c => c.selected)
 
    // creatures.forEach(creature => {
    //     creature.movement.autoMove(cell)
    // })


    //////////////////////
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
        // const obstacle = ((i % 3 === 0 && l % 10 === 0) || (i % 10 === 0 && l === 3) || (i % 6 && l === 2));
        this.grid[`x${l}:y${i}`] = { x: l, y: i, posX: l * 50, posY: i * 50, obstacle: false, id: `x${l}:y${i}` };
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

  public getCells(distance: number, x: number, y: number) {
    const selectedCells = {}
    selectedCells[`x${x}:y${y}`] = this.grid[`x${x}:y${y}`]
    this.mapCells(distance, x, y, selectedCells, true)
  }

  public mapCells(distance: number, x: number, y: number, selectedCells: {[key: string]: Cell}, odd: boolean) {
    if(distance < 0) { return }
 
    for(let i = 0; i <= distance; i++) {
      selectedCells[`x${x - i}:y${y}`] = this.grid[`x${x - i}:y${y}`]
      selectedCells[`x${x}:y${y - i}`] = this.grid[`x${x}:y${y - i}`]
      selectedCells[`x${x}:y${y + i}`] = this.grid[`x${x}:y${y + i}`]
      selectedCells[`x${x + i}:y${y}`] = this.grid[`x${x + i}:y${y}`]
      this.grid[`x${x - i}:y${y}`].obstacle = true
      this.grid[`x${x}:y${y - i}`].obstacle = true
      this.grid[`x${x}:y${y + i}`].obstacle = true
      this.grid[`x${x + i}:y${y}`].obstacle = true  
    }

    const newDistance = odd ? distance - 1 : distance - 2
    this.mapCells(newDistance, x - 1, y - 1, selectedCells, !odd) 
    this.mapCells(newDistance, x + 1, y + 1, selectedCells, !odd) 
    this.mapCells(newDistance, x - 1, y + 1, selectedCells, !odd) 
    this.mapCells(newDistance, x + 1, y - 1, selectedCells, !odd) 
  }
} 