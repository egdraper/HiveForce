// tslint:disable: radix
import { Component, Input, HostListener } from '@angular/core'
import { CreatureAsset } from '@hive-force/assets';

@Component({
  selector: 'creature-asset',
  templateUrl: './creature.component.html',  
  styleUrls: ['./creature.component.scss']
})
export class CreatureAssetComponent {
    @Input() creatureAsset: CreatureAsset

    @HostListener("document:keydown", ["$event"])
    public move(event): void {
        if(event.key === "ArrowUp" && this.creatureAsset.positionY > 10) {
          this.creatureAsset.readyPositionY = this.creatureAsset.positionY - 50
        }
        if(event.key === "ArrowLeft" && this.creatureAsset.positionX > 10) {
          this.creatureAsset.readyPositionX = this.creatureAsset.positionX - 50
        }
        if(event.key === "ArrowRight" && this.creatureAsset.positionX < 1000) {
          this.creatureAsset.readyPositionX = this.creatureAsset.positionX + 50
        }
        if(event.key === "ArrowDown" && this.creatureAsset.positionY < 1000) {
          this.creatureAsset.readyPositionY = this.creatureAsset.positionY + 50
        }
    }
}