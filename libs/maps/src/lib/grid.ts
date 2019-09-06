import { Cell, RelativePositionCell, GridDetails } from './cell';
import { JsonPipe } from '@angular/common';

export class Map {
  public grid: {[cell: string]: Cell } = { }
  public gridDisplayLite: GridDetails
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

  public setGridDetails(gridDetails: GridDetails) {
    this.gridDisplayLite = gridDetails,
    this.createDisplayArray(gridDetails.width, gridDetails.height, gridDetails.grid)
    this.addNeighbors(gridDetails.width, gridDetails.height)
  }

  public createGridDetail(): any {
    this.gridDisplayLite.grid = {}

     Object.keys(this.grid).forEach(cell => {
      this.gridDisplayLite.grid[this.grid[cell].id] = {
        id: this.grid[cell].id,
        x: this.grid[cell].x,
        y: this.grid[cell].y,
        posY: this.grid[cell].posY,
        posX: this.grid[cell].posX,
        obstacle: this.grid[cell].obstacle,
        imgUrl: this.grid[cell].imgUrl,
        imgIndexX: this.grid[cell].imgIndexX,
        imgIndexY: this.grid[cell].imgIndexY,
        imgWidth: this.grid[cell].imgWidth,
        imgHeight: this.grid[cell].imgHeight
      }      
    })

    return {
      displayGrid: this.gridDisplayLite
    }
  }

  private generateGrid(width: number, height: number, name: string = "No Name") {
    this.gridDisplayLite = {
      height,
      width,
      name
    }
    this.createDisplayArray(width, height,)
    this.addNeighbors(width, height)
  }

  private createDisplayArray(width: number, height: number, grid?: {[key: string]: Cell}) {
    let imgIndexX = 1
    let imgIndexY = 1
    
    for (let i = 0; i < height; i++) {
      this.gridDisplay[i] = [];

      for (let l = 0; l < width; l++ ) {
        this.grid[`x${l}:y${i}`] = grid && grid[`x${l}:y${i}`] 
          ? grid[`x${l}:y${i}`] 
          : { 
            x: l,
            y: i,
            posX: l * 50,
            posY: i * 50,
            obstacle: false,
            id: `x${l}:y${i}`,
            imgUrl: "../../../assets/rock-flowers.png",
            imgIndexX: imgIndexX === 1 ? 0 : (imgIndexX - 1) * (-50),
            imgIndexY: imgIndexY === 1 ? 0 : (imgIndexY - 1) * (-50),
            imgWidth: 150,
            imgHeight: 150,
          };

        imgIndexX ++

        if (imgIndexX > 3 && imgIndexY < 3) { 
          imgIndexX = 1 
          imgIndexY++
        } else if (imgIndexX > 3 && imgIndexY >= 3 ) {
          imgIndexX = 1
          imgIndexY = 1
        }
        this.gridDisplay[i][l] = this.grid[`x${l}:y${i}`];
      }
    }
  }

  private addNeighbors(width: number, height: number) {
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