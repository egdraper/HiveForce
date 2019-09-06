import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AnimationModule } from '@hive-force/animations';

import { AppComponent } from './app.component';
import { CreatureAssetComponent } from './creature.component';
import { GridComponent } from './grid/grid.component';
import { CreateCreatureComponent } from './home/create-creature/create-creature.component';
import { CommonModule } from '@angular/common';
import { AngularFireModule } from "@angular/fire"
import { AngularFirestoreModule } from "@angular/fire/firestore"
import { environment } from '../environments/environment';
import { CanvasCenterDirective } from './canvas-center.directive';

@NgModule({
  declarations: [ 
    CreatureAssetComponent,
    AppComponent,
    GridComponent,
    CreateCreatureComponent,
    CanvasCenterDirective,
  ],
  imports: [
    AngularFirestoreModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    CommonModule,
    BrowserModule,
    AnimationModule,    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
