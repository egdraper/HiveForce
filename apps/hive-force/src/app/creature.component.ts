// tslint:disable: radix
import { Component, Input, HostListener} from '@angular/core';
import { CreatureAsset, Action, GameComponents, Engine, SlashAnimation } from '@hive-force/assets';
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
  public sideBarOn = true

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
    event.stopPropagation()
    this.creatureAsset.attributes.actions.forEach(a => a.selected = false)
    action.selected = true
  }

  public getSelectedCreatures(): Array<CreatureAsset> {
    return this.gridCreatures.filter(c => c.selected) || []
  }

  public executeAction(action: Action): void { 
    this.getSelectedCreatures().forEach(selectedCreature => {
      debugger
      const results = this.creatureAsset.executeAction(action, selectedCreature)
      
      this.actionAnimation = action.performanceAnimation
      this.actionAnimation.run(this.engine, this.creatureAsset.location.cell, selectedCreature.location.cell)
          MasterLog.log("\n")
    });

    this.creatureAsset.attributes.actions.forEach(a => a.selected = false)
  }
}
