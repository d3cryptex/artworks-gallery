import { Component, HostListener, ViewChild, ElementRef } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PaintingCardComponent } from './ui-elements/painting-card/painting-card.component';
import { PaintingService } from './data/services/painting.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, PaintingCardComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  @ViewChild('cursor') cursor!: ElementRef<HTMLDivElement>;
  @ViewChild('greyDot') greyDot!: ElementRef<HTMLDivElement>;

  private targetX = 0;
  private targetY = 0;
  private currentX = 0;
  private currentY = 0;
  private animationFrame: any;

  ngAfterViewInit() {
    this.animateCursor();
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    this.targetX = event.clientX;
    this.targetY = event.clientY;

    if (this.greyDot) {
      this.greyDot.nativeElement.style.left = `${event.clientX}px`;
      this.greyDot.nativeElement.style.top = `${event.clientY}px`;
    }
  }


  private animateCursor() {
    const lerp = (start: number, end: number, factor: number) => {
      return start + (end - start) * factor;
    };

    this.currentX = lerp(this.currentX, this.targetX, 0.1); 
    this.currentY = lerp(this.currentY, this.targetY, 0.1);

    if (this.cursor) {
      this.cursor.nativeElement.style.left = `${this.currentX}px`;
      this.cursor.nativeElement.style.top = `${this.currentY}px`;
    }

    this.animationFrame = requestAnimationFrame(() => this.animateCursor());
  }

  @HostListener('mouseover', ['$event'])
  onMouseOver(event: MouseEvent) {
    const targetElement = event.target as HTMLElement;
    if (targetElement.tagName === 'A' || targetElement.tagName === 'BUTTON' || targetElement.tagName === 'IMG') {
      this.cursor.nativeElement.classList.add('is-hovering');
    }
  }

  @HostListener('mouseout', ['$event'])
  onMouseOut(event: MouseEvent) {
    const targetElement = event.target as HTMLElement;
    if (targetElement.tagName === 'A' || targetElement.tagName === 'BUTTON' || targetElement.tagName === 'IMG') {
      this.cursor.nativeElement.classList.remove('is-hovering');
    }
  }
}

