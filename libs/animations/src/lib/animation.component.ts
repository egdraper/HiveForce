import { Component, ChangeDetectorRef } from '@angular/core';
import { ActionAnimationService } from './animation.service';
import { Sprite, SpriteSection } from './sprite';

@Component({
  selector: 'hive-force-animation',
  styleUrls: ['./animation.component.scss'],
  templateUrl: './animation.component.html'
})
export class ActionAnimationComponent { 
    public animations: {[key: string]: Sprite } = {}

    constructor(
      public animationService: ActionAnimationService,
      public changeDetectorRef: ChangeDetectorRef ) { 

      animationService.animation.subscribe(sprite => { 

        if(!sprite.performingAction) {
          // debugger
          // delete this.animations[sprite.id]
          // return
        }

        if (!this.animations[sprite.key]) {
          this.animations[sprite.key] = sprite
          changeDetectorRef.detectChanges()
        } else {
          this.animations[sprite.key].locY = sprite.locY
          this.animations[sprite.key].locX =  sprite.locX
          this.animations[sprite.key].imgSpriteTopOffset = sprite.imgSpriteTopOffset
          this.animations[sprite.key].imgSpriteLeftOffset = sprite.imgSpriteLeftOffset
          this.animations[sprite.key].performingAction =  sprite.performingAction
          this.animations[sprite.key].imageAdjustment =  sprite.imageAdjustment
          this.animations[sprite.key].positionNumber =  sprite.positionNumber
        }
      })
  }

    
}
