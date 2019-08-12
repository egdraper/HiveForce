import { Asset } from '@hive-force/assets';

export class Engine {
  public assets: Asset[]
  public run(): any {
    this.assets.forEach(asset => asset.update())
    requestAnimationFrame(this.run.bind(this));
  }
}
