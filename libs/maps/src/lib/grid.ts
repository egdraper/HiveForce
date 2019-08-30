import { Cell, RelativePositionCell } from './cell';
import { JsonPipe } from '@angular/common';

export class Map {
  public grid: {[cell: string]: Cell } = { };
  public gridDisplay: Cell[][] = [];

  public createGrid(width: number, height: number) {
    this.generateGrid(width, height)
  }

  public getAreaOfEffect(distance: number = 1, x: number, y: number): {[key: string]: RelativePositionCell} {
    const selectedCells = {}
    selectedCells[`x${x}:y${y}`] = this.grid[`x${x}:y${y}`]
    this.mapCells(distance, x, y, selectedCells, true)
    return selectedCells
  }

  private generateGrid(width: number, height: number) {
    for (let i = 0; i < height; i++) {
      this.gridDisplay[i] = [];

      for (let l = 0; l < width; l++ ) {
        this.grid[`x${l}:y${i}`] = { x: l, y: i, posX: l * 50, posY: i * 50, obstacle: false, id: `x${l}:y${i}` };
        this.gridDisplay[i][l] = this.grid[`x${l}:y${i}`];
      }
    }

    for (let i = 0; i < height; i++) {
      for (let l = 0; l < width; l++ ) {
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

  public mapCells(distance: number, x: number, y: number, selectedCells: {[key: string]: RelativePositionCell}, odd: boolean) {
    if(distance < 0) { return }
 
    for(let i = 0; i <= distance; i++) {
      selectedCells[`x${x - i}:y${y}`] = this.grid[`x${x - i}:y${y}`] as RelativePositionCell
      selectedCells[`x${x}:y${y - i}`] = this.grid[`x${x}:y${y - i}`] as RelativePositionCell
      selectedCells[`x${x}:y${y + i}`] = this.grid[`x${x}:y${y + i}`] as RelativePositionCell
      selectedCells[`x${x + i}:y${y}`] = this.grid[`x${x + i}:y${y}`] as RelativePositionCell
    }

    const newDistance = odd ? distance - 1 : distance - 2
    this.mapCells(newDistance, x - 1, y - 1, selectedCells, !odd) 
    this.mapCells(newDistance, x + 1, y + 1, selectedCells, !odd) 
    this.mapCells(newDistance, x - 1, y + 1, selectedCells, !odd) 
    this.mapCells(newDistance, x + 1, y - 1, selectedCells, !odd) 
  }
}