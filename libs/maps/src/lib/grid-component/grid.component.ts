import { Component, Input, HostListener, ElementRef, ViewChildren } from "@angular/core"
import { CreatureAsset, MoveAction, CreatureAssetComponent, CreatureAssetService } from '@hive-force/assets'
import { Cell } from "@hive-force/spells"
import { GridService } from "./grid.service"
import { remove } from "lodash"
import { templateJitUrl } from '@angular/compiler';

@Component({
  selector: "hive-force-grid",
  templateUrl: "./grid.component.html",
  styleUrls: ["./grid.component.scss"]
})
export class GridComponent {  
  @ViewChildren(CreatureAssetComponent) public creatureComponent: Array<CreatureAssetComponent>
  
  public areaOfEffect: {[id: string]: Cell }
  public map: GridService
  public editMode = false
  public road = false
  public tiles = []
  public delete = false
  private index = 5

  constructor(public creatureService: CreatureAssetService) {
    this.creatureService.$playerChange.subscribe(newCreature => {
      this.areaOfEffect = newCreature.attributes.selectedAction.areaOfEffect
    })

   }

  public loadMap(map: GridService): void {
    this.map = map
  }

  public placeCreature(creature: CreatureAsset): void {
    this.addToLocation(creature)
    this.creatureService.activeCreatureAssets.push(creature)
  }

  public placeCreatures(creatures: Array<CreatureAsset>,) {
    if(!this.map) { throw new Error("No Map Loaded")}

    creatures.forEach(creature => {
      this.addToLocation(creature)
      this.creatureService.activeCreatureAssets.push(creature)
      this.index++
    })
      this.index = 5
  }

  public onAreaOfEffectChanged(value: any): void {
    if(value === null ) {
      this.areaOfEffect = {}
      return
    }

    this.areaOfEffect = this.map.getAreaOfEffect(
      value.range,
      value.cellX,
      value.cellY, 
    )
  } 
  
  @HostListener("document:keydown", ["$event"]) 
  public async move(event): Promise<void> {    
    if (event.code === 'KeyE') {
       this.editMode = !this.editMode
    }

    if (event.code === 'KeyI') {
      this.creatureService.activeCreatureAssets.forEach(creature => creature.inInitiative = !creature.inInitiative)
    }

    if (event.code === 'KeyR') {
      this.road = !this.road
    }

    if(event.code === "KeyZ") {
      this.delete = !this.delete
    }
  }

  public addLayer(tile: any): void {
    if(this.delete) {
      remove(this.tiles, tile)
      if(tile.level === 1 && this.map.grid[tile.cellOwnerId]) {
        this.map.grid[tile.cellOwnerId].obstacle = false
      }
    } else if(this.editMode) {
      this.tiles.push({
        containerHeight: 80,
        containerWidth: 50,
        url: "../../assets/SPIKE-WALL-ALL2.png",
        locX: tile.locX,
        locY: tile.locY - 30,
        imgXOffset: (Math.floor(Math.random() * 3)) * -50,
        imgYOffset: (Math.floor(Math.random() * 3)) * -80,
        zIndex: tile.zIndex,
        cellOwnerId: tile.cellOwnerId,
        level: tile.level + 1,
      })
    }
  }

  public cellClick(cell: Cell, event: KeyboardEvent): void {
    if(this.editMode) {
      cell.obstacle = !cell.obstacle

      this.tiles.push({
        containerHeight: 80,
        containerWidth: 50,
        url: "../../assets/SPIKE-WALL-ALL2.png",
        locX: cell.posX,
        locY: cell.posY - 30,
        imgXOffset: (Math.floor(Math.random() * 3)) * -50,
        imgYOffset: (Math.floor(Math.random() * 3)) * -80,
        zIndex: cell.y,
        cellOwnerId: cell.id,
        level: 1,
      })
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
    const creature = this.creatureService.getActivePlayer()
 
    creature.attributes.actions.forEach(a => {
      if(a.name === "Move" && a.selected) {
        const moveAction = a as MoveAction
        moveAction.starting = creature.location.cell.id
        creature.autoMove(cell)
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
      creature.location.creaturesOnGrid = this.creatureService.activeCreatureAssets
  }
} 