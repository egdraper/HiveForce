// tslint:disable: radix
import { Component, ViewChild } from '@angular/core'
import { MasterLog } from "@hive-force/log"
import { Dice } from "@hive-force/dice"
import { CreatureAsset, Action, Monk} from '@hive-force/assets';
import { CreaturesList } from './creatures';
import { SpriteDB } from "./db/sprite.db"
import { Map } from '@hive-force/maps';
import { Engine, Sprite } from '@hive-force/animations';

@Component({
  selector: 'hive-force-root',
  templateUrl: './app.component.html',  
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @ViewChild("hey", {static: false}) TextBox
  public message = ""
  public title = 'hive-force';
  public totalRollAmount = 0;
  public players: Array<CreatureAsset> = []
  public creatures: Array<CreatureAsset>
  public activePlayer: CreatureAsset
  public playerIndex = 0
  public numberOfPlayers = 0
  public id = 0
  public creaturesClass = new CreaturesList()
  public engine: Engine
  public map: Map

  public constructor() {
    this.engine = new Engine()
  }

  public ngOnInit(): void {
    this.map = new Map()
    this.map.createGrid(50, 50)

    this.createCreature("Jahml");

    this.players[this.playerIndex].activePlayer = true

    this.numberOfPlayers = this.players.length
    this.creaturesClass.creatures.forEach(a => this.players.push(a) )
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

  public endTurn(player: CreatureAsset): void {
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

    const newPlayer = this.getNextPlayer()  
    newPlayer.activePlayer = true
    newPlayer.selected = false    
    
    const defaultAction = newPlayer.attributes.actions.find(action => action.name === "Move")
    newPlayer.selectedAction = defaultAction
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

  private getNextPlayer(): CreatureAsset {
    (this.playerIndex === this.players.length - 1) ? this.playerIndex = 0 : this.playerIndex++
      
   return this.players[this.playerIndex]
  }
}
