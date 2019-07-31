// Angular Imports
import { NgModule } from "@angular/core";

// This Module's Components
import { SquareComponent } from "./square.component";

@NgModule({
    declarations: [
        SquareComponent,
    ],
    exports: [
        SquareComponent,
    ]
})
export class SquareModule {

}
