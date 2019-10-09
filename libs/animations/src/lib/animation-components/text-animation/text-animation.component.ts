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
      })
  }   
}
