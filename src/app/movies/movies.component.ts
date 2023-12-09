import { Component, OnInit } from '@angular/core';
import { Movie } from 'src/app/models/movie';
import { MovieService } from 'src/app/service/movie.service';
import { Favourites } from '../models/favourites';
import { AuthService } from '../service/auth.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-movies',
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.scss'],
})
export class MoviesComponent implements OnInit {
  movies!: Movie[];
  userId: number = 0;
  apiURL = environment.apiURL;

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
    });
  }
}
