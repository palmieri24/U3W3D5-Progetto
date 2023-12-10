import { Component, OnInit } from '@angular/core';
import { Movie } from 'src/app/models/movie';
import { MovieService } from 'src/app/service/movie.service';
import { Favourites } from '../models/favourites';
import { AuthService } from '../service/auth.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { UserProfile } from '../models/user-profile';

@Component({
  selector: 'app-movies',
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.scss'],
})
export class MoviesComponent implements OnInit {
  movies!: Movie[];
  userId: number = 0;
  apiURL = environment.apiURL;
  favourites!: Favourites[];
  userProfile: UserProfile | null = null;

  constructor(
    private movieSrv: MovieService,
    private authSrv: AuthService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.authSrv.restore();

    this.movieSrv.getMovies().subscribe((movies: Movie[]) => {
      this.movies = movies;
      console.log(movies);
      this.userId = this.authSrv.getUserId() || 0;

      this.http
        .get<Favourites[]>(`${this.apiURL}favorites`)
        .subscribe((response) => {
          console.log('Lista preferiti:', response);
          let update: Favourites[] = response.filter(
            (movie) => movie.userId === this.userId
          );
          this.favourites = update;
        });
    });
  }

  isFavourites(movieId: number): boolean {
    return (
      Array.isArray(this.favourites) &&
      this.favourites.some((movie) => movieId === movie.movieId)
    );
  }

  addFavourites(movie: Movie): void {
    const favourites: Favourites = {
      movieId: movie.id,
      userId: this.userId,
    };

    this.http
      .post<Favourites>(`${this.apiURL}favorites`, favourites)
      .subscribe((response) => {
        console.log('Film aggiunto ai preferiti', response);
        this.myFavourites();
      });
  }

  deleteFavourites(movie: Movie): void {
    const clickedMovie: any = this.favourites.find(
      (fav) => fav.movieId === movie.id
    );

    this.http
      .delete<Favourites>(`${this.apiURL}favorites/${clickedMovie.id}`)
      .subscribe((response) => {
        console.log('Film eliminato dai preferiti', response);
        this.myFavourites();
      });
  }

  myFavourites(): void {
    this.http
      .get<Favourites[]>(`${this.apiURL}favorites`)
      .subscribe((response) => {
        console.log('I tuoi film preferiti', response);
        let clicked: Favourites[] = response.filter(
          (fav) => fav.userId === this.userId
        );
        this.favourites = clicked;
      });
  }
}
