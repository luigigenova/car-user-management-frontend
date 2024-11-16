import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule ]
})
export class LoginComponent {
  loginForm: FormGroup;
  message: string | null = null;

  constructor(private fb: FormBuilder,
    private authService: AuthService,
    private router: Router) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: (response: any) => {
          // Armazene o token
          localStorage.setItem('token', response.token);
          this.router.navigate(['/dashboard']);
        },
        error: err => this.message = err.message
      });
    } else {
      this.message = "Preencha todos os campos corretamente";
    }
  }

  // onSubmit() {
  //   if (this.loginForm.valid) {
  //     // Simulação de login
  //     const token = 'dummy-token'; // Normalmente, você obteria isso de uma API
  //     this.authService.setToken(token);
  //     this.router.navigate(['/dashboard']); // Redireciona para o dashboard após login
  //   }
  // }
}
