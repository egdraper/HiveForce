import { Injectable } from '@angular/core';

@Injectable()
export class Engine {
  public assets: any[] = []
  public run(): any {
    this.assets.forEach(asset => asset.update())
    requestAnimationFrame(this.run.bind(this));
  }
}
