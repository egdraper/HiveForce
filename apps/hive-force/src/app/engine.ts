import { Asset, GameComponents } from '@hive-force/assets';

export class Engine {
  public assets: GameComponents[] = []
  public run(): any {
    this.assets.forEach(asset => asset.update())
    requestAnimationFrame(this.run.bind(this));
  }
}
