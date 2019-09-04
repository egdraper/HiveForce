// tslint:disable: radix
import { Component, ViewChild, OnInit, ChangeDetectorRef, ViewChildren} from '@angular/core'
import { MasterLog } from "@hive-force/log"
import { Dice } from "@hive-force/dice"
import { CreatureAsset, Action, Monk, MoveAction} from '@hive-force/assets';
import { CreaturesList } from './creatures';
import { SpriteDB } from "./db/sprite.db"
import { Map } from '@hive-force/maps';
import { Engine, Sprite } from '@hive-force/animations';

// firebase
import { AngularFirestore } from '@angular/fire/firestore';
import { GridComponent } from './grid/grid.component';
import { CreatureAssetComponent } from './creature.component';

@Component({
  selector: 'hive-force-root',
  templateUrl: './app.component.html',  
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  @ViewChild("hey", {static: false}) TextBox
  @ViewChild(GridComponent, { static: false }) gridComponent: GridComponent

  public dm = false
  public message = ""
  public title = 'hive-force';
  public totalRollAmount = 0;
  public players: Array<CreatureAsset>
  public creatures: Array<CreatureAsset>
  public activePlayer: CreatureAsset
  public playerIndex = 0
  public numberOfPlayers = 0
  public id = 0
  public creaturesClass = new CreaturesList()
  public engine: Engine
  public map: Map

  public constructor(
    private firestore: AngularFirestore,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    this.engine = new Engine()
  }

  public ngOnInit(): void {
 
  }

  public loadGame(): void {
    // TODO
  }

  public onSaveMap(): void {
    const gridDetailModel =  this.map.createGridDetail() 
    this.firestore.collection("maps").add(gridDetailModel)
  }

  public onLoadMap(): void {
    this.firestore.collection("maps").snapshotChanges().subscribe(item => {
      this.map = new Map()
      this.map.setGridDetails((item[0].payload.doc.data() as any).displayGrid)
      this.gridComponent.loadMap(this.map)
      this.loadCreatures()
      this.gridComponent.placeCreatures(this.players)

      this.changeDetectorRef.detectChanges()
      window.dispatchEvent(new Event("resize"))
    })
  }

  public onGenerateMap(): void {
    this.loadMap()
    this.gridComponent.loadMap(this.map)
    this.loadCreatures()
    this.gridComponent.placeCreatures(this.players)
    
    this.changeDetectorRef.detectChanges()
    window.dispatchEvent(new Event("resize"))
  }

  public loadMap(): void {
    this.map = new Map()
    this.map.createGrid(20, 15)
  }

  public loadCreatures(): void {
    this.createCreature("Jahml");
    this.players[this.playerIndex].activePlayer = true

    this.numberOfPlayers = this.players.length
    this.creaturesClass.creatures.forEach(a => this.players.push(a))
    this.creatures = this.creaturesClass.creatures
    this.players.forEach(p => this.engine.assets.push(p))
    this.engine.run()

    MasterLog.subscribe((m) => {
      this.message = m
      setTimeout(()=> {
        this.TextBox.nativeElement.scrollTop = this.TextBox.nativeElement.scrollHeight + 10;
      })
    })
  }
   

  public onClick(): void {
    const dice = new Dice();
    this.totalRollAmount = dice.roll('d20').modifiedRollValue;
  }

  public addCharacter(): void {
    // this.id++
    // this.creatures.push(this.createCreature("Steve" + this.id));
  }

  public createCreature(name?: string): void {
    this.players = []
    const creature = new Monk(10, name, "Way of the Open Hand")
    creature.frame = 5
    const sprite = new Sprite(new SpriteDB().get("blondHuman"))
    sprite.imgSource = "../assets/motw.png"
    creature.sprite = sprite
    this.players.push(creature)

    const creature2 = new Monk(5, name + "1", "Way of the Open Hand")
    creature2.frame = 6
    const sprite2 = new Sprite(new SpriteDB().get("superHuman"))
    creature2.sprite = sprite2
    this.players.push(creature2);
  }

  public onSubActionSelect(subAction: Action): void {

  }
  
  public getSelectedCreatures(): Array<CreatureAsset> {
    return this.creatures.filter(c => c.selected) || []
  }

  public executeAction(player: CreatureAsset, action: Action): void { 
    this.getSelectedCreatures().forEach(selectedCreature => {
      player.executeAction(action, selectedCreature)
      MasterLog.log("\n")
    });
  }

  public async endTurn(): Promise<void> {
    const player = this.players.find(p => p.activePlayer)
    player.activePlayer = false
    player.attributes.attacksRemaining = 2
    player.attributes.actionsPerformed = []
    player.attributes.actionsRemaining = 2
    player.attributes.actionsQueued = []
    player.attributes.actions.forEach(a => {
      a.disabled = false
      a.selected = false
    })
    player.selectedAction = null

    const newPlayer = await this.getNextPlayer()  
    newPlayer.activePlayer = true
    newPlayer.selected = false    
    
    const defaultAction = newPlayer.attributes.actions.find(action => action.name === "Move") as MoveAction
    newPlayer.selectedAction = defaultAction
    defaultAction.range = defaultAction.maxRange
    defaultAction.selected = true
    defaultAction.areaOfEffect = this.map.getAreaOfEffect(
      defaultAction.range, 
      newPlayer.location.cell.x,
      newPlayer.location.cell.y
    )
  }

  public onExecute(activePlayer: CreatureAsset): void {
    const action = activePlayer.attributes.actions.find(a => a.selected)
    this.creatures.forEach(creature => {
      if(creature.selected) {
        action.execute(activePlayer, creature)
      }
    })
  }

  private async getNextPlayer(): Promise<CreatureAsset> {
    if(this.dm) {
      (this.playerIndex === this.players.length - 1) ? this.playerIndex = 0 : this.playerIndex++
      return this.players[this.playerIndex]
    }

    let nextPlayer
    while(!nextPlayer) {
      (this.playerIndex === this.players.length - 1) ? this.playerIndex = 0 : this.playerIndex++
      const nextCreature = this.players[this.playerIndex]
      if(!nextCreature.nonPlayableCharacter) {
        nextPlayer = nextCreature
        break
      } else {
       await this.autoAttack(nextCreature) 
      }
    }

    return nextPlayer
  }

  public async autoAttack(creature: CreatureAsset): Promise<void> {
    const localPlayers = this.players.filter(player => !player.nonPlayableCharacter)
    creature.activePlayer = true

    localPlayers[0].selected = true
    await creature.movement.autoMove(localPlayers[0].location.cell)

    debugger
    // this.creatureComponent.executeAction(creature.attributes.actions.find(a => a.name === "Attack"))
    creature.activePlayer = false

    
    debugger
  }
}
