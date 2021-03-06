import { Engine } from './engine';
import { Cell } from '@hive-force/maps';

export class TextAnimation {
    public width = "100%"
    public height = "100%"
    public locY = 0
    public locX = 0
    public color = "red"
    public text = ""
    public run(engine: Engine, creatureCell: Cell, text?: string, color?: string): void {}
}
