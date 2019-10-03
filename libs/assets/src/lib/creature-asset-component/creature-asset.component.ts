// tslint:disable: radix
import { Component, HostListener, Output, EventEmitter } from '@angular/core';
import { ActionAnimationService, TextAnimationService } from '@hive-force/animations'
import { CreatureAssetService } from './creature-asset.service';
import { Action, CreatureAsset, MoveAction } from '../creature-assets';

interface AreaOfEffectModel { range: number, cellX: number, cellY: number }

@Component({
  selector: 'hive-force-creature-asset',
  templateUrl: './creature-asset.component.html',
  styleUrls: ['./creature-asset.component.scss']
})
export class CreatureAssetComponent {
  @Output() creatureChange = new EventEmitter()
  @Output() areaOfEffectChange = new EventEmitter<AreaOfEffectModel>()
  private ctrIsHeld = false

  constructor(
    public creatureAssetService: CreatureAssetService,
    private animationService: ActionAnimationService,
    public textAnimationService: TextAnimationService
    ) {
    animationService.animationStarted.subscribe(locationCell => {
       const animatingCreature = this.creatureAssetService.findByLocation(locationCell.id)
      animatingCreature.activeSprite.performingAction = true
    })

    animationService.animationEnded.subscribe(locationCell => {
      const animatingCreature = this.creatureAssetService.findByLocation(locationCell.id)
      animatingCreature.activeSprite.performingAction = false
    })

    
  }
  
  @HostListener("document:keyup", ["$event"]) 
  public keyup(event): void {
    if(event.key === "Control") {
      this.ctrIsHeld = false
    }
  }

  @HostListener("document:keydown", ["$event"]) 
  public async move(event): Promise<void> {
    if(event.key === "Control") {
      this.ctrIsHeld = true
    }
    
    const activePlayer = this.creatureAssetService.getActivePlayer()

    if (event.code === 'KeyW') {
      activePlayer.activeSprite.key = "up"  
      activePlayer.activeSprite.doImageAdjustment() 
    }

    if (event.code === 'KeyA') {
      activePlayer.activeSprite.key = "left"  
      activePlayer.activeSprite.doImageAdjustment() 
    }
    
    if (event.code === 'KeyD') {
      activePlayer.activeSprite.key = "right"  
      activePlayer.activeSprite.doImageAdjustment() 
    }
    
    if (event.code === 'KeyS') {
      activePlayer.activeSprite.key = "down"  
      activePlayer.activeSprite.doImageAdjustment() 
    }
  }

  public highlight(action: Action) {
    this.areaOfEffectChange.emit({
      range: action.range,
      cellX: this.creatureAssetService.getActivePlayer().location.cell.x,
      cellY: this.creatureAssetService.getActivePlayer().location.cell.y
    })
  }

  public onCreatureSelect(creature: CreatureAsset): void {    
    const wasSelected = creature.selected
    
    if(!this.ctrIsHeld) {
      this.creatureAssetService.deselectAllCreatures()
    }
    
    creature.selected = !wasSelected 
  }
  
  public selectAction(action: Action, activeCreature: CreatureAsset, event: any): void {
    event.stopPropagation()
    activeCreature.selectedAction = action
   
    if(action instanceof MoveAction && (action.maxRange > action.range)) {
      action.areaOfEffect = null
    }

    if(!action.areaOfEffect || Object.keys(action.areaOfEffect).length === 0  || action.name !== "Move") {
      action.areaOfEffect = {}
      this.highlight(action)
    } 

    activeCreature.attributes.actions.forEach(a => a.selected = false)
    action.selected = true
  }

  public onExecuteClick(action: Action): void {
    const selectedCreatures = this.creatureAssetService.getAllSelectedCreatures()
    action.executeAction(
      this.creatureAssetService.getActivePlayer(),
      selectedCreatures,
      this.animationService,
      this.textAnimationService,
    )
  }

  // private adjustMovement(): void {
  //   const moveAction = this.creatureAsset.attributes.actions.find(a => a.name === "Move") as MoveAction
  //   const shortestPath = new ShortestPath()
  //   const pathBack = shortestPath.find(this.creatureAsset.location.cell, this.map.grid[moveAction.starting], this.gridCreatures)
  //   moveAction.range =  moveAction.range - shortestPath.totalDistance
  // }
  
}
