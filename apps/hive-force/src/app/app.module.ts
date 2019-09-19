import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { CreateCreatureComponent } from './home/create-creature/create-creature.component';
import { CommonModule } from '@angular/common';
import { AngularFireModule } from "@angular/fire"
import { AngularFirestoreModule } from "@angular/fire/firestore"
import { environment } from '../environments/environment';
import { CanvasCenterDirective } from './canvas-center.directive';
import { AssetModule } from '@hive-force/assets';
import { GridModule } from '@hive-force/maps';
import { ActionAnimationModule } from '@hive-force/animations';

@NgModule({
  declarations: [ 
    AppComponent,
    CreateCreatureComponent,
    CanvasCenterDirective,
  ],
  imports: [
    AngularFirestoreModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    CommonModule,
    BrowserModule,
    GridModule,
    ActionAnimationModule,
    AssetModule,    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
