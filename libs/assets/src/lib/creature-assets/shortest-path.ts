import { Injectable } from "@angular/core";
import { Cell, Visited } from '../model';

@Injectable()
export class ShortestPath {
  public grid: {[cell: string]: any } = { };
   
  public setGrid(grid: {[cell: string]: any }) {
    this.grid = grid;
  }

  public find(start: Cell, end: Cell ) {
    end.destination = true; // css styling

    const visited = { };
    visited[`x${start.x}:y${start.y}`] = { cell: start, distance: 0 };

    this.visitedNow(end, visited);
    const shortestPath = [];
    shortestPath.push(end);
    return this.getShortestPath(visited[`x${end.x}:y${end.y}`], shortestPath);
  }

  private getShortestPath(cell: any, shortest: Cell[]) {
    if (cell.prevCel) {
     shortest.push(cell.prevCel.cell);
     cell.prevCel.cell.path = true;
     this.getShortestPath(cell.prevCel, shortest);
    }

    return shortest;
  }

  private visitedNow(endingPoint: Cell, visited: Visited) {
    if (visited[`x${endingPoint.x}:y${endingPoint.y}`] && visited[`x${endingPoint.x}:y${endingPoint.y}`].cell === endingPoint) {
      return;
    }

    Object.keys(visited).forEach(visitedCell => {
        if (!visited[visitedCell].checked) {
          const store: number[] = [ ];

          visited[visitedCell].cell.neighbors.forEach((cell, index) => {
            if (!cell) {
              return;
            }

            if (!cell.obstacle && !store.some(i => index === i)) {
              if (!visited[`x${cell.x}:y${cell.y}`]) {
                visited[`x${cell.x}:y${cell.y}`] = {
                  cell,
                  distance: visited[visitedCell].distance + 1,
                  prevCel: visited[visitedCell]
                };
              } else {
                if (visited[`x${cell.x}:y${cell.y}`].distance > visited[visitedCell] + 1) {
                   visited[`x${cell.x}:y${cell.y}`].distance = visited[visitedCell] + 1;
                }
              }
            }

          if (index === 0 && cell.obstacle) {
            // skip 7 4
            store.push(7);
            store.push(4);
          }

          if (index === 1 && cell.obstacle) {
            // skip 4 5
            store.push(4);
            store.push(5);
          }

          if (index === 2 && cell.obstacle) {
            // skip 5 6
            store.push(5);
            store.push(6);
          }

          if (index === 3 && cell.obstacle) {
            // skip 6 7
            store.push(6);
            store.push(7);
          }
        });
      }

      visited[visitedCell].checked = true;
    });
    this.visitedNow(endingPoint, visited);
  }
}