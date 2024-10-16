export interface IArtwork {
    id: string;
    title: string;
    author: string;
    year: number;
    description?: string;
    category: string[]; 
    imageUrl: string;
    isFavorite: boolean;
}
  
export interface IForm {
    title: string;
    description?: string;
}