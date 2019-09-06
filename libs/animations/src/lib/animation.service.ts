import { Injectable } from '@angular/core';
import { Subject, interval } from 'rxjs';
import { ActionAnimation } from './action-animation';
import { Cell } from '@hive-force/maps';
import { Engine } from './engine';
import { Sprite } from './sprite';

@Injectable()
export class ActionAnimationService {
  public animation = new Subject<Sprite>();
  
  constructor(public engine: Engine) {}

  // Animations that need to either one-after-the-other or with a specific delay between two
  public async sequenceAnimations(animations: Array<ActionAnimation>, delayTimeMS?: number): Promise<void> {
    if(delayTimeMS) {
      let index = 0
      interval(delayTimeMS).subscribe(() => {
        animations[index].run(this.engine, animations[index].location, this.animation)
        index++
      })
    } else {
      for (const animation of animations) {
        await animation.run(this.engine, animation.location, this.animation)
      }
    }
  }
}