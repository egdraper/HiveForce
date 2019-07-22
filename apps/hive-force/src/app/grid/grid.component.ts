import { Component, ViewChild, HostListener, ElementRef, ChangeDetectorRef } from "@angular/core";
// import { Character } from "app/character/character";
// import { ShortestPath } from "app/path/shortest-path";
// import { Cell } from "app/model/cell";

@Component({
  selector: "app-grid",
  templateUrl: "./grid.component.html",
  styleUrls: ["./grid.component.scss"]
})
export class GridComponent {
  // public characters: Character[] = []
  public grid: {[cell: string]: any } = { };
  public gridDisplay: any[][] = [];

  constructor() {
    // this.characters.push(new Character());
    this.generateGrid();
  }

  public charSelect() {
    // this.characters.forEach(c => c.isSelected = false);
    // char.select();
  }

  public cellClick(e: any): void {
    debugger 
    if (e.x === 150 && e.y === 0) {
      // this.characters.push(new Character());
    } else {
      // this.requestToMoveCharacter(e.input);
    }
  }

  public requestToMoveCharacter() {
    // this.characters.filter(c => c.isSelected && c.isControllable).forEach(char => {
    //   const posX = char.leftPosition / 50;
    //   const posY = char.topPosition / 50;
    //   const path = this.shortestPath.find(this.grid[`x${posX}:y${posY}`], toLocation);
    //   char.startMovement(path);
    // })
  }

  private generateGrid() {
    for (let i = 0; i < 100; i++) {
      this.gridDisplay[i] = [];

      for (let l = 0; l < 100; l++ ) {
        const obstacle = ((i % 3 === 0 && l % 10 === 0) || (i % 10 === 0 && l === 3) || (i % 6 && l === 2));
        this.grid[`x${l}:y${i}`] = { x: l, y: i, posX: l * 50, posY: i * 50, obstacle, };
        this.gridDisplay[i][l] = this.grid[`x${l}:y${i}`];
      }
    }

    for (let i = 0; i < 100; i++) {
      for (let l = 0; l < 100; l++ ) {
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