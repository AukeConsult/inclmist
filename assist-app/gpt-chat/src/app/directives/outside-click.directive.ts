import { Directive, ElementRef, Output, EventEmitter, HostListener } from '@angular/core';

@Directive({
  standalone:true,
  selector: '[appOutsideClick]'
})
export class OutsideClickDirective {
  @Output() outsideClick = new EventEmitter<MouseEvent>();

  constructor(private elementRef: ElementRef) {}

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const clickedInside = this.elementRef.nativeElement.contains(event.target);
    if (!clickedInside) {
      this.outsideClick.emit(event);
    }
  }
}
