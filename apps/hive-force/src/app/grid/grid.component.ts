import { Component, Input, HostListener, ElementRef, ViewChildren } from "@angular/core"
import { CreatureAsset, MoveAction } from '@hive-force/assets'
import { Map, Cell } from "@hive-force/maps"
import { Engine } from '@hive-force/animations'
import { CreatureAssetComponent } from '../creature.component';

@Component({
  selector: "app-grid",
  templateUrl: "./grid.component.html",
  styleUrls: ["./grid.component.scss"]
})
export class GridComponent {  
  @Input() public engine: Engine  
  @ViewChildren(CreatureAssetComponent) public creatureComponent: Array<CreatureAssetComponent>
  
  public creatures: Array<CreatureAsset> = []
  public map: Map
  public editMode = false
  public road = false
  private index = 5
  
  constructor(private elementRef: ElementRef) { }

  public loadMap(map: Map): void {
    this.map = map
  }

  public removeCreature(creature: CreatureAsset): void {
    // TODO
  }

  public placeCreature(creature: CreatureAsset): void {
    this.addToLocation(creature)
    this.creatures.push()
  }

  public placeCreatures(creatures: Array<CreatureAsset>,) {
    if(!this.map) { throw new Error("No Map Loaded")}

    creatures.forEach(creature => {
      this.addToLocation(creature)
      this.creatures.push(creature)
      this.index++
    })
      this.index = 5
  }
  
  @HostListener("document:keydown", ["$event"]) 
  public async move(event): Promise<void> {    
    if (event.code === 'KeyE') {
       this.editMode = !this.editMode
    }

    if (event.code === 'KeyI') {
      this.creatures.forEach(creature => creature.inInitiative = !creature.inInitiative)
    }

    if (event.code === 'KeyR') {
      this.road = !this.road
    }
  }

  public cellClick(cell: Cell, event: KeyboardEvent): void {
    if(this.editMode) {
      cell.obstacle = !cell.obstacle
    }

    if(this.road) {
      cell.imgUrl = "../../../assets/roads.png"
      cell.imgIndexY = -450
      cell.imgWidth = 300
      cell.imgHeight = 600
    }
   
   // if(cell.obstacle) {
    //   cell.obstacle = false
    // } else {

    // const creatures = this.creatures.filter(c => c.selected)
 
    // creatures.forEach(creature => {
    //     creature.movement.autoMove(cell)
    // })


    //////////////////////
    const creature = this.creatures.find(c => c.activePlayer)
 
    creature.attributes.actions.forEach(a => {
      if(a.name === "Move" && a.selected) {
        const moveAction = a as MoveAction
        moveAction.starting = creature.location.cell.id
        creature.movement.autoMove(cell)
      }
    })
  }

  private addToLocation(creature: CreatureAsset): void {
      creature.location.cell = this.map.grid[`x${this.index}:y${this.index}`]
      creature.location.positionX = creature.location.cell.posX
      creature.location.positionY = creature.location.cell.posY
      creature.location.readyPositionX = creature.location.cell.posX
      creature.location.readyPositionY = creature.location.cell.posY
      creature.location.grid = this.map.grid
      creature.location.creaturesOnGrid = this.creatures
  }
} 