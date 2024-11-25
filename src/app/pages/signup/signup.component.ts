import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, HttpClientModule, CommonModule, MatSnackBarModule, MatIconModule, MatFormFieldModule]
})
export class SignupComponent {
  signupForm: FormGroup;
  showPassword: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.signupForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      birthday: ['', Validators.required],
      login: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(50)]],
      phone: ['', Validators.required],
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    if (this.signupForm.valid) {
      const formValue = { ...this.signupForm.value };
      formValue.birthday = new Date(formValue.birthday).toISOString().split('T')[0];
      this.authService.signup(this.signupForm.value).subscribe({
        next: (response: any) => {
          if (response.status === 201) {
            this.router.navigate(['/login']);
          } else {
            this.snackBar.open('Unknown registration error', 'Fechar', {
              duration: 5000,
              horizontalPosition: 'right',
              verticalPosition: 'top',
            });
          }
        },
        error: (error) => {
          if (error.status === 400 || error.status === 409 || error.status === 500) {
            this.snackBar.open(error.message, 'Fechar', {
              duration: 5000,
              horizontalPosition: 'right',
              verticalPosition: 'top',
            });
          } else {
            this.snackBar.open('Unknown registration error', 'Fechar', {
              duration: 5000,
              horizontalPosition: 'right',
              verticalPosition: 'top',
            });
          }
        },
      });
    } else {
      this.snackBar.open('Preencha todos os campos corretamente', 'Fechar', {
        duration: 5000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
      });
    }
  }

}


