import { CreatureAsset } from '../creature.asset';
import { Cell } from '@hive-force/spells';

export class PlayerLocationService {
  // player grid position info

  public zIndex = 7;
  public positionX = 7 * 50;
  public positionY = 7 * 50;
  public readyPositionX = 7 * 50;
  public readyPositionY = 7 * 50;
  public grid: { [cell: string]: Cell };
  public cell: Cell;
  public creaturesOnGrid: Array<CreatureAsset>;
}
