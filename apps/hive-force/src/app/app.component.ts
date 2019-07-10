// tslint:disable: radix
import { Component, ViewChild } from '@angular/core'
import { MasterLog } from "@hive-force/log"
import { Dice } from "@hive-force/dice"
import { CreatureAsset } from '@hive-force/assets'
import { HillDwarf } from '@hive-force/race';
import { Monk } from '@hive-force/class';
import { Subject } from 'rxjs';
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
  public id = 0;

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
    this.totalRollAmount = dice.roll('2d8+3 3d4 4d8+10').modifiedRollValue;
  }

  public addCharacter(): void {
    this.creatures.push(this.createCreature());
  }

  public createCreature(name?: string): CreatureAsset {
    this.id++
    const creature = new CreatureAsset()
    creature.id = '123456-' + this.id,
    creature.level = 6;
    creature.name = name || 'Steve' + this.id,
    creature.effects = [],
    creature.inventory = []
    creature.attributes = {
      attacksRemaining: 2,
      numberOfAttacksAllowed: 2,
      hasAdvantage: false,
      hasDisadvantage: false,
      actions: [],
      actionsPerformed: [],
      actionsQueued: [],
      actionsRemaining: 2,
      armorProficiencies: [],
      armorClass: 13,
      bonusActions: [],
      bonusActionsRemaining: 3,
      bonusHp: 0,
      challengeLevel: 0,
      charisma: 15,
      charismaModifier: 2,
      constitution: 12,
      constitutionModifier: 1,
      currentHitPoints: 35,
      dexterity: 17,
      dexterityModifier: 3,
      experience: 1000,
      height: 6,
      hostile: false,
      immunities: [],
      intelligence: 15,
      intelligenceModifier: 2,
      maxActions: 1,
      maxBonusActions: 2,
      maxHitPoints: 35,
      proficiencyBonus: 2,
      senses: [],
      size: "medium",
      skills: [],
      skillProficiencies: [],
      speed: 45,
      strength: 12,
      strengthModifier: 2,
      weight: 200,
      weaponProficiencies: [],
      wisdom: 16,
      wisdomModifier: 3,
      vision: 0,
    }  
    
    creature.inventory = []
    creature.attributes.actionsPerformed = []
    const hillDwarf = new HillDwarf(creature.attributes)
    const monk = new Monk(creature)
    monk.createClass(6)
    hillDwarf.buildCharacter()
    
    creature.class = monk
    creature.race = hillDwarf
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
