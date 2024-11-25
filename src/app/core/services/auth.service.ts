import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { catchError, map } from 'rxjs/operators';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { ApiResponse } from '../../model/api-response.model';

/**
 * Service responsible for user authentication and session management.
 */
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  /** API URL for authentication requests */
  private apiUrl = 'http://localhost:8080/api';

  /** Observable to track user's logged-in state */
  private isLoggedInSubject = new BehaviorSubject<boolean>(!!this.getToken());
  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  /** Key for storing username in localStorage */
  private usernameKey = 'username';

  /** User's name */
  private name = '';

  /** Determines if the code is running in the browser (SSR safe) */
  private isBrowser: boolean;

  /**
   * Constructor with dependencies injected.
   *
   * @param http HTTP client for API communication.
   * @param platformId Platform identifier (browser or server).
   */
  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  /**
   * Registers a new user.
   * @param data User data for registration.
   * @returns Observable with the API response.
   */
  signup(data: any): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/signup`, data, { observe: 'response' }).pipe(
      map((response) => ({
        status: response.status,
        message: response.body?.message || 'Unknown success',
      })),
      catchError((error: HttpErrorResponse) => {
        const errorMessage = error.error?.error || error.message || 'Unknown error';
        return throwError(() => ({
          status: error.status,
          message: errorMessage,
        }));
      })
    );
  }

  /**
   * Logs in the user.
   * @param data User credentials (username and password).
   * @returns Observable with the token, user's name, and success message.
   */
  login(data: any): Observable<{ token: string; name: string; message: string }> {
    return this.http.post<{ token: string; name: string; message: string }>(`${this.apiUrl}/signin`, data).pipe(
      map((response) => {
        this.setToken(response.token);
        this.setName(response.name);
        this.setLastLoginTime(); // Set the session start time
        this.isLoggedInSubject.next(true);
        return response;
      }),
      catchError((error: HttpErrorResponse) => {
        const errorMessage = error.error?.message || 'Error during login';
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  /**
   * Stores the user's name.
   * @param name User's name.
   */
  setName(name: string): void {
    this.name = name;
  }

  /**
   * Retrieves the user's name.
   * @returns User's name.
   */
  getName(): string {
    return this.name;
  }

  /**
   * Stores the JWT token in localStorage.
   * @param token JWT token.
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
    if (this.isBrowser) {
      return localStorage.getItem('token');
    }
    return null;
  }

  /**
   * Retrieves the username from localStorage.
   * @returns Username or an empty string if not found.
   */
  getUsername(): string {
    if (this.isBrowser) {
      return localStorage.getItem(this.usernameKey) || '';
    }
    return '';
  }

  /**
   * Logs out the user by removing token and username from localStorage.
   */
  logout(): void {
    if (this.isBrowser) {
      localStorage.removeItem('token');
      localStorage.removeItem(this.usernameKey);
      localStorage.removeItem('lastLoginTime');
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
      const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
      return decodedToken.exp > currentTime; // Check if the token has expired
    } catch (error) {
      return false; // Invalid token or decoding error
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
    localStorage.setItem('lastLoginTime', Date.now().toString());
  }

  /**
   * Sets the last login timestamp to the current time.
   */
  setLastLoginTime(): void {
    localStorage.setItem('lastLoginTime', Date.now().toString());
  }
}
