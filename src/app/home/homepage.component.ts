import { Component, OnInit } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { MovieService } from '../service/movie.service';
import { Movie } from '../models/movie';
import { Favourites } from '../models/favourites';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { UserProfile } from '../models/user-profile';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss'],
})
export class HomepageComponent implements OnInit {
  topMovies!: Movie[];
  userId: number = 0;
  apiURL = environment.apiURL;
  userInfo: UserProfile | null = null;
  favorites: Favourites[] = [];
  userFavs: Movie[] = [];
  movies!: Movie[];

  constructor(
    private authSrv: AuthService,
    private movieSrv: MovieService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.authSrv.restore();

    this.movieSrv.getTopMovies().subscribe((topMovies: Movie[]) => {
      this.topMovies = topMovies;
    });
    this.authSrv.restore();
    this.userId = this.authSrv.getUserId() || 0;

    this.userInfo = this.authSrv.getUserInfo(this.userId);
    this.getUserFavs(this.userId);
  }

  getUserFavs(userId: number) {
    this.http
      .get<Favourites[]>(`${this.apiURL}favorites`)
      .subscribe((response) => {
        console.log('I tuoi film preferiti:', response);
        this.favorites = response.filter(
          (favorite) => favorite.userId === userId
        );

        this.movieSrv.getMovies().subscribe((movies) => {
          this.movies = movies.filter((movie) =>
            this.favorites.some((fav) => fav.movieId === movie.id)
          );

          this.userFavs = this.movies.map((movie) => ({
            id: movie.id,
            poster_path: movie.poster_path,
            title: movie.title,
          }));
        });
      });
  }
}
