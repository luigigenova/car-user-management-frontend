import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';
import { ApiResponse } from '../../model/api-response.model';
import { environment } from '../../../environments/environment';

/**
 * Service responsible for user authentication and session management.
 * Adheres to S.O.L.I.D principles and incorporates Design Patterns like Dependency Injection.
 */
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  /** API base URL for authentication requests */
  private readonly apiUrl: string = environment.apiUrl;

  /** Endpoints defined in the environment file */
  private readonly endpoints = environment.endpoints;

  /**
   * Subject to track user's logged-in state.
   * Implements the Observer Design Pattern.
   */
  private readonly isLoggedInSubject = new BehaviorSubject<boolean>(!!this.getToken());

  /** Observable to expose the logged-in state */
  readonly isLoggedIn$ = this.isLoggedInSubject.asObservable();

  /** Key used for storing the username in localStorage */
  private readonly usernameKey = 'username';

  /** Key used for storing the user's name in localStorage */
  private readonly nameKey = 'name';

  /** Determines if the code is running in the browser (SSR safe) */
  private readonly isBrowser: boolean;

  /**
   * Constructor with dependencies injected.
   * @param http - HTTP client for API communication.
   * @param platformId - Platform identifier (browser or server).
   */
  constructor(private readonly http: HttpClient, @Inject(PLATFORM_ID) private readonly platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  /**
   * Registers a new user in the system.
   * @param data - User data for registration.
   * @returns Observable with the API response.
   */
  signup(data: any): Observable<ApiResponse> {
    return this.http
      .post<ApiResponse>(`${this.apiUrl}${this.endpoints.users}/signup`, data, { observe: 'response' })
      .pipe(
        map((response) => ({
          status: response.status,
          message: response.body?.message || 'User successfully registered.',
        })),
        catchError(this.handleError)
      );
  }

  /**
   * Logs in the user and stores the token and name in localStorage.
   * @param data - User credentials (username and password).
   * @returns Observable with the token, user's name, and success message.
   */
  login(data: any): Observable<{ token: string; name: string; message: string }> {
    return this.http
      .post<{ token: string; name: string; message: string }>(
        `${this.apiUrl}${this.endpoints.users}/signin`,
        data
      )
      .pipe(
        map((response) => {
          this.setToken(response.token);
          this.setName(response.name);
          this.setLastLoginTime();
          this.isLoggedInSubject.next(true);
          return response;
        }),
        catchError(this.handleError)
      );
  }

  /**
   * Sets the user's name in localStorage.
   * @param name - User's name.
   */
  setName(name: string): void {
    if (this.isBrowser) {
      localStorage.setItem(this.nameKey, name);
    }
  }

  /**
   * Retrieves the user's name from localStorage.
   * @returns User's name or an empty string if not found.
   */
  getName(): string {
    return this.isBrowser ? localStorage.getItem(this.nameKey) || '' : '';
  }

  /**
   * Removes the user's name from localStorage.
   */
  removeName(): void {
    if (this.isBrowser) {
      localStorage.removeItem(this.nameKey);
    }
  }

  /**
   * Stores the JWT token in localStorage.
   * @param token - JWT token.
   */
  setToken(token: string): void {
    if (this.isBrowser) {
      localStorage.setItem('token', token);
    }
  }

  /**
   * Retrieves the JWT token from localStorage.
   * @returns JWT token or null if not found.
   */
  getToken(): string | null {
    return this.isBrowser ? localStorage.getItem('token') : null;
  }

  /**
   * Logs out the user by removing token and username from localStorage.
   */
  logout(): void {
    if (this.isBrowser) {
      localStorage.removeItem('token');
      localStorage.removeItem(this.usernameKey);
      localStorage.removeItem('lastLoginTime');
      this.removeName();
    }
    this.isLoggedInSubject.next(false);
  }

  /**
   * Checks if the user is authenticated with a valid token.
   * @returns `true` if the token is valid, otherwise `false`.
   */
  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) {
      return false;
    }

    try {
      const decodedToken: any = jwtDecode(token);
      const currentTime = Math.floor(Date.now() / 1000);
      return decodedToken.exp > currentTime;
    } catch (error) {
      return false;
    }
  }

  /**
   * Ensures the user is logged in on page load. Logs out if invalid.
   */
  verifyUserOnLoad(): void {
    if (!this.getToken() || !this.getUsername()) {
      this.logout();
    }
  }

  /**
   * Retrieves the last login timestamp from localStorage.
   * @returns The timestamp or null if not available.
   */
  getLastLoginTime(): number | null {
    const timestamp = localStorage.getItem('lastLoginTime');
    return timestamp ? parseInt(timestamp, 10) : null;
  }

  /**
   * Updates the last login timestamp to the current time.
   */
  updateLastLoginTime(): void {
    if (this.isBrowser) {
      localStorage.setItem('lastLoginTime', Date.now().toString());
    }
  }

  /**
   * Sets the last login timestamp to the current time.
   */
  setLastLoginTime(): void {
    if (this.isBrowser) {
      localStorage.setItem('lastLoginTime', Date.now().toString());
    }
  }

  /**
   * Retrieves the username from localStorage.
   * @returns Username or an empty string if not found.
   */
  getUsername(): string {
    return this.isBrowser ? localStorage.getItem(this.usernameKey) || '' : '';
  }

  /**
   * Handles HTTP errors and transforms them into meaningful messages.
   * @param error - The HTTP error response.
   * @returns Observable throwing a formatted error message.
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    const errorMessage = error.error?.message || error.message || 'An unknown error occurred.';
    return throwError(() => new Error(errorMessage));
  }
}
