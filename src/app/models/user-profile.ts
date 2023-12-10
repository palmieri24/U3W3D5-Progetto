import { Favourites } from './favourites';

export interface UserProfile {
  nome: String;
  cognome: String;
  email: String;
  id: Number;
  favorite: Favourites[];
}
