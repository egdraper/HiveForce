import { Asset } from '@hive-force/assets';

export class Engine {
  public index = 0;
  public assets: Asset[]
  public run(): any {
    this.assets.forEach(asset => asset.update())
    console.log(this.index++);
    requestAnimationFrame(this.run.bind(this));
  }
}
