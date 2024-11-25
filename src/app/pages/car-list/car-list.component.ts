import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { CarService } from '../../services/car.service';

@Component({
  selector: 'app-car-list',
  standalone: true,
  templateUrl: './car-list.component.html',
  styleUrls: ['./car-list.component.scss'],
  imports: [
    ReactiveFormsModule, 
    CommonModule, 
    MatIconModule, 
    MatCardModule
  ],
})
export class CarListComponent implements OnInit {
  cars: any[] = [];

  constructor(private carService: CarService, private router: Router) { }

  ngOnInit(): void {
    this.loadCars();
  }

  loadCars(): void {
    this.carService.getAll().subscribe((data) => {
      this.cars = data;
    });
  }

  navigateToAddCar(): void {
    this.router.navigate(['/cars/add']);
  }

  editCar(carId: string): void {
    this.router.navigate([`/cars/edit/${carId}`]);
  }

  deleteCar(carId: string): void {
    if (confirm('Tem certeza que deseja excluir este carro?')) {
      this.carService.delete(carId).subscribe(() => {
        this.loadCars();
      });
    }
  }
}
