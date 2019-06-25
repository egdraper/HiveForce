
import { MapAsset, CreatureAsset } from "@hive-force/assets"

export class Map {
    id: string;
    name: string;
    height: number;
    width: number;
    mapAssets: { [id: string]: MapAsset };
    playerAssets: { [id: string]: CreatureAsset };
  }
  