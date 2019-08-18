export class SpriteSection {
  order: number[];
  sprite: Array<{ x: number; y: number }>;
}

export class Sprite {
  // sprite info
  public containerWidth? = 50;
  public containerHeight? = 75;
  public locY = 0
  public locX = 0
  public imgSource? = '../assets/motw.png';
  public imgSheetWidth? = '';
  public imgSpriteTopOffset? = -9;
  public imgSpriteLeftOffset? = -1;
  public imgBottomOffset? = 0;
  public imageHeight? = 'auto';
  public imageWidth? = '100%';
  public performingAction = false;

  // up, down, left, right, die, fly.., attack..,
  public imageAdjustment?: { [section: string]: SpriteSection } = {};
  public key = 'down';
  public positionNumber = 0;

  public doImageAdjustment(): void {
    if (this.imageAdjustment && this.imageAdjustment[this.key]) {
      const a = this.imageAdjustment[this.key];
      this.positionNumber >= a.order.length - 1
        ? (this.positionNumber = 0)
        : this.positionNumber++;
      this.imgSpriteLeftOffset = a.sprite[a.order[this.positionNumber]].x;
      this.imgSpriteTopOffset = a.sprite[a.order[this.positionNumber]].y;
    }
  }
}
