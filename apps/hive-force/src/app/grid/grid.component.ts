import { Component, Input, HostListener } from "@angular/core"
import { CreatureAsset } from '@hive-force/assets'
import { Map, Cell } from "@hive-force/maps"
import { Engine } from '@hive-force/animations'

@Component({
  selector: "app-grid",
  templateUrl: "./grid.component.html",
  styleUrls: ["./grid.component.scss"]
})
export class GridComponent {
  @Input() public creatures: Array<CreatureAsset>
  @Input() public engine: Engine
  @Input() public map: Map


  public editMode = false
  
  private index = 5
  
  public ngOnInit(): void {
    this.creatures.forEach(a => {
      a.location.cell = this.map.grid[`x${this.index}:y${this.index}`]
      a.location.positionX = a.location.cell.posX
      a.location.positionY = a.location.cell.posY
      a.location.readyPositionX = a.location.cell.posX
      a.location.readyPositionY = a.location.cell.posY
      a.location.grid = this.map.grid
      a.location.creaturesOnGrid = this.creatures
      this.index++
    })
      this.index = 5
  }

  
  @HostListener("document:keydown", ["$event"]) 
  public async move(event): Promise<void> {    
    if (event.code === 'KeyE') {
       this.editMode = !this.editMode
    }
  }


  public cellClick(cell: Cell, event: KeyboardEvent): void {
    if(this.editMode) {
      cell.obstacle = !cell.obstacle
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
        creature.movement.autoMove(cell)
      }
    })
  }
} 