import { Engine } from './engine'
import { Cell } from '@hive-force/maps'
import { Sprite } from './sprite';

export class ActionAnimation {
    public sprite: Sprite
    public run: (engine: Engine, performingCell?: Cell, receivingCell?: Cell) => Promise<unknown>
}