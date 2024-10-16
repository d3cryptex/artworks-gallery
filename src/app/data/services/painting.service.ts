import { Injectable } from '@angular/core';
import { IArtwork } from './../../../app/data/interfaces/painting';
import initSqlJs, { Database } from 'sql.js';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class PaintingService {
  private storageKey = 'artworks'; 
  private isDarkTheme = false;
  private currentArtwork: IArtwork | null = null;
  private currentThemeChange = new Subject<boolean>();

  constructor() {
    this.initStorage();
    this.loadTheme();
  }

  loadTheme() {
    const savedTheme = localStorage.getItem('isDarkTheme');
    if (savedTheme !== null) {
      this.isDarkTheme = savedTheme === 'true';
      console.log(`Loaded theme from localStorage: ${this.isDarkTheme ? 'Dark' : 'Light'}`);
    } else {
      console.log('No theme found in localStorage, using default (light theme)');
    }
    this.updateBodyClass();
  }

  toggleTheme() {
    this.isDarkTheme = !this.isDarkTheme;
    localStorage.setItem('isDarkTheme', this.isDarkTheme.toString());
    this.updateBodyClass();
    this.currentThemeChange.next(this.isDarkTheme);
  }

  getThemeChanges() {
    return this.currentThemeChange.asObservable(); 
  }

  isDark(): boolean {
    return this.isDarkTheme;
  }

  private updateBodyClass() {
    if (this.isDarkTheme) {
      document.body.classList.add('dark-theme');
      document.body.classList.remove('light-theme');
    } else {
      document.body.classList.add('light-theme');
      document.body.classList.remove('dark-theme');
    }
  }

  initStorage() {
    const artworks = localStorage.getItem(this.storageKey);
    if (!artworks) {
      localStorage.setItem(this.storageKey, JSON.stringify([]));
    }

    console.log("Succesfully init localStorage");
  }

  getItems(): IArtwork[] {
    const artworks = localStorage.getItem(this.storageKey);
    console.log("Succesfully get", artworks);
    return artworks ? JSON.parse(artworks) : [];
  }

  setItem(artwork: IArtwork) {
    const artworks = this.getItems();
    artworks.push(artwork); 
    localStorage.setItem(this.storageKey, JSON.stringify(artworks)); 
    console.log("Succesfully set", artworks);
  }
  
  deleteItem(id: string) {
    let artworks = this.getItems();
    artworks = artworks.filter(artwork => artwork.id !== id);
    localStorage.setItem(this.storageKey, JSON.stringify(artworks)); 
    console.log("Succesfully remove", id);
  }

  updateFavourite(id: string, isFavorite: boolean) {
    const artworks = this.getItems();
    const index = artworks.findIndex(artwork => artwork.id === id);
    
    if (index !== -1) {
      artworks[index].isFavorite = isFavorite; 
      localStorage.setItem(this.storageKey, JSON.stringify(artworks)); 
    }
  }

  setCurrentArtwork(artwork: IArtwork) {
    this.currentArtwork = artwork;
  }

  getCurrentArtwork(): IArtwork | null {
    return this.currentArtwork;
  }

  updateItem(updatedArtwork: IArtwork) {
    const artworks = this.getItems();
    const index = artworks.findIndex(artwork => artwork.id === updatedArtwork.id);
    
    if (index !== -1) {
      artworks[index] = updatedArtwork;
      localStorage.setItem(this.storageKey, JSON.stringify(artworks));
      console.log("Artwork updated successfully", updatedArtwork);
    } else {
      console.log("Artwork not found for update");
    }
  }
}