import { Injectable } from '@angular/core';
import { Subject, interval } from 'rxjs';
import { Sprite } from '../../sprite';
import { Engine } from '../../engine';
import { TextAnimation } from '../../text-animation';
import { Cell } from '@hive-force/spells';

@Injectable()
export class TextAnimationService {
  public animation = new Subject<any>();
  public animationStarted = new Subject<any>();
  public animationEnded = new Subject<any>();
  
  constructor(public engine: Engine) {}

  public async animate(text: string, type: string, textAnimation: TextAnimation, location: Cell): Promise<void> {
    textAnimation.run(text, type, this.engine, location, this.animation )
  }
}