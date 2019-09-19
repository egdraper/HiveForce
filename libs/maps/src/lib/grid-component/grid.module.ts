import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GridComponent } from './grid.component';
import { GridService } from './grid.service';
import { AssetModule, CreatureAssetModule } from '@hive-force/assets';
import { ActionAnimationModule } from '@hive-force/animations';

@NgModule({
  declarations: [
    GridComponent,
  ],
  exports: [
    GridComponent,
  ],
  imports: [
    AssetModule,
    CreatureAssetModule,
    ActionAnimationModule,
    CommonModule,
  ],
  providers: [
    GridService,
  ]
})
export class GridModule {}