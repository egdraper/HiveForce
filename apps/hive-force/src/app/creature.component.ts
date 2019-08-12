// tslint:disable: radix
import { Component, Input, HostListener, Renderer2 } from '@angular/core';
import { CreatureAsset, Cell } from '@hive-force/assets';
import { SquareComponent } from './grid/square/square.component';
import { remove, cloneDeep } from "lodash"


@Component({
  selector: 'creature-asset',
  templateUrl: './creature.component.html',
  styleUrls: ['./creature.component.scss']
})
export class CreatureAssetComponent {
  @Input() public creatureAsset: CreatureAsset;
  @Input() public gridCreatures: Array<CreatureAsset>;
  @Input() public grid: { [cell: string]: any };

  private ctrIsHeld = false
  // private listener

  // public constructor(private renderer: Renderer2) {}

  public ngOnInit(): void {
    this.creatureAsset.location.grid = this.grid
    this.creatureAsset.location.creaturesOnGrid = this.gridCreatures
    this.creatureAsset.sprite.doImageAdjustment()
    // this.listener = this.renderer.listen('document', 'keydown', this.move.bind(this) )
  }

  // @HostListener("document:keydown", ["$event"]) 
  // public keydown(event): void {
  //   if(event.key === "Control") {
  //     this.ctrIsHeld = true
  //   }
  // }

  
  @HostListener("document:keyup", ["$event"]) 
  public keyup(event): void {
    if(event.key === "Control") {
      this.ctrIsHeld = false
    }
    // this.listener = this.renderer.listen('document', 'keydown', this.move.bind(this) )
  }

  // private index = 0
  @HostListener("document:keydown", ["$event"]) 
  public async move(event): Promise<void> {
    if(event.key === "Control") {
      this.ctrIsHeld = true
    }
  
    if(!this.creatureAsset.activePlayer) { return }

    if (event.code === 'KeyW') {
      this.creatureAsset.sprite.direction = "up"  
      this.creatureAsset.sprite.doImageAdjustment() 
    }

    if (event.code === 'KeyA') {
      this.creatureAsset.sprite.direction = "left"  
      this.creatureAsset.sprite.doImageAdjustment() 
    }
    
    if (event.code === 'KeyD') {
      this.creatureAsset.sprite.direction = "right"  
      this.creatureAsset.sprite.doImageAdjustment() 
    }
    
    if (event.code === 'KeyS') {
      this.creatureAsset.sprite.direction = "down"  
      this.creatureAsset.sprite.doImageAdjustment() 
    }
  }
  
  
  public onCreatureSelect(): void {
    if(!this.ctrIsHeld) {
      this.gridCreatures.forEach(a => a.selected = false)
    }

    this.creatureAsset.selected = !this.creatureAsset.selected
  }
}
