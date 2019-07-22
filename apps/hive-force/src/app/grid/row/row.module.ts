// Angular Imports
import { NgModule } from "@angular/core";

// This Module's Components
import { RowComponent } from "./row.component";
// import { SquareComponent } from "app/grid/square/square.component";
import { FormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { SquareModule } from '../square/square.module';
// import { SquareModule } from "app/grid/square/square.module";

@NgModule({
    imports: [
      FormsModule,
      BrowserModule,
      SquareModule,
    ],
    declarations: [
        RowComponent,
    ],
    exports: [
        RowComponent,
    
    ]
})
export class RowModule {

}
