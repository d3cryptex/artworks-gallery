import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PaintingCardComponent } from '../../ui-elements/painting-card/painting-card.component';
import { FooterComponent } from '../../ui-elements/footer/footer.component';
import { AddPaintingPageComponent } from '../../pages/add-painting-page/add-painting-page.component';
import { PaintingService } from '../../data/services/painting.service';
import { IArtwork } from '../../data/interfaces/painting';

@Component({
  selector: 'app-search-page',
  standalone: true,
  imports: [PaintingCardComponent, FooterComponent, AddPaintingPageComponent, CommonModule, FormsModule],
  templateUrl: './search-page.component.html',
  styleUrl: './search-page.component.css'
})
export class SearchPageComponent {
  artworks: IArtwork[] = [];
  filteredArtworks: IArtwork[] = [];
  favoriteArtworks: IArtwork[] = [];
  isDarkTheme: boolean = false;
  searchText: string = ''; 
  isCategoryListVisible: boolean = false;
  selectedCategories: string[] = [];
  isLoading: boolean = true;
  currentTab: string = 'gallery';

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

  constructor(private router: Router, private paintingService: PaintingService) {
    setTimeout(() => {
      this.loadArtworks();
      this.isLoading = false; 
    }, 2000); 
    this.isDarkTheme = this.paintingService.isDark();
  }

  async loadArtworks() {
    this.artworks = await this.paintingService.getItems();
    this.filteredArtworks = [...this.artworks]; 
  }

  loadFavoriteArtworks() {
    this.favoriteArtworks = this.artworks.filter(artwork => artwork.isFavorite);
  }

  isEmpty(): boolean {
    return this.favoriteArtworks.length === 0;
  }

  trackById(index: number, item: IArtwork) {
    return item.id;
  }

  showCategoryList() {
    this.isCategoryListVisible = true;
  }

  hideCategoryList() {
    setTimeout(() => { 
      this.isCategoryListVisible = false;
    }, 200);
  }

  toggleCategorySelection(category: string) {
    if (this.selectedCategories.includes(category)) {
      this.selectedCategories = this.selectedCategories.filter(c => c !== category); 
    } else {
      this.selectedCategories.push(category); 
    }
    this.filterArtworks();
  }

  filterArtworks() {
    const search = this.searchText.toLowerCase();
    const categories = this.selectedCategories;

    this.filteredArtworks = this.artworks.filter(artwork => {
      const matchesText = artwork.title.toLowerCase().includes(search) || artwork.author.toLowerCase().includes(search);
      const matchesCategories = categories.length ? categories.some(cat => artwork.category.includes(cat)) : true;
      return matchesText && matchesCategories;
    });
  }

  goToAddPainting() {
    this.router.navigate(['add-painting']);
  }

  setTab(tab: string) {
    this.currentTab = tab;
    
    if (this.currentTab === 'favorites') {
      this.loadFavoriteArtworks(); 
    }
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
}
