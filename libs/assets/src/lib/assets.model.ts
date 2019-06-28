import { Spell } from "@hive-force/spells"
import { Item } from "@hive-force/items"

export class Asset {
    id: string;
    name: string;
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
  }
  
  export class TurrainAsset extends MapAsset {}
  
  export class MoveableItemAsset extends MapAsset {}
  
  export class NonMovableItemAsset extends MapAsset {}
  
  