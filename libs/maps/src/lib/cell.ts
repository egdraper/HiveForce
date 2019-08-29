export interface Cell {
  id: string;
  x: number;
  y: number;
  posX?: number;
  posY?: number;
  obstacle?: boolean;
  neighbors?: Cell[];
  destination?: boolean;
}

export interface RelativePositionCell extends Cell {
  distance: number;
}

export interface Neighbor {
  cell: Cell;
}

export interface Visited {
  cell?: Cell;
  distance?: number;
  checked?: boolean;
}
