import { AfterViewChecked, Directive, ElementRef, HostListener } from "@angular/core"

@Directive({
  selector: "[canvasCenter]",
})
export class CanvasCenterDirective {
  constructor(private elementRef: ElementRef) { }

  @HostListener("window:resize")
  public onWindowChange(): void {
    const gridElement: HTMLElement = this.elementRef.nativeElement.children[0]
    const overlayElement: HTMLElement = this.elementRef.nativeElement

    if(!gridElement || !overlayElement) { return }
    
    overlayElement.style.overflowY = "scroll"
    const horizontalCenterPoint = (overlayElement.clientWidth - gridElement.clientWidth) / 2
    const scrollBarWidth = (document.body.clientWidth - overlayElement.clientWidth) / 2

    if(horizontalCenterPoint + scrollBarWidth < 0) {
      gridElement.style.left = "0px"
    } else {
      gridElement.style.left = `${(horizontalCenterPoint + scrollBarWidth)}px`
    }
  }
}
