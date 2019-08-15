import { Engine } from './engine';
import { remove } from "lodash";
import { CreatureAsset } from '../creature.asset';
import { Cell } from '../../model';



export class ActionAnimation {
    public imgUrl: string
    public animationFrame: any
    public run: (engine: Engine, performingCell?: Cell, receivingCell?: Cell) => void
}