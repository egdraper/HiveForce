import { NgModule } from '@angular/core';
import { Engine } from './../engine';
import { ActionAnimationService } from './action-animation.service';
import { ActionAnimationComponent } from './action-animation.component';
import { CommonModule, KeyValuePipe } from '@angular/common';
import { TextAnimationComponent } from './text-animation/text-animation.component';
import { TextAnimationService } from './text-animation/text-animation.service';

@NgModule({
  declarations: [
    ActionAnimationComponent,
    TextAnimationComponent,
  ],
  exports: [
    ActionAnimationComponent,
    TextAnimationComponent
  ],
  imports: [
    CommonModule,
  ],
  providers: [
    ActionAnimationService,
    TextAnimationService,
    Engine
  ]
})
export class ActionAnimationModule {}
