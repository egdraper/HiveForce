export class GameComponents {
  public update() { }
}

export class Asset extends GameComponents{
    public id: string;
    public name: string;
  }
  
  export class MapAsset extends Asset {
    xLocation: number;
    yLocation: number;
    xWidth: number;
    xHeight: number;
    shape: string;
    image: any;
  }

  export class SelectableAsset extends Asset {
    selected = false
    activePlayer = false
  }
  
  export class TurrainAsset extends MapAsset {}
  
  export class MoveableItemAsset extends MapAsset {}
  
  export class NonMovableItemAsset extends MapAsset {}
  
  