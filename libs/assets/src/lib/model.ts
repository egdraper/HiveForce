export interface Cell {
    x: number;
    y: number;
    posX?: number;
    posY?: number;
    obstacle?: boolean;
    neighbors?: Cell[];
    destination?: true;
  }
  
  export interface Neighbor {
    cell: Cell;
  }
  
  export interface Visited {
    cell?: Cell;
    distance?: number;
    checked?: boolean;
  }
  