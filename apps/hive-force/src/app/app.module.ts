import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { CreatureAssetComponent } from './creature.component';
import { GridComponent } from './grid/grid.component';
import { SquareComponent } from './grid/square/square.component';
import { RowModule } from './grid/row/row.module';
import { SquareModule } from './grid/square/square.module';

@NgModule({
  declarations: [
    CreatureAssetComponent,
    AppComponent,
    GridComponent,
  ],
  imports: [
    BrowserModule,
    SquareModule,
    RowModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
