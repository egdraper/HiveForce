import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreatureAssetService } from './creature-asset.service';
import { CreatureAssetComponent } from './creature-asset.component';

@NgModule({
  declarations: [
    CreatureAssetComponent,
  ],
  exports: [
    CreatureAssetComponent,
  ],
  imports: [
    CommonModule,
  ],
  providers: [
    CreatureAssetService,
  ]
})
export class CreatureAssetModule {}