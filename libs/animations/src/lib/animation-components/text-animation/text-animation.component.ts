import { Component, ChangeDetectorRef } from '@angular/core';
import { Sprite, TextSprite } from '../../sprite';
import { TextAnimationService } from './text-animation.service';

@Component({
  selector: 'hive-force-text-animation',
  styleUrls: ['./text-animation.component.scss'],
  templateUrl: './text-animation.component.html'
})
export class TextAnimationComponent { 
    public animations: {[key: string]: Array<Sprite> } = {}

    constructor(
      public textAnimationService: TextAnimationService,
      public changeDetectorRef: ChangeDetectorRef ) { 

      textAnimationService.animation.subscribe(sprites => { 
        if(!sprites) {
          delete this.animations["1234"]
        }
        this.animations["1234"] = sprites

        // if (!this.animations[sprite.key]) {
        //   this.animations[sprite.key] = sprite
        //   changeDetectorRef.detectChanges()
        // } else {
        //   this.animations[sprite.key].locY = sprite.locY
        //   this.animations[sprite.key].locX =  sprite.locX
        //   this.animations[sprite.key].imgSpriteTopOffset = sprite.imgSpriteTopOffset
        //   this.animations[sprite.key].imgSpriteLeftOffset = sprite.imgSpriteLeftOffset
        //   this.animations[sprite.key].performingAction =  sprite.performingAction
        //   this.animations[sprite.key].imageAdjustment =  sprite.imageAdjustment
        //   this.animations[sprite.key].positionNumber =  sprite.positionNumber
        // }
      })
  }   
}
