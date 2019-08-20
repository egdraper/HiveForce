import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { CreatureAssetComponent } from './creature.component';
import { GridComponent } from './grid/grid.component';
import { CreateCreatureComponent } from './home/create-creature/create-creature.component';

@NgModule({
  declarations: [
    CreatureAssetComponent,
    AppComponent,
    GridComponent,
    CreateCreatureComponent,
  ],
  imports: [
    BrowserModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
