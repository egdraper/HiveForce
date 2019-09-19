import { Engine } from './engine';
import { remove } from 'lodash';
import { TextAnimation } from './text-animation';
import { Cell } from '@hive-force/spells';

export class ActionResultTextAnimation extends TextAnimation {
  public color = "Orange"
  public frame = 0
  
  private engine: Engine
  private slowDown = 10

  public run(engine: Engine, creatureCell: Cell, text?: string, color?: string): void {
    this.engine = engine
    this.locX = creatureCell.posX + 10
    this.locY = creatureCell.posY
    this.text = text || this.text
    this.color = color || this.color 
    this.frame = 0
    engine.assets.push(this);
  }

  public update() {
    if (this.frame % 2 === 0) {
      if(this.slowDown >= 0) {
        this.locY -= this.slowDown
        this.slowDown --
      }
    }
    
    this.frame++;
   
    if (this.frame === 120) {
      this.frame = 0
      this.slowDown = 10
      remove(this.engine.assets, a => a === this);
      this.text = ""
    }
  }
}
