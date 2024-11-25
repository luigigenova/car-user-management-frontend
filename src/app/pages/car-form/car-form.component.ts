import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { CarService } from '../../services/car.service';
import { NotificationService } from '../../core/services/notification.service';

/**
 * Component for creating and editing cars.
 */
@Component({
  selector: 'app-car-form',
  standalone: true,
  templateUrl: './car-form.component.html',
  styleUrls: ['./car-form.component.scss'],
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatCardModule,
    MatIconModule,
    HttpClientModule,
    CommonModule,
  ],
})
export class CarFormComponent implements OnInit {
  carForm!: FormGroup;

  constructor(
    private readonly fb: FormBuilder,
    private readonly carService: CarService,
    private readonly router: Router,
    private readonly notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  /**
   * Initializes the form with required fields and validations.
   */
  private initializeForm(): void {
    this.carForm = this.fb.group({
      model: ['', Validators.required],
      year: ['', [Validators.required, Validators.min(1886)]],
      licensePlate: ['', Validators.required],
      color: ['', Validators.required],
    });
  }

  /**
   * Handles the form submission for creating a car.
   */
  onSubmit(): void {
    if (this.carForm.valid) {
      const carData = this.carForm.value;

      this.carService.createCar(carData).subscribe(
        () => {
          this.notificationService.showNotification('Car created successfully.');
          this.router.navigate(['/cars']);
        },
        (error) => {
          this.notificationService.showNotification(error.error?.message || 'Error creating car.');
        }
      );
    } else {
      this.notificationService.showNotification('Please fill out all required fields!');
    }
  }
}
