import { Engine } from './engine';
import { remove } from 'lodash';
import { ActionAnimation } from './action-animation';

import { Cell } from '@hive-force/maps';
import { Sprite } from './sprite';
import { Subject } from 'rxjs';

export class SlashHitAnimation implements ActionAnimation {
  public sprite: Sprite
  private resolve
  private frame = 1;
  private engine: Engine;
  private watcher: Subject<Sprite> ;

  public presetAnimation(watcher: Subject<Sprite>) {
    const spriteModel = {
      locX: -100,
      locY: -100,
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
    watcher.next(this.sprite)
  }

  public run(engine: Engine, location: Cell, watcher: Subject<Sprite>): Promise<unknown> {
    this.watcher = watcher
    this.sprite.locX = location.posX - 40
    this.sprite.locY = location.posY - 50
    this.sprite.performingAction = true   
    this.engine = engine;
    engine.assets.push(this);
   
    const promise = new Promise( (resolve) => { 
      this.resolve = resolve   
    })
    return promise
  }
  
  public update() {
    if (this.frame % 10 === 0) {
      this.sprite.doImageAdjustment()
      this.watcher.next(this.sprite)
    }
    
    this.frame++;
   
    if (this.sprite.positionNumber >= this.sprite.imageAdjustment["slashHit"].order.length ) {
      this.frame = 1
      this.sprite.positionNumber = 0
      this.sprite.performingAction = false 
      this.watcher.next(this.sprite)
      remove(this.engine.assets, a => a === this);
      this.resolve()
    }
  }
}
