import { Engine } from './engine'
import { Cell } from '@hive-force/spells'
import { Sprite } from './sprite';
import { Subject } from 'rxjs';

export class AssetAnimation {
    public sprite: Sprite
    public location?: Cell
    public key?:string
    public presetAnimation: (watcher: Subject<Sprite>) => void
    public run: (engine: Engine, location: Cell) => Promise<unknown>
}

