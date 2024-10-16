import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PaintingService } from '../../../app/data/services/painting.service';
import { IArtwork, IForm } from '../../../app/data/interfaces/painting';
import { FooterComponent } from '../../ui-elements/footer/footer.component';

@Component({
  selector: 'app-edit-painting',
  standalone: true,
  imports: [FormsModule, CommonModule, FooterComponent],
  templateUrl: './edit-painting.component.html',
  styleUrl: './edit-painting.component.css'
})
export class EditPaintingComponent {
  public artwork: IArtwork = {
    id: '',
    title: '',
    author: '',
    year: new Date().getFullYear(),
    description: '',
    category: [],
    imageUrl: '',
    isFavorite: false
  };

  isDarkTheme: boolean = false;
  selectedImageName: string | null = null;
  selectedCategories: string[] = [];

  constructor(private paintingService: PaintingService, private router: Router) {
    const artwork = this.paintingService.getCurrentArtwork();
    if (artwork) {
      this.artwork = artwork; 
      this.selectedCategories = artwork.category;
    }
    this.isDarkTheme = this.paintingService.isDark();
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

  goBack() {
    this.clearForm();
    this.router.navigate(['/']);
  }

  toggleCategory(category: { name: string }) {
    const index = this.selectedCategories.indexOf(category.name);
    if (index > -1) {
      this.selectedCategories.splice(index, 1);
    } else {
      this.selectedCategories.push(category.name);
    }
    this.artwork.category = this.selectedCategories;
  }

  isCategorySelected(category: { name: string }): boolean {
    return this.selectedCategories.includes(category.name);
  }

  getColor(cat: string): string {
    const category = this.categories.find(c => c.name === cat);
    return category ? category.color : 'black';
  }

  onImageSelected(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      const file = fileInput.files[0];
      this.selectedImageName = file.name; 

      const reader = new FileReader();
      reader.onload = () => {
        this.artwork.imageUrl = reader.result as string; 
      };
      reader.readAsDataURL(file);
    }
  }

  goToAddPainting() {
    this.router.navigate(['add-painting']);
  }

  toggleTheme() {
    const circle = document.body.querySelector('body::before') as HTMLElement;
    
    const nextThemeColor = this.isDarkTheme ? '#fff' : '#1e1e1e'; 

    document.documentElement.style.setProperty('--circle-color', nextThemeColor);
    
    document.body.classList.add('animating');

    setTimeout(() => {
      this.isDarkTheme = !this.isDarkTheme;

      if (this.isDarkTheme) {
        document.body.classList.remove('light-theme');
        document.body.classList.add('dark-theme');
      } else {
        document.body.classList.remove('dark-theme');
        document.body.classList.add('light-theme');
      }

      this.paintingService.toggleTheme();

      setTimeout(() => {
        document.body.classList.remove('animating');
      }, 800);
    }, 400); 
  }

  async onSubmit() {
    this.artwork.category = this.selectedCategories; 
    this.paintingService.updateItem(this.artwork);
    console.log('Artwork edited:', this.artwork);
    this.clearForm();
    this.router.navigate(['/']);
  }

  clearForm() {
    this.artwork = {
        id: '',
        title: '',
        author: '',
        year: new Date().getFullYear(),
        description: '',
        category: [],
        imageUrl: '',
        isFavorite: false
    };
    this.selectedCategories = [];
  }
}
