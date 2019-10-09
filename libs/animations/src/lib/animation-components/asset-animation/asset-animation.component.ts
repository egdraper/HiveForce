import { Component, ChangeDetectorRef } from '@angular/core';
import { Sprite } from '../../sprite';
import { AssetAnimationService } from './asset-animation.service';

@Component({
  selector: 'hive-force-asset-animation',
  styleUrls: ['./asset-animation.component.scss'],
  templateUrl: './asset-animation.component.html'
})
export class AssetAnimationComponent { 
    public animations: {[key: string]: Array<Sprite> } = {}

    constructor(
      public assetAnimationService: AssetAnimationService,
      public changeDetectorRef: ChangeDetectorRef ) { 

      assetAnimationService.animation.subscribe(sprites => { 
        if(!sprites) {
          delete this.animations[sprites.id]
        }
        this.animations[sprites.id] = sprites
      })
  }   
}
