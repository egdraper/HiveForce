import { NgModule } from '@angular/core';
import { Engine } from './engine';
import { ActionAnimationService } from './animation.service';
import { ActionAnimationComponent } from './animation.component';
import { CommonModule, KeyValuePipe } from '@angular/common';

@NgModule({
  declarations: [
    ActionAnimationComponent,
  ],
  exports: [
    ActionAnimationComponent,
  ],
  imports: [
    CommonModule,
  ],
  providers: [
    ActionAnimationService,
    Engine
  ]
})
export class AnimationModule {}
