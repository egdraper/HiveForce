// tslint:disable: radix
import { Component, Input, HostListener} from '@angular/core';
import { CreatureAsset, Action, GameComponents, Engine, SlashAnimation, TextAnimation, ActionResultTextAnimation, CreaturesEffect, Cell, RelativePositionCell } from '@hive-force/assets';
import { MasterLog } from '@hive-force/log';
import { ActionAnimation } from 'libs/assets/src/lib/creature-assets/animation/actionAnimation';

@Component({
  selector: 'creature-asset',
  templateUrl: './creature.component.html',
  styleUrls: ['./creature.component.scss']
})
export class CreatureAssetComponent implements GameComponents{
  @Input() public creatureAsset: CreatureAsset;
  @Input() public gridCreatures: Array<CreatureAsset>;
  @Input() public grid: { [cell: string]: any };
  @Input() public engine: Engine
  @Input() public creaturesAreSelected = false

  public actionAnimation: ActionAnimation
  public textAnimation: TextAnimation
  public sideBarOn = true
  public selectedAction: Action

  private ctrIsHeld = false
  // private listener

  // public constructor(private renderer: Renderer2) {}

  public ngOnInit(): void {
    this.creatureAsset.location.grid = this.grid
    this.creatureAsset.location.creaturesOnGrid = this.gridCreatures
    this.creatureAsset.sprite.doImageAdjustment()

    // this.listener = this.renderer.listen('document', 'keydown', this.move.bind(this) )
  }

  public ngAfterViewInit(): void {
    this.engine.assets.push(this)
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
  
    if(!this.creatureAsset.activePlayer || !this.creatureAsset.selected) { return }

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
    this.getCells(action, this.creatureAsset.location.cell.x, this.creatureAsset.location.cell.y)
  }

  public onCreatureSelect(): void {
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
    this.selectedAction = action
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
    this.getSelectedCreatures().forEach(selectedCreature => {
      const results = this.creatureAsset.executeAction(action, selectedCreature) as CreaturesEffect

      this.actionAnimation = action.performanceAnimation
      this.creatureAsset.sprite.performingAction = true
      this.actionAnimation.run(this.engine, this.creatureAsset.location.cell, this.creatureAsset.location.cell)
        .then(() => {
          this.creatureAsset.sprite.performingAction = false
          if(results) {
          this.actionAnimation = action.effectAnimation
          selectedCreature.sprite.performingAction = true
          this.actionAnimation.run(this.engine, this.creatureAsset.location.cell, selectedCreature.location.cell)
            .then(() => {
              selectedCreature.sprite.performingAction = false  
              this.textAnimation = results.animationText
              this.textAnimation.locY = selectedCreature.location.cell.posY
              results.animationText.run(this.engine, selectedCreature.location.cell)
            })
          }
        })       
        
      MasterLog.log("\n")
    });

    this.creatureAsset.attributes.actions.forEach(a => a.selected = false)
  }

  public getCells(action: Action, x: number, y: number) {
 
    action.areaOfEffect[`x${x}:y${y}`] = this.grid[`x${x}:y${y}`]
    this.mapCells(action.range, x, y, action.areaOfEffect, true)
  }

  public mapCells(distance: number, x: number, y: number, selectedCells: {[key: string]: RelativePositionCell}, odd: boolean) {
    if(distance < 0) { return }
 
    for(let i = 0; i <= distance; i++) {
      selectedCells[`x${x - i}:y${y}`] = this.grid[`x${x - i}:y${y}`]
      selectedCells[`x${x}:y${y - i}`] = this.grid[`x${x}:y${y - i}`]
      selectedCells[`x${x}:y${y + i}`] = this.grid[`x${x}:y${y + i}`]
      selectedCells[`x${x + i}:y${y}`] = this.grid[`x${x + i}:y${y}`] 
    }

    const newDistance = odd ? distance - 1 : distance - 2
    this.mapCells(newDistance, x - 1, y - 1, selectedCells, !odd) 
    this.mapCells(newDistance, x + 1, y + 1, selectedCells, !odd) 
    this.mapCells(newDistance, x - 1, y + 1, selectedCells, !odd) 
    this.mapCells(newDistance, x + 1, y - 1, selectedCells, !odd) 
  }
}
