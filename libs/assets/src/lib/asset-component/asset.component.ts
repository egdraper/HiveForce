import { Component, ChangeDetectorRef } from '@angular/core';
import { AssetService } from './asset.service';

@Component({
  selector: 'hive-force-asset',
  styleUrls: ['./asset.component.scss'],
  templateUrl: './asset.component.html'
})
export class AssetComponent {
    constructor(
      public assetService: AssetService ) { 
  }
}
