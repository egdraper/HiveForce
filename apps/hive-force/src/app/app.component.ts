// tslint:disable: radix
import { Component, ViewChild, OnInit, ChangeDetectorRef, ViewChildren} from '@angular/core'
import { MasterLog } from "@hive-force/log"
import { Dice } from "@hive-force/dice"
import { CreatureAsset, Action, Monk, MoveAction, AssetService, CreatureAssetService} from '@hive-force/assets';
import { CreaturesList } from './creatures';
import { SpriteDB } from "./db/sprite.db"
import { mapAssets } from "./db/map-asset.db"
import { GridService, GridComponent } from '@hive-force/maps';
import { Engine, Sprite, ActionAnimationService, TextAnimationService } from '@hive-force/animations';

// firebase
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'hive-force-root',
  templateUrl: './app.component.html',  
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  @ViewChild(GridComponent, { static: false }) gridComponent: GridComponent

  public dm = false
  public message = ""
  public title = 'hive-force';
  public totalRollAmount = 0;
  public id = 0
  public creaturesClass = new CreaturesList()
  public players: CreatureAsset[] = []
  
  private map: GridService
  
  public constructor(
    private firestore: AngularFirestore,
    private changeDetectorRef: ChangeDetectorRef,
    private animationService: ActionAnimationService,
    private creatureAssetService: CreatureAssetService,
    private assetService: AssetService,
  ) {
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
      this.map = new GridService()
      this.map.setGridDetails((item[0].payload.doc.data() as any).displayGrid)
      this.gridComponent.loadMap(this.map)
      this.loadCreatures()
      this.gridComponent.placeCreatures(this.players)

      this.changeDetectorRef.detectChanges()
      window.dispatchEvent(new Event("resize"))
    })
  }

  public onGenerateMap(): void {
    this.map = this.loadMap()
    this.loadCreatures()
   
    this.gridComponent.loadMap(this.map)    
    this.gridComponent.placeCreatures(this.players)
    
    // TODO: Make this selectable rather than default
    this.creatureAssetService.findByName("Jahml").activePlayer = true
    
    // TODO: Put this in a function
    this.changeDetectorRef.detectChanges()
    window.dispatchEvent(new Event("resize"))

    // mapAssets.forEach(asset => {
    //   this.assetService.mapAssets[asset.key] = asset
    // })
  }

  public loadMap(): GridService {
    const map = new GridService()
    map.createGrid(20, 15)
    return map
  }

  public loadCreatures(): void {
    this.createCreature("Jahml");

    this.creaturesClass.creatures.forEach(a => this.players.push(a))
    this.players.forEach(p => this.animationService.engine.assets.push(p))
    this.animationService.engine.run()

    MasterLog.subscribe((m) => {
      // this.message = m
      // setTimeout(()=> {
      //   this.TextBox.nativeElement.scrollTop = this.TextBox.nativeElement.scrollHeight + 10;
      // })
    })
  }
   
  public createCreature(name?: string): void {
    const deathSprite = new Sprite(new SpriteDB().get("deathCrossRed"))
    
    // Player 1
    const sprite = new Sprite(new SpriteDB().get("blondHuman"))
    const creature = new Monk(10, name, "Way of the Open Hand")    
    sprite.imgSource = "../assets/motw.png"
    creature.sprite["alive"] = sprite
    creature.sprite["death"] = deathSprite   
    creature.activeSprite = creature.sprite["alive"]    
    creature.attributes.actions.forEach(a => a.setupAction(creature ,this.animationService))
    creature.frame = 5
    this.players.push(creature)
   
    // Player 2
    const sprite2 = new Sprite(new SpriteDB().get("superHuman"))
    const creature2 = new Monk(5, name + "1", "Way of the Open Hand")
    creature2.sprite["alive"] = sprite2
    creature2.sprite["death"] = deathSprite 
    creature2.activeSprite = creature2.sprite["alive"]
    creature2.attributes.actions.forEach(a => a.setupAction(creature2 ,this.animationService))
    creature2.frame = 6
    this.players.push(creature2);
  }
  
  public onSubActionSelect(subAction: Action): void {
    
  }

  public async endTurn(): Promise<void> {
    const player = this.creatureAssetService.getActivePlayer()
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

    const newPlayer = await this.creatureAssetService.getNextPlayer()  
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
    this.creatureAssetService.getAllSelectedCreatures().forEach(creature => {
      if(creature.selected) {
        action.execute(activePlayer, creature)
      }
    })
  }

  public async autoAttack(creature: CreatureAsset): Promise<void> {
    const localPlayers = this.players.filter(player => !player.nonPlayableCharacter)
    creature.activePlayer = true

    localPlayers[0].selected = true
    await creature.autoMove(localPlayers[0].location.cell)
   
    // this.creatureComponent.executeAction(creature.attributes.actions.find(a => a.name === "Attack"))
    creature.activePlayer = false
  }
}
