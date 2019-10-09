import { NgModule } from '@angular/core';
import { Engine } from './../engine';
import { ActionAnimationService } from './action-animation.service';
import { ActionAnimationComponent } from './action-animation.component';
import { CommonModule, KeyValuePipe } from '@angular/common';
import { TextAnimationComponent } from './text-animation/text-animation.component';
import { TextAnimationService } from './text-animation/text-animation.service';
import { AssetAnimationComponent } from './asset-animation/asset-animation.component';
import { AssetAnimationService } from './asset-animation/asset-animation.service';

@NgModule({
  declarations: [
    ActionAnimationComponent,
    TextAnimationComponent,
    AssetAnimationComponent,
  ],
  exports: [
    ActionAnimationComponent,
    TextAnimationComponent,
    AssetAnimationComponent,
  ],
  imports: [
    CommonModule,
  ],
  providers: [
    ActionAnimationService,
    TextAnimationService,
    AssetAnimationService,
    Engine
  ]
})
export class ActionAnimationModule {}
