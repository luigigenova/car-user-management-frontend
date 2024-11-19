import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-cars',
  standalone: true,
  templateUrl: './cars.component.html',
  styleUrl: './cars.component.scss',
  imports: [RouterOutlet],
})
export class CarsComponent {

}
