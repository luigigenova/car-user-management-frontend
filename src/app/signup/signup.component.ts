import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, HttpClientModule, CommonModule, MatSnackBarModule]
})
export class SignupComponent {
  signupForm: FormGroup;
  message: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.signupForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: [
        '',
        [
          Validators.required,
          Validators.email
        ]
      ],
      birthday: ['', Validators.required],
      login: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(20),
          Validators.pattern('^[a-zA-Z0-9_]+$')
        ]
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(50)
        ]
      ],
      phone: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.signupForm.valid) {
      this.authService.signup(this.signupForm.value).subscribe({
        next: (response: any) => {
          if (response.token) {
            // Trata o caso de sucesso
            this.snackBar.open('Usuário cadastrado com sucesso!', 'Fechar', {
              duration: 5000,
              horizontalPosition: 'right',
              verticalPosition: 'top'
            });
            this.authService.setToken(response.token);
            this.router.navigate(['/dashboard']); 
          } else {
            // Tratamento alternativo caso não tenha token, se aplicável
            this.snackBar.open('Usuário cadastrado com sucesso!', 'Fechar', {
              duration: 5000,
              horizontalPosition: 'right',
              verticalPosition: 'top'
            });
            this.router.navigate(['/login']); 
          }
        },
        error: (err) => {
          // Trata o caso de erro
          const errorMessage = err.error ? err.error : err.message ? err.message : 'Erro desconhecido';
          this.snackBar.open(errorMessage, 'Fechar', {
            duration: 5000,
            horizontalPosition: 'right',
            verticalPosition: 'top'
          });
          this.message = errorMessage;
        }
      });
    } else {
      this.message = "Preencha todos os campos corretamente";
    }
  }
  
}
