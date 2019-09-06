import { GameComponents } from '@hive-force/assets';
import { Injectable } from '@angular/core';

@Injectable()
export class Engine {
  public assets: GameComponents[] = []
  public run(): any {
    this.assets.forEach(asset => asset.update())
    requestAnimationFrame(this.run.bind(this));
  }
}
