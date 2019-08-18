import { Engine } from './engine';
import { remove } from "lodash";
import { CreatureAsset } from '../creature.asset';
import { Cell } from '../../model';
import { Sprite } from '../creature-view';



export class ActionAnimation {
    public sprite: Sprite
    public run: (engine: Engine, performingCell?: Cell, receivingCell?: Cell) => Promise<unknown>
}