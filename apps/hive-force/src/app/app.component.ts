// tslint:disable: radix
import { Component, ViewChild } from '@angular/core'
import { MasterLog } from "@hive-force/log"
import { Dice } from "@hive-force/dice"
import { CreatureAsset } from '@hive-force/assets'
import { Monk } from '@hive-force/class';
import { Action } from '@hive-force/actions';

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
  public creatures: Array<CreatureAsset> = [];
  public activePlayer: CreatureAsset
  public playerIndex = 0
  public numberOfPlayers = 0
  public id = 0

  public ngOnInit(): void {
    this.players.push(this.createCreature("Jahml"));
    this.players.push(this.createCreature("Quantis"));
    this.players.push(this.createCreature("Tavios"));
    this.players.push(this.createCreature("Argus"));
    this.activePlayer = this.players[this.playerIndex]
    this.numberOfPlayers = this.players.length
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
    const creature = new Monk(6, name)
    return creature;
  }
  
  public selectCharacter(character: CreatureAsset): void {
    character.selected = !character.selected;
  }
  
  public getSelectedCreatures(): Array<CreatureAsset> {
    return this.creatures.filter(c => c.selected) || []
  }

  public executeAction(player: CreatureAsset, action: Action): void { 
    this.getSelectedCreatures().forEach(selectedCreature => {
      action.execute(player, selectedCreature)
    });
  }

  public endTurn(player: CreatureAsset): void {
    player.attributes.attacksRemaining = 2
    player.attributes.actionsPerformed = []
    player.attributes.actionsRemaining = 2
    player.attributes.actionsQueued = []
    player.attributes.actions.forEach(a => a.disabled = false)

    this.activePlayer = this.getNextPlayer()
  }

  private getNextPlayer(): CreatureAsset {
    (this.playerIndex === this.players.length - 1) ? this.playerIndex = 0 : this.playerIndex++
      
   return this.players[this.playerIndex]
  }
}
