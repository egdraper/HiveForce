// tslint:disable: radix
import { Component, HostListener, Output, EventEmitter } from '@angular/core';
import { ActionAnimationService } from '@hive-force/animations'
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
    ) {
    animationService.animationStarted.subscribe(locationCell => {
       const animatingCreature = this.creatureAssetService.findByLocation(locationCell.id)
      animatingCreature.sprite.performingAction = true
    })

    animationService.animationEnded.subscribe(locationCell => {
      const animatingCreature = this.creatureAssetService.findByLocation(locationCell.id)
      animatingCreature.sprite.performingAction = false
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
      activePlayer.sprite.key = "up"  
      activePlayer.sprite.doImageAdjustment() 
    }

    if (event.code === 'KeyA') {
      activePlayer.sprite.key = "left"  
      activePlayer.sprite.doImageAdjustment() 
    }
    
    if (event.code === 'KeyD') {
      activePlayer.sprite.key = "right"  
      activePlayer.sprite.doImageAdjustment() 
    }
    
    if (event.code === 'KeyS') {
      activePlayer.sprite.key = "down"  
      activePlayer.sprite.doImageAdjustment() 
    }

    if (event.code === 'KeyP') {
      activePlayer.sprite.key = "dead"  
      activePlayer.sprite.doImageAdjustment() 
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
  
  public selectAction(action: Action, event: any): void {
    const activeCreature = this.creatureAssetService.getActivePlayer()
    activeCreature.selectedAction = action
    if(action instanceof MoveAction && (action.maxRange > action.range)) {
      action.areaOfEffect = null
    }

    if(!action.areaOfEffect || Object.keys(action.areaOfEffect).length === 0  || action.name !== "Move") {
      action.areaOfEffect = {}
      this.highlight(action)
    } 

    event.stopPropagation()
    activeCreature.attributes.actions.forEach(a => a.selected = false)
    
    action.selected = true
  }

  public executeAction(action: Action): void {
    const selectedCreatures = this.creatureAssetService.getAllSelectedCreatures()
    action.executeAction(
      this.animationService.engine,
      this.creatureAssetService.getActivePlayer(),
      selectedCreatures,
      this.animationService
    )
  }

  // private adjustMovement(): void {
  //   const moveAction = this.creatureAsset.attributes.actions.find(a => a.name === "Move") as MoveAction
  //   const shortestPath = new ShortestPath()
  //   const pathBack = shortestPath.find(this.creatureAsset.location.cell, this.map.grid[moveAction.starting], this.gridCreatures)
  //   moveAction.range =  moveAction.range - shortestPath.totalDistance
  // }
  
}
