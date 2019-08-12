// tslint:disable: radix
import { Component, ViewChild } from '@angular/core'
import { MasterLog } from "@hive-force/log"
import { Dice } from "@hive-force/dice"
import { CreatureAsset, Action, Monk, Sprite } from '@hive-force/assets';
import { CreaturesList } from './creatures';
import { Engine } from './engine';

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

  public ngOnInit(): void {
    const engine = new Engine()
    this.players.push(this.createCreature("Jahml"));

    this.players[this.playerIndex].activePlayer = true

    this.numberOfPlayers = this.players.length
    this.creaturesClass.creatures.forEach(a => this.players.push(a) )
    this.creatures = this.creaturesClass.creatures
    engine.assets = this.players
    engine.run()

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
    this.id++
    this.creatures.push(this.createCreature("Steve" + this.id));
  }

  public createCreature(name?: string): CreatureAsset {
    const creature = new Monk(10, name, "Way of the Open Hand")
    creature.frame = 5
    const sprite = new Sprite()
    sprite.imgSource = "../assets/motw.png"
    sprite.imageAdjustment["down"] = { order: [0,1,2,1], sprite: [{x: 0, y: -9}, {x: -52, y: -9 }, {x: -104, y: -9 }] }
    sprite.imageAdjustment["left"] = { order: [0,1,2,1], sprite: [{x: 0, y: -80}, {x: -52, y: -80 }, {x: -104, y: -80 }] }
    sprite.imageAdjustment["up"] = { order: [0,1,2,1], sprite: [{x: 0, y: -220}, {x: -52, y: -220 }, {x: -104, y: -220 }] }
    sprite.imageAdjustment["right"] = { order: [0,1,2,1], sprite: [{x: 0, y: -150}, {x: -52, y: -150 }, {x: -104, y: -150 }] }
    creature.sprite = sprite
    return creature;
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
    player.attributes.actions.forEach(a => a.disabled = false)

    const newPlayer = this.getNextPlayer()
    newPlayer.activePlayer = true
  }

  public selectAction(activePlayer: CreatureAsset, action: Action): void {
    activePlayer.attributes.actions.forEach(a => a.selected = false)
    action.selected = true
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
