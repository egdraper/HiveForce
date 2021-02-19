import { Component, HostListener, OnInit } from '@angular/core';
import { ActionAnimationService, Sprite } from "@hive-force/animations";
import { CreatureAsset } from "@hive-force/assets";

@Component({
  selector: 'hive-force-sprite-tool',
  templateUrl: './sprite-tool.component.html',
  styleUrls: ['./sprite-tool.component.scss']
})
export class SpriteToolComponent {
  public creatureAsset = new CreatureAsset()
  public posX = 0;
  public posY = 0
  public directions = ["left", "up", "right", "down"]

  private order = 0

  constructor(
    private animationService: ActionAnimationService
  ){ 
    this.creatureAsset.activeSprite = new Sprite()
    this.creatureAsset.activeSprite.imgSource = "../../../assets/motw.png"
    
    this.creatureAsset.activeSprite.imageAdjustment["down"] = { } as any

    this.animationService.engine.assets.push(this.creatureAsset)
    this.animationService.engine.run() 
  }

  public add(direction: string = "down"): void {
    if(this.order === 0) {
      this.creatureAsset.activeSprite.imageAdjustment["down"].order = []
      this.creatureAsset.activeSprite.imageAdjustment["down"].sprite = []
    }
    debugger
    this.creatureAsset.activeSprite.imageAdjustment["down"].order.push(this.order++)
    this.creatureAsset.activeSprite.imageAdjustment["down"].sprite.push({x: this.posX, y: this.posY})
  }

  @HostListener("document:keydown", ["$event"]) 
  public async move(event): Promise<void> {
    if (event.code === 'KeyW') {
      this.posY++
    }

    if (event.code === 'KeyA') {
      this.posX--
    }
    
    if (event.code === 'KeyD') {
      this.posX++
    }
    
    if (event.code === 'KeyS') {
      this.posY--
    }
  }

  public asyn 

  // <{  
  //   down: { 
  //     order: [0,1,2,1],
  //     sprite: [{x: -313, y: -2},   {x: -365, y: -2 },   {x: -417, y: -2 }]
  //   },
  //   left: {
  //     order: [0,1,2,1],
  //     sprite: [{x: -313, y: -75},  {x: -365,  y: -75 },  {x: -417, y: -75 }]
  //   },
  //   right: {
  //     order: [0,1,2,1],
  //     sprite: [{x: -313, y: -147}, {x: -365,  y: -147 }, {x: -417, y: -147 }]
  //   },
  //   up: {
  //     order: [0,1,2,1],
  //     sprite: [{x: -313, y: -221}, {x: -365,  y: -221 }, {x: -417, y: -221 }]
  //   },
  // },

}
