import { Engine } from './engine';
import { remove } from 'lodash';
import { ActionAnimation } from './action-animation';
import { Cell } from '@hive-force/spells';
import { Sprite } from './sprite';
import { Subject } from 'rxjs';
import { AssetAnimation } from './asset-animation';

export class Fire1Animation implements AssetAnimation {
  public sprite: Sprite;
  public location: Cell;
  public key= ""
  private watcher: Subject<any>;
  private resolve;
  private frame = 1;
  private engine: Engine;
  private started = false


  public presetAnimation(watcher: Subject<Sprite>): void {
    const spriteModel = {
      locX: -100,
      locY: -100,
      containerWidth: 50,
      containerHeight: 50,
      id: new Date().getTime().toString(),
      key: "fire1",
      imgSource: '../assets/dog.png',
      imageAdjustment: {
        fire1: {
          order: [0, 1, 2],
          sprite: [
            { x: 0, y: -0 },
            { x: 0, y: -50 },
            { x: 0, y: -100 },
            { x: 0, y: -50 },
          ]
        },
        fire2: {
          order: [0, 1, 2, 3, 4],
          sprite: [
            { x: -50, y: -50 },
            { x: -100, y: -50 },
            { x: -0, y: -100 },
            { x: -50, y: -100 },
            { x: -100, y: -100 },
          ]
        }
      }
    };
    this.sprite = new Sprite(spriteModel as any);
    this.watcher = watcher
    this.watcher.next(this.sprite)
  }

  public async run(
    engine: Engine,
    location: Cell,
  ): Promise<unknown> {
    this.sprite.locX = location.posX
    this.sprite.locY = location.posY
    this.sprite.performingAction = true;
    this.engine = engine;
    engine.assets.push(this);

    const promise = new Promise(resolve => {
      this.resolve = resolve;
    });
    return promise;
  }
  
  public update() {
    if (this.frame % 15 === 0) {
      this.sprite.doImageAdjustment();
      this.watcher.next(this.sprite);
      
      // if (this.sprite.positionNumber === 1 && this.started) {
      //   this.frame = 1;
      //   this.started = false;
      //   this.sprite.positionNumber = 0;
      //   this.sprite.performingAction = false;
      //   this.watcher.next(this.sprite);
      //   remove(this.engine.assets, a => a === this);
      //   this.resolve();   
      // }

      if(this.sprite.positionNumber === 1) {
        this.started = true
      }
    }
      
    this.frame++;    
  }
}
