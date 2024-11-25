import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatListModule } from '@angular/material/list';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { UserService } from '../../../services/user.service';

/**
 * Component responsible for creating and editing users.
 * Allows associating and removing cars for a user.
 */
@Component({
  selector: 'app-user-form',
  standalone: true,
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatCardModule,
    MatIconModule,
    HttpClientModule,
    CommonModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatListModule,
  ],
})
export class UserFormComponent implements OnInit {
  /** Reactive form for user creation and editing */
  userForm!: FormGroup;

  /** Controls password visibility */
  showPassword = false;

  /** List of available cars to associate */
  availableCars: any[] = [];

  /** List of cars already associated with the user */
  userCars: any[] = [];

  /** ID of the user being edited */
  userId: number | null = null;

  /** Set of car IDs selected for association */
  selectedCarsToAssociate: Set<number> = new Set();

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadAvailableCars();
    this.loadUserFromRoute();
  }

  private initializeForm(): void {
    this.userForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      birthday: ['', Validators.required],
      login: ['', Validators.required],
      password: ['', Validators.required],
      phone: ['', Validators.required],
    });
  }

  private loadUserFromRoute(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.userId = +id;
        this.loadUserData(this.userId);
      }
    });
  }

  private loadUserData(id: number): void {
    this.userService.getUser(id).subscribe({
      next: (user) => {
        this.userForm.patchValue({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          birthday: user.birthday,
          login: user.login,
          phone: user.phone,
        });
        this.userCars = user.cars || [];
      },
      error: (err) => {
        this.snackBar.open(err.error?.message || 'Error loading user.', 'Close', { duration: 3000 });
      },
    });
  }

  private loadAvailableCars(): void {
    this.userService.getAvailableCars().subscribe({
      next: (cars) => (this.availableCars = cars),
      error: (err) => {
        this.snackBar.open(err.error?.message || 'Error loading available cars.', 'Close', { duration: 3000 });
      },
    });
  }

  removeCar(carId: number): void {
    if (!this.userId) {
      this.snackBar.open('User not registered.', 'Close', { duration: 3000 });
      return;
    }

    this.userService.removeCarFromUser(this.userId, carId).subscribe({
      next: () => {
        const removedCar = this.userCars.find((car) => car.id === carId);
        if (removedCar) {
          this.userCars = this.userCars.filter((car) => car.id !== carId);
          this.availableCars.push(removedCar);
        }
        this.snackBar.open('Car removed successfully!', 'Close', { duration: 3000 });
      },
      error: (err) => {
        this.snackBar.open(err.error?.message || 'Error removing car.', 'Close', { duration: 3000 });
      },
    });
  }

  associateSelectedCars(): void {
    if (!this.userId) {
      this.snackBar.open('User not registered.', 'Close', { duration: 3000 });
      return;
    }

    const carIds = Array.from(this.selectedCarsToAssociate);
    this.userService.addCarsToUser(this.userId, carIds).subscribe({
      next: () => {
        this.snackBar.open('Cars associated successfully!', 'Close', { duration: 3000 });
        this.loadAvailableCars();
        if (this.userId)
        this.loadUserData(this.userId);
        this.selectedCarsToAssociate.clear();
      },
      error: (err) => {
        this.snackBar.open(err.error?.message || 'Error associating cars.', 'Close', { duration: 3000 });
      },
    });
  }

  toggleCarSelection(carId: number): void {
    if (this.selectedCarsToAssociate.has(carId)) {
      this.selectedCarsToAssociate.delete(carId);
    } else {
      this.selectedCarsToAssociate.add(carId);
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      const userData = { ...this.userForm.value };

      const userObservable = this.userId
        ? this.userService.updateUser(this.userId, userData)
        : this.userService.createUser(userData);

      userObservable.subscribe({
        next: () => {
          this.snackBar.open('User saved successfully!', 'Close', { duration: 3000 });
          this.router.navigate(['/users']);
        },
        error: (err) => {
          this.snackBar.open(err.error?.message || 'Error saving user.', 'Close', { duration: 3000 });
        },
      });
    } else {
      this.snackBar.open('Invalid form. Check required fields.', 'Close', { duration: 3000 });
    }
  }

  goBack(): void {
    this.location.back();
  }
}
