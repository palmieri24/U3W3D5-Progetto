import { Component, OnInit } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { MovieService } from '../service/movie.service';
import { Movie } from '../models/movie';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss'],
})
export class HomepageComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
