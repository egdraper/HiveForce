import { Injectable } from '@angular/core';
import { CreatureAsset, Action } from '../creature-assets';
import { Subject } from 'rxjs';

@Injectable()
export class CreatureAssetService {
  public activeCreatureAssets: CreatureAsset[]  = [];
  public $playerChange: Subject<CreatureAsset> = new Subject<CreatureAsset>()
  public dm = false
 
  private playerIndex = 0

  public findByName(name: string): CreatureAsset {
    return this.activeCreatureAssets.find(creature => creature.name === name);
  }

  public findByLocation(cellId: string): CreatureAsset {
    return this.activeCreatureAssets.find(creature => creature.location.cell.id === cellId);
  }

  public getAllSelectedCreatures(): CreatureAsset[] {
    return this.activeCreatureAssets.filter(creature => creature.selected)
  } 

  public getActivePlayer(): CreatureAsset {
    return this.activeCreatureAssets.find(creature => creature.activePlayer)
  }

  public deselectAllCreatures(): void {
    return this.activeCreatureAssets.forEach(creature => creature.selected = false)
  }
  
  public async getNextPlayer(): Promise<CreatureAsset> {
    if(this.dm) {
      (this.playerIndex === this.activeCreatureAssets.length - 1) ? this.playerIndex = 0 : this.playerIndex++
      return this.activeCreatureAssets[this.playerIndex]
    }

    let nextPlayer
    while(!nextPlayer) {
      (this.playerIndex === this.activeCreatureAssets.length - 1) ? this.playerIndex = 0 : this.playerIndex++
      const nextCreature = this.activeCreatureAssets[this.playerIndex]
      if(!nextCreature.nonPlayableCharacter) {
        nextPlayer = nextCreature
        break
      }
    }

    this.$playerChange.next(nextPlayer)
    return nextPlayer
  }
    
  public executeAction(player: CreatureAsset, action: Action): void { 
    this.getAllSelectedCreatures().forEach(selectedCreature => {
      player.executeAction(action, selectedCreature)
    });
  }
}
