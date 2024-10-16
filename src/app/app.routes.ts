import { Routes } from '@angular/router';
import { AddPaintingPageComponent } from './pages/add-painting-page/add-painting-page.component';
import { EditPaintingComponent } from './pages/edit-painting/edit-painting.component';
import { SearchPageComponent } from './pages/search-page/search-page.component';
import { AppComponent } from './app.component';

export const routes: Routes = [
    { path: '', component: SearchPageComponent },
    { path: 'add-painting', component: AddPaintingPageComponent },
    { path: 'edit-painting/:id', component: EditPaintingComponent }
];