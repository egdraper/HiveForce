export interface Cell {
  id: string;
  x: number;
  y: number;
  posX?: number;
  posY?: number;
  obstacle?: boolean;
  neighbors?: Cell[];
  destination?: boolean;
  imgUrl?: string;
  imgIndexX?: number;
  imgIndexY?: number;
  imgWidth?: number;
  imgHeight?: number;
}

export interface RelativePositionCell extends Cell {
  distance: number;
}

export interface Neighbor {
  cell: Cell;
}

export interface Visited {
  cell?: Cell
  steps?: {
    distance?: number,
    odd?: boolean,
    moves?: number
  }
  checked?: boolean;
}

export class GridDetails {
  name: string
  width: number
  height: number
  grid?: {[cell: string]: Cell }
}
