import { Component, Input, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IArtwork } from '../../../app/data/interfaces/painting';
import { PaintingService } from '../../../app/data/services/painting.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-painting-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './painting-card.component.html',
  styleUrl: './painting-card.component.css'
})

export class PaintingCardComponent {
  @Input() artwork!: IArtwork;

  imageOrientationClass: string = '';
  isTheme: boolean = false;
  isModalOpen: boolean = false;
  selectedImage: string = '';
  private themeSub!: Subscription;
  

  constructor(private paintingService: PaintingService, private router: Router, private el: ElementRef) {
    this.isTheme = this.paintingService.isDark();

    this.themeSub = this.paintingService.getThemeChanges().subscribe(isDark => {
      this.isTheme = isDark;
    });
  }

  categories: { name: string; color: string }[] = [
    { name: 'Painting', color: '#FF5733' }, 
    { name: 'Sculpture', color: '#33FF57' }, 
    { name: 'Photography', color: '#3357FF' }, 
    { name: 'Digital Art', color: '#FF33A1' }, 
    { name: 'Drawing', color: '#FFB833' }, 
    { name: 'Mixed Media', color: '#A133FF' }, 
    { name: 'Printmaking', color: '#33FFF7' },
    { name: 'Collage', color: '#FF33C4' }, 
    { name: 'Illustration', color: '#FFC300' }, 
    { name: 'Installation Art', color: '#DAF7A6' }, 
    { name: 'Street Art', color: '#C70039' }, 
    { name: 'Performance Art', color: '#900C3F' }, 
    { name: 'Textile Art', color: '#581845' }, 
    { name: 'Ceramics', color: '#FFC0CB' },
    { name: 'Graffiti', color: '#FF5733' },
    { name: 'Conceptual Art', color: '#6B8E23' }, 
    { name: 'Land Art', color: '#228B22' }, 
    { name: 'Mosaic', color: '#D2691E' }, 
    { name: 'Glass Art', color: '#ADD8E6' },
    { name: 'Metalwork', color: '#A9A9A9' }, 
    { name: 'Woodworking', color: '#8B4513' }, 
    { name: 'Environmental Art', color: '#3CB371' } 
  ];

  openImage(imageUrl: string) {
    this.selectedImage = imageUrl;
    this.isModalOpen = true;
  }

  closeImage() {
    this.isModalOpen = false;
    this.selectedImage = '';
  }

  getColor(cat: string): string {
    const category = this.categories.find(c => c.name === cat);
    return category ? category.color : 'black';
  }

  onRemove() {
    this.paintingService.deleteItem(this.artwork.id);
    this.router.navigate(['/']);
    console.log(`Artwork with id ${this.artwork.id} has been removed.`);
  }

  onMouseMove(event: MouseEvent) {
    const card = event.currentTarget as HTMLElement;
    const rect = card.getBoundingClientRect();
    
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;
    
    const rotateX = -(y / rect.height) * 15; 
    const rotateY = (x / rect.width) * 15; 

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  }

  onMouseLeave() {
    const cards = document.querySelectorAll('.main-container') as NodeListOf<HTMLElement>;
    cards.forEach((card) => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
    });
  }

  getFavouriteIcon(isFavorite: boolean): string {
    if (this.isTheme) {
      return isFavorite ? '/assets/img/fav_white_active.png' : '/assets/img/fav_white.png';
    } else {
      return isFavorite ? '/assets/img/fav_active.png' : '/assets/img/fav.png';
    }
  }

  toggleFavourite(artwork: IArtwork) {
    artwork.isFavorite = !artwork.isFavorite; 
    this.paintingService.updateFavourite(artwork.id, artwork.isFavorite); 
  }

  editArtwork(artwork: IArtwork) {
    this.paintingService.setCurrentArtwork(artwork);
    this.router.navigate(['/edit-painting', artwork.id]);
  }
}
