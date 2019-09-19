import { NgModule } from '@angular/core';
import { Engine } from './../engine';
import { ActionAnimationService } from './action-animation.service';
import { ActionAnimationComponent } from './action-animation.component';
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
export class ActionAnimationModule {}
