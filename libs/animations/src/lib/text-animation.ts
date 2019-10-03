import { Engine } from './engine';
import { Cell } from '@hive-force/spells';
import { Subject } from 'rxjs';
import { Sprite } from './sprite';

export class TextAnimation {
    public sprites: Array<Sprite>
    public run: ( text: string, type: string, engine: Engine, location: Cell, watcher: Subject<any>) => Promise<unknown>
}
