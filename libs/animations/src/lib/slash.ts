import { Engine } from './engine';
import { remove } from 'lodash';
import { ActionAnimation } from './action-animation';
import { Cell } from '@hive-force/maps';
import { Sprite } from './sprite';

export class SlashAnimation implements ActionAnimation {
  public sprite: Sprite
  private resolve
  private frame = 0;
  private engine: Engine;

  public run(engine: Engine, performingCell: Cell, receivingCell: Cell, missed: boolean = false): Promise<unknown> {
    const promise = new Promise( (resolve) => { 
      this.resolve = resolve
      this.engine = engine;
      const spriteModel = {
        locX: receivingCell.posX - 20,
        locY: receivingCell.posY - 25,
        containerWidth: 100,
        containerHeight: 100,
        key: "heroSwing",
        imgSource: "../assets/slash-swing-large.png",
        imageAdjustment: {
          heroSwing: {
            order: [0,1,2,3,4,5,6,7,8], 
            sprite: [
              {x: 0, y: -10},
              {x: -100, y: -10},
              {x: -200, y: -10},
              {x: 0, y: -110},
              {x: -100, y: -110},
              {x: -200, y: -110},
              {x: 0, y: -210},
              {x: -100, y: -210},
              {x: -200, y: -210},     
            ]
          }
        }
      }
      this.sprite = new Sprite(spriteModel as any)
      this.frame = 1    
      engine.assets.push(this);
    })
    return promise
  }

  public update() {
    if (this.frame % 2 === 0) {
       this.sprite.doImageAdjustment()
    }
    
    this.frame++;
   
    if (this.sprite.positionNumber >= this.sprite.imageAdjustment["heroSwing"].order.length - 1 ) {
      this.frame = 1
      this.sprite.positionNumber = 0
      remove(this.engine.assets, a => a === this);
      this.sprite = null;
      this.resolve()
    }
  }
}
