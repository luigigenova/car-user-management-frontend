import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NotificationService } from '../../core/services/notification.service';
import { AuthService } from '../../core/services/auth.service';

/**
 * Component responsible for managing the login form and user authentication.
 */
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatSnackBarModule,
  ],
})
export class LoginComponent implements OnInit {
  /** Reactive login form */
  loginForm!: FormGroup;

  /** URL to redirect after successful login */
  returnUrl: string = '/';

  /** Indicates if the form has been submitted */
  submitted: boolean = false;

  /**
   * Constructor for the LoginComponent.
   * @param fb FormBuilder to create the reactive form.
   * @param authService AuthService for authentication.
   * @param router Router for navigation.
   * @param route ActivatedRoute to capture query parameters.
   * @param notificationService NotificationService for displaying notifications.
   */
  constructor(
    private readonly fb: FormBuilder,
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly notificationService: NotificationService
  ) {}

  /**
   * Initializes the component and captures the `returnUrl` query parameter.
   */
  ngOnInit(): void {
    this.initializeForm();
    this.captureReturnUrl();
  }

  /**
   * Initializes the login form with validators.
   */
  private initializeForm(): void {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  /**
   * Captures the `returnUrl` query parameter for redirecting after login.
   */
  private captureReturnUrl(): void {
    this.route.queryParams.subscribe((params) => {
      this.returnUrl = params['returnUrl'] || '/dashboard';
    });
  }

  /**
   * Handles form submission to authenticate the user.
   */
  onSubmit(): void {
    this.submitted = true;
  
    if (this.loginForm.valid) {
      const credentials = this.loginForm.value;
  
      this.authService.login(credentials).subscribe({
        next: (response) => {
          const successMessage = response.message;
          this.notificationService.showNotification(successMessage, 'success');
          const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
          this.router.navigateByUrl(returnUrl); // Redireciona para a tela protegida
        },
        error: (error: Error) => {
          const errorMessage = error.message;
          this.notificationService.showNotification(errorMessage, 'error');
        },
      });
    } else {
      this.notificationService.showNotification('Missing fields', 'error');
    }
  }

  /**
   * Navigates to the signup page.
   */
  goToSignup(): void {
    this.router.navigate(['/signup']);
  }
}
