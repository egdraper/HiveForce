export class SpriteSection {
  order: number[];
  sprite: Array<{ x: number; y: number }>;
}

export interface SpriteModel {
  id?: string
  name?: string
  containerWidth?: number
  containerHeight?: number
  locY?: number
  locX?: number
  imgSource?: string
  imgSheetWidth?: string
  imgSpriteTopOffset?: number
  imgSpriteLeftOffset?: number  
  imgBottomOffset?: number
  imageHeight?: string
  imageWidth?: string
  performingAction?: boolean
  imageAdjustment?: { [section: string]: SpriteSection };
  key?: string;
  positionNumber?: number;
  shadow?: string;
  radius?: number;
  rotate?: number;
}

export class Sprite implements SpriteModel {
  // sprite info
    public id = ""
    public name = "Name"
    public containerWidth = 50;
    public containerHeight = 75;
    public locY = 0
    public locX = 0
    public imgSource = '../assets/motw.png';
    public imgSheetWidth = "";
    public imgSpriteTopOffset = -9;
    public imgSpriteLeftOffset = -1;
    public imgBottomOffset = 0;
    public imageHeight = 'auto';
    public imageWidth = '100%';
    public performingAction = false;
    public imageAdjustment: { [section: string]: SpriteSection } = {};
    public key = 'down';
    public positionNumber = 0;
    public shadow = "";
    public radius = 0;
    public rotate = 0;

  constructor(sprite: SpriteModel) {
    this.name = sprite.name
    this.containerWidth = sprite.containerWidth || this.containerWidth
    this.containerHeight = sprite.containerHeight || this.containerHeight
    this.locY = sprite.locY || this.locY
    this.locX = sprite.locX || this.locX
    this.imgSource = sprite.imgSource || this.imgSource
    this.imgSheetWidth = sprite.imgSheetWidth || this.imgSheetWidth
    this.imgSpriteTopOffset = sprite.imgSpriteTopOffset || this.imgSpriteTopOffset
    this.imgSpriteLeftOffset = sprite.imgSpriteLeftOffset || this.imgSpriteLeftOffset
    this.imgBottomOffset = sprite.imgBottomOffset || this.imgBottomOffset
    this.imageHeight = sprite.imageHeight || this.imageHeight
    this.imageWidth = sprite.imageWidth || this.imageWidth
    this.performingAction = sprite.performingAction || this.performingAction
    this.imageAdjustment = sprite.imageAdjustment || this.imageAdjustment
    this.key = sprite.key || this.key
    this.positionNumber = sprite.positionNumber || this.positionNumber
    this.shadow = sprite.shadow || this.shadow
    this.radius = sprite.radius || this.radius
    this.rotate = sprite.rotate || this.rotate
  }

  public doImageAdjustment(): void {
    if (this.imageAdjustment && this.imageAdjustment[this.key]) {
      const a = this.imageAdjustment[this.key];
      this.imgSpriteLeftOffset = a.sprite[a.order[this.positionNumber]].x;
      this.imgSpriteTopOffset = a.sprite[a.order[this.positionNumber]].y;
      this.positionNumber >= a.order.length - 1
        ? (this.positionNumber = 0)
        : this.positionNumber++;
    }
  }
}
