import { Component, EventEmitter, Output, Input } from "@angular/core";

@Component({
    selector: "app-row",
    templateUrl: "row.component.html",
    styleUrls: ["row.component.scss"]
})
export class RowComponent {
    @Output() public cellClick = new EventEmitter();
    @Input() public squares: any[] = []

    constructor() {
  
    }
}
