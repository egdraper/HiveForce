import { Component, Input, EventEmitter, Output } from "@angular/core"

@Component({
    selector: "app-square",
    templateUrl: "square.component.html",
    styleUrls: ["square.component.scss"]
})
export class SquareComponent {
 @Input() public input: any;
 @Output() public cellClick = new EventEmitter();

 public squareClick(e: any): void {
    this.cellClick.emit({x: e.currentTarget.offsetLeft, y: e.currentTarget.offsetTop, input: this.input});
 }
}
