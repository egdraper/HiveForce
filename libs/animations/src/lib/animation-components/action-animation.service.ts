import { Injectable } from '@angular/core';
import { Subject, interval } from 'rxjs';
import { ActionAnimation } from './../action-animation';
import { Engine } from './../engine';
import { Sprite } from './../sprite';

@Injectable()
export class ActionAnimationService {
  public animation = new Subject<Sprite>();
  public animationStarted = new Subject<any>();
  public animationEnded = new Subject<any>();
  
  constructor(public engine: Engine) {}

  // Animations that need to either one-after-the-other or with a specific delay between two
  public async sequenceAnimations(
    animations: Array<ActionAnimation>, 
    delayTimeMS?: number)
    : Promise<void> {
    if(delayTimeMS) {
      let index = 0
      interval(delayTimeMS).subscribe(() => {
        animations[index].run(this.engine, animations[index].location, this.animation)
        index++
      })
    } else {
      for (const animation of animations) {
        if(animation) {
          this.animationStarted.next(animation.location)
          await animation.run(this.engine, animation.location, this.animation)
          this.animationEnded.next(animation.location)
        }
      }
    }
  }
}