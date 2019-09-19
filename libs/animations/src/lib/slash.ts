import { Engine } from './engine';
import { remove } from 'lodash';
import { ActionAnimation } from './action-animation';
import { Cell } from '@hive-force/spells';
import { Sprite } from './sprite';
import { Subject } from 'rxjs';

export class SlashAnimation implements ActionAnimation {
  public sprite: Sprite;
  private watcher: Subject<any>;
  private resolve;
  private frame = 1;
  private engine: Engine;
  private started = false

  public presetAnimation(watcher: Subject<Sprite>): void {
    const spriteModel = {
      locX: -100,
      locY: -100,
      containerWidth: 100,
      containerHeight: 100,
      key: 'heroSwing',
      imgSource: '../assets/slash-swing-large.png',
      imageAdjustment: {
        heroSwing: {
          order: [0, 1, 2, 3, 4, 5, 6, 7, 8],
          sprite: [
            { x: 0, y: -10 },
            { x: -100, y: -10 },
            { x: -200, y: -10 },
            { x: 0, y: -110 },
            { x: -100, y: -110 },
            { x: -200, y: -110 },
            { x: 0, y: -210 },
            { x: -100, y: -210 },
            { x: -200, y: -210 }
          ]
        }
      }
    };
    this.sprite = new Sprite(spriteModel as any);
    watcher.next(this.sprite)
  }

  public async run(
    engine: Engine,
    location: Cell,
    watcher: Subject<any>
  ): Promise<unknown> {
    this.watcher = watcher;
    this.sprite.locX = location.posX - 20
    this.sprite.locY = location.posY - 25
    this.sprite.performingAction = true;
    this.engine = engine;
    engine.assets.push(this);

    const promise = new Promise(resolve => {
      this.resolve = resolve;
    });
    return promise;
  }
  
  public update() {
    if (this.frame % 2 === 0) {
      this.sprite.doImageAdjustment();
      this.watcher.next(this.sprite);
      
      if (this.sprite.positionNumber === 1 && this.started) {
        this.frame = 1;
        this.started = false;
        this.sprite.positionNumber = 0;
        this.sprite.performingAction = false;
        this.watcher.next(this.sprite);
        remove(this.engine.assets, a => a === this);
        this.resolve();   
      }

      if(this.sprite.positionNumber === 1) {
        this.started = true
      }
  }
      
  this.frame++;
    
  }
}
