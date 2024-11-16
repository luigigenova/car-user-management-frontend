import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) { }

  signup(data: any) {
    return this.http.post(`${this.apiUrl}/signup`, data).pipe(
      catchError(error => {
        const errorMessage = error.error || 'Erro ao realizar o cadastro';
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  login(data: any) {
    return this.http.post(`${this.apiUrl}/login`, data).pipe(
      catchError(error => {
        const errorMessage = error.error.message || 'Erro ao realizar o login';
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  logout(): void {
    localStorage.removeItem('token');
  }

}
