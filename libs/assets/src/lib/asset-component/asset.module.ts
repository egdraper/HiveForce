import { NgModule } from '@angular/core';
import { AssetService } from './asset.service';
import { AssetComponent } from './asset.component';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    AssetComponent,
  ],
  exports: [
    AssetComponent,
  ],
  imports: [
    CommonModule,
  ],
  providers: [
    AssetService,
  ]
})
export class AssetModule {}
