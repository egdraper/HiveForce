// tslint:disable: radix
import { Component } from '@angular/core';
import { stringify } from '@angular/compiler/src/util';

import { Character, Attack, AttackAction, HealAction, Dice } from '@hive-force/user';
import { compileBaseDefFromMetadata } from '@angular/compiler';
import { Action } from 'rxjs/internal/scheduler/Action';

@Component({
  selector: 'hive-force-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public title = 'hive-force';
  public totalRollAmount = 0;
  public playerInfo: Character
  public characters: Array<Character> = [];
  public id = 0;
  public selectedCharacters: Array<Character>;
  public message = '';

  public ngOnInit(): void {
    this.playerInfo = this.createCharacter()
    this.playerInfo.actions.push(new AttackAction)
    this.playerInfo.actions.push(new HealAction)
  }

  public onClick(): void {
    const dice = new Dice();
    this.totalRollAmount = dice.roll('2d8+3 3d4 4d8+10').modifiedRollValue;
  }

  public addCharacter(): void {
    this.characters.push(this.createCharacter())
  }

  public createCharacter(): Character {
    this.id++;
    const character = new Character();
    character.proficiencyBonus = 2;
    character.actions = [];
    character.actionsRemaining = 2;
    character.armorClas = 17;
    character.attack = new Attack();
    character.actions = []
    character.bonusActions = []
    character.bonusActionsRemaining = 1;
    character.bonusHp = 0;
    character.challengeLevel = 0;
    character.charisma = 15;
    character.charismaModifier = 2;
    character.constitution = 12;
    character.constitutionModifier = 1;
    character.currentHitPoints = 35;
    character.damage = 0;
    character.dexterity = 17;
    character.dexterityModifier = 3;
    character.experience = 1000;
    character.height = 6;
    character.hostile = false;
    character.id = '123456-' + this.id;
    character.immunities = [];
    character.intelligence = 15;
    character.intelligenceModifier = 2;
    character.maxActions = 1;
    character.maxBonusActions = 2;
    character.maxHitPoints = 35;
    character.name = 'Steve' + this.id;
    character.race = 'Elf';
    character.senses = [];
    character.skills = [];
    character.selected = false;
    character.speed = 45;
    character.strength = 12;
    character.strengthModifier = 2;
    character.weight = 200;
    character.wisdom = 16;
    character.wisdomModifier = 3;
    return character
  }

  public performAction(actionName: string): void {
    const action = this.playerInfo.actions.find(a => a.name === actionName)
    action.execute(this.characters, this.characters[0])
  }

  public selectCharacter(character: Character): void {
    character.selected = !character.selected;
  }
}



