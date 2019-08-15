import { Engine } from './engine';
import { remove } from 'lodash';
import { ActionAnimation } from './actionAnimation';
import { Cell } from '../../model';

export class SlashAnimation implements ActionAnimation {
  public imgUrl = '../assets/quick-slash.png';
  public animationFrame = null;
  private animationIndex = 0;
  private frameIndex = 0;
  private engine: Engine;
  private performingCell: Cell;
  private receivingCell: Cell;

  public run(engine: Engine, performingCell: Cell, receivingCell: Cell): void {
    this.engine = engine;
    this.performingCell = performingCell;
    this.receivingCell = receivingCell;
    this.animationIndex = 0;
    this.frameIndex = 0;
    engine.assets.push(this);
  }

  public update() {
    if (
      this.frameIndex === 4 ||
      this.frameIndex === 8 ||
      this.frameIndex === 12 ||
      this.frameIndex === 16 ||
      this.frameIndex === 20
    ) {
      const step = this.getAnimationSteps()[this.animationIndex++];
      this.animationFrame = step;
    }

    if (
      this.frameIndex === 32 ||
      this.frameIndex === 36 ||
      this.frameIndex === 40 ||
      this.frameIndex === 44 ||
      this.frameIndex === 48
    ) {
        debugger
      const step = this.getAnimationSteps()[this.animationIndex++];
      this.animationFrame = step;
    }

    this.frameIndex++;

    if (this.animationIndex >= this.getAnimationSteps().length) {
      remove(this.engine.assets, a => a === this);
      this.animationFrame = null;
    }
  }

  private getAnimationSteps(): any[] {
    return [
      {
        step: 1,
        opacity: 1,
        top: 15,
        locX: this.performingCell.posX,
        locY: this.performingCell.posY,
        width: 50,
        height: 50
      },
      {
        step: 2,
        opacity: 1,
        top: 15,
        locX: this.performingCell.posX,
        locY: this.performingCell.posY,
        width: 50,
        height: 50
      },
      {
        step: 3,
        opacity: 1,
        top: 15,
        locX: this.performingCell.posX,
        locY: this.performingCell.posY,
        width: 50,
        height: 50
      },
      {
        step: 4,
        opacity: 1,
        top: 15,
        locX: this.performingCell.posX,
        locY: this.performingCell.posY,
        width: 50,
        height: 50
      },
      {
        step: 5,
        opacity: 1,
        top: 15,
        locX: this.performingCell.posX,
        locY: this.performingCell.posY,
        width: 50,
        height: 50
      },
      {
        step: 6,
        opacity: 1,
        top: 15,
        locX: this.receivingCell.posX,
        locY: this.receivingCell.posY,
        width: 50,
        height: 50
      },
      {
        step: 7,
        opacity: 1,
        top: 15,
        locX: this.receivingCell.posX,
        locY: this.receivingCell.posY,
        width: 50,
        height: 50
      },
      {
        step: 8,
        opacity: 1,
        top: 15,
        locX: this.receivingCell.posX,
        locY: this.receivingCell.posY,
        width: 50,
        height: 50
      },
      {
        step: 9,
        opacity: 1,
        top: 15,
        locX: this.receivingCell.posX,
        locY: this.receivingCell.posY,
        width: 50,
        height: 50
      },
      {
        step: 10,
        opacity: 1,
        top: 15,
        locX: this.receivingCell.posX,
        locY: this.receivingCell.posY,
        width: 50,
        height: 50
      }
    ];
  }
}
