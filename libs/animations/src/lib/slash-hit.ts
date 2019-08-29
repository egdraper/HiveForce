import { Engine } from './engine';
import { remove } from 'lodash';
import { ActionAnimation } from './action-animation';

import { Cell } from '@hive-force/maps';
import { Sprite } from './sprite';

export class SlashHitAnimation implements ActionAnimation {
  public sprite: Sprite
  private resolve
  private frame = 0;
  private engine: Engine;

  public run(engine: Engine, performingCell: Cell, receivingCell: Cell, missed: boolean = false): Promise<unknown> {
    const promise = new Promise( (resolve) => { 
      this.resolve = resolve
      this.engine = engine;
      const spriteModel = {
        locX: receivingCell.posX- 40,
        locY: receivingCell.posY - 50,
        containerWidth: 120,
        containerHeight: 120,
        key: "slashHit",
        imgSource: "../assets/slash-blood-sparks-light.png",
        imageAdjustment: {
          slashHit: {
            order: [0,1,2,3,4,5,6,7,8], 
            sprite: [
              {x: 0, y: -10},
              {x: -120, y: -10},
              {x: -240, y: -10},
              {x: 0, y: -130},
              {x: -120, y: -130},
              {x: -240, y: -130},
              {x: 0, y: -250},
              {x: -120, y: -250},
              {x: -240, y: -250},     
            ]
          }
        }
      }
      this.sprite = new Sprite(spriteModel)      
      this.frame = 1    
      engine.assets.push(this);
    })
    return promise
  }

  public update() {
    if (this.frame % 1 === 0) {
       this.sprite.doImageAdjustment()
    }
    
    this.frame++;
   
    if (this.sprite.positionNumber >= this.sprite.imageAdjustment["slashHit"].order.length - 1 ) {
      this.frame = 1
      this.sprite.positionNumber = 0
      remove(this.engine.assets, a => a === this);
      this.sprite = null;
      this.resolve()
    }
  }
}
