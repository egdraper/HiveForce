import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Engine } from '../../engine';
import { Cell } from '@hive-force/spells';
import { AssetAnimation } from '../../asset-animation';

@Injectable()
export class AssetAnimationService {
  public animation = new Subject<any>();
  public animationStarted = new Subject<any>();
  public animationEnded = new Subject<any>();
  
  constructor(public engine: Engine) {}

  public async animate(assetAnimation: AssetAnimation, location: Cell): Promise<void> {
    assetAnimation.run(this.engine, location)
  }
}