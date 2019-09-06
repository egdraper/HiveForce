// tslint:disable: radix
import { Component, Input, HostListener} from '@angular/core';
import { CreatureAsset, Action, GameComponents, CreaturesEffect, MoveAction, ShortestPath } from '@hive-force/assets';
import { MasterLog } from '@hive-force/log';
import { Map } from "@hive-force/maps"
import { TextAnimation, ActionAnimation, Engine, ActionAnimationService } from '@hive-force/animations';
import { debug } from 'util';

@Component({
  selector: 'creature-asset',
  templateUrl: './creature.component.html',
  styleUrls: ['./creature.component.scss']
})
export class CreatureAssetComponent implements GameComponents{
  @Input() public creatureAsset: CreatureAsset;
  @Input() public gridCreatures: Array<CreatureAsset>;
  @Input() public map: Map;
  @Input() public creaturesAreSelected = false

  public textAnimation: TextAnimation
  public sideBarOn = true

  private ctrIsHeld = false

  constructor(private animationService: ActionAnimationService) {}
  // private listener

  // public constructor(private renderer: Renderer2) {}

  public ngOnInit(): void {
    this.creatureAsset.location.grid = this.map.grid
    this.creatureAsset.location.creaturesOnGrid = this.gridCreatures
    this.creatureAsset.sprite.doImageAdjustment()

    // this.listener = this.renderer.listen('document', 'keydown', this.move.bind(this) )
  }

  public ngAfterViewInit(): void {
    this.animationService.engine.assets.push(this)
  }

  public update(): void {
   
   this.creaturesAreSelected = this.gridCreatures.filter(gc => gc.selected).length > 0
   // TODO Update actionList depending on selected creature

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
      this.creatureAsset.sprite.key = "up"  
      this.creatureAsset.sprite.doImageAdjustment() 
    }

    if (event.code === 'KeyA') {
      this.creatureAsset.sprite.key = "left"  
      this.creatureAsset.sprite.doImageAdjustment() 
    }
    
    if (event.code === 'KeyD') {
      this.creatureAsset.sprite.key = "right"  
      this.creatureAsset.sprite.doImageAdjustment() 
    }
    
    if (event.code === 'KeyS') {
      this.creatureAsset.sprite.key = "down"  
      this.creatureAsset.sprite.doImageAdjustment() 
    }
  }

  public highlight(action: Action) {
    action.areaOfEffect = this.map.getAreaOfEffect(action.range, this.creatureAsset.location.cell.x, this.creatureAsset.location.cell.y)
  }

  public onCreatureSelect(): void {    
    if(this.creatureAsset.activePlayer) {
      return
    }

    const wasSelected = this.creatureAsset.selected
    
    if(!this.ctrIsHeld) {
      this.gridCreatures.forEach(a => a.selected = false)
    }
    
    this.creatureAsset.selected = !wasSelected
    
    if(this.creatureAsset.selected) {
      this.gridCreatures.filter(a => a.selected)
    }
  }
  
  public selectAction(action: Action, event: any): void {
    this.creatureAsset.selectedAction = action
    if(action instanceof MoveAction && (action.maxRange > action.range)) {
      action.areaOfEffect = null
    }

    if(!action.areaOfEffect || action.name !== "Move") {
      action.areaOfEffect = {}
      this.highlight(action)
    } 

    event.stopPropagation()
    this.creatureAsset.attributes.actions.forEach(a => a.selected = false)
    
    action.selected = true
  }

  public getSelectedCreatures(): Array<CreatureAsset> {
    return this.gridCreatures.filter(c => c.selected) || []
  }

  public executeAction(action: Action): void {
    const selectedCreatures = this.getSelectedCreatures()
    action.executeAction(
      this.animationService.engine,
      this.creatureAsset,
      selectedCreatures,
      this.animationService
    )
  }

  private adjustMovement(): void {
    const moveAction = this.creatureAsset.attributes.actions.find(a => a.name === "Move") as MoveAction
    const shortestPath = new ShortestPath()
    const pathBack = shortestPath.find(this.creatureAsset.location.cell, this.map.grid[moveAction.starting], this.gridCreatures)
    moveAction.range =  moveAction.range - shortestPath.totalDistance
  }
  
}
