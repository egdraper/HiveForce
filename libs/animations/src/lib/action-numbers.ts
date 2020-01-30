import { Engine } from './engine';
import { remove } from 'lodash';
import { TextAnimation } from './text-animation';
import { Cell } from '@hive-force/spells';
import { Sprite, SpriteModel, TextSprite } from './sprite';
import { Subject } from 'rxjs';
import { cloneDeep } from "lodash";

export class NumberAnimation implements TextAnimation {
  public sprites: Array<Sprite> = []
  
  private watcher: Subject<any>;
  private resolve;
  private frame = 1;
  private engine: Engine;
  private spriteModel: SpriteModel;
  private offset = 100;
  private slowdown = 10;
  private index = 0;
  private large = false;
  private numberOffset = {
    black: {x: 0, y: 0},
    green: {x: -64, y: 0},
    red: {x: 0, y: -63},
    blue: {x: -64, y: -63},
    white: {x: 0, y: -126},
    yellow: {x: -64, y: -126},
    1: {x: 0, y: 0},
    2: {x: -16, y: 0},
    3: {x: -32, y: 0},
    4: {x: -48, y: 0},
    5: {x: 0, y: -22},
    6: {x: -16, y: -22},
    7: {x: -32, y: -22},
    8: {x: -48, y: -22},
    9: {x: 0, y: -44},
    0: {x: -16, y: -44},  
    l1: {x: 0, y: 0},
    l2: {x: -24, y: 0},
    l3: {x: -48, y: 0},
    l4: {x: -72, y: 0},
    l5: {x: 0, y: -22},
    l6: {x: -24, y: -22},
    l7: {x: -48, y: -22},
    l8: {x: -72, y: -22},
    l9: {x: 0, y: -44},
    l0: {x: -24, y: -44},  
  }

  public presetAnimation(): void {
     this.spriteModel = {
      locX: -100,
      locY: -100,
      containerWidth: 100,
      containerHeight: 100,
      key: 'numberPalette',
      imgSource: '../assets/number-palette.png',
      imageAdjustment: {
        number: {
          order: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23],
          sprite: [
            { x: 0, y: -1 },
            { x: 0, y: -13 },
            { x: 0, y: -14 },
            { x: 0, y: -15 },
            { x: 0, y: -8 },
            { x: 0, y: -4 },
            { x: 0, y: -2 },
            { x: 0, y: -1 },
            { x: 0, y: 0 },
            { x: 0, y: 1 },
            { x: 0, y: 4 },
            { x: 0, y: 7 },
            { x: 0, y: 10 },
            { x: 0, y: 13 },
            { x: 0, y: 16 },
            { x: 0, y: 18 },
            { x: 0, y: 21 },
            { x: 0, y: 0 },
            { x: 0, y: -5 },
            { x: 0, y: -3 },
            { x: 0, y: 3 },
            { x: 0, y: 5 },
            { x: 0, y: 1 },
          ]
        }
      }
    }
  }
  
  public async run(
    text: string,
    type: string,
    engine: Engine,
    location: Cell,
    watcher: Subject<any>
    ): Promise<unknown> { 
    this.watcher = watcher;
    this.engine = engine;
    this.slowdown = 10;

    const numberWidth = 19   
    const numbers = text.split("")  
   
    if(Number(text) > 9) {
      this.large = true
    }
   
    numbers.forEach((num, index) => {         
      const model = cloneDeep(this.spriteModel) as SpriteModel
      const yOffset = (this.numberOffset[type].y + (this.numberOffset[num].y))
      
      let yLargeAdjustment = 0
      let containerSizeOffset = 0
      let imageSize = "auto"
      let offset = 7 * (numbers.length - 1)
     
      if(this.large) {
        num = `l${num}`
        yLargeAdjustment = (Math.floor(yOffset / 2))
        offset = 10 * (numbers.length - 1)
        containerSizeOffset = 8
        imageSize = "192px";
      }
      
      model.imgSpriteTopOffset = yOffset + yLargeAdjustment
      model.imgSpriteLeftOffset = this.numberOffset[type].x + this.numberOffset[num].x
      model.locX = location.posX + (17 - offset) + (index * numberWidth)
      model.locY = location.posY
      model.containerWidth = 16 + containerSizeOffset
      model.containerHeight = 22 + containerSizeOffset
      model.imageWidth = imageSize
      this.sprites.push(new Sprite(model))
    });

    engine.assets.push(this);

    const promise = new Promise(resolve => {
      this.resolve = resolve;
    });
    return promise;
  }
  
  public update() {
    if (this.frame % 2 === 0 && this.index < 23) {
      this.sprites.forEach(sprite => {
        const pos = sprite.imageAdjustment["number"].sprite
        const order = sprite.imageAdjustment["number"].order[this.index]

        sprite.locY = sprite.locY + pos[order].y
      })
      this.index++
      this.slowdown = this.slowdown > 0 ? this.slowdown - 1 : 0
      this.watcher.next(this.sprites)
    }
    
    this.frame++ ;  

    if (this.frame >= 150) {
      // Makes the Image disappear
      this.watcher.next(null);

      // Removes the this animation from the engine.
      remove(this.engine.assets, a => a === this);

      // Allows the using class to know when the animation is done. 
      this.resolve();   
    }
  }    
}
