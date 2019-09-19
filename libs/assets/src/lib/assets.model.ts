export class Asset {
    public id: string;
    public name: string;
  }
  
  export class MapAsset extends Asset {
    imgUrl: string
    containerHeight: number;
    containerWidth: number;
    key: string 
    leftOffset: any;
    locX: number;
    locY: number;
    topOffset: number;
    type: string;
    visible: boolean
  }

  export class SelectableAsset extends Asset {
    selected = false
    activePlayer = false
  }
  
  export class TurrainAsset extends MapAsset {}
  
  export class MoveableItemAsset extends MapAsset {}
  
  export class NonMovableItemAsset extends MapAsset {}
  
  