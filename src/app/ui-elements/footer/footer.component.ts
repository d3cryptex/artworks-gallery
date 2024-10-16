import { Component } from '@angular/core';
import { PaintingService } from '../../data/services/painting.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  isTheme: boolean = false;
  private themeSub!: Subscription;

  constructor (private paintingService: PaintingService) {
    this.isTheme = this.paintingService.isDark();

    this.themeSub = this.paintingService.getThemeChanges().subscribe(isDark => {
      this.isTheme = isDark;
    });
  }

  openTelegram() {
    window.open('https://t.me/py6275', '_blank');
  }
}
