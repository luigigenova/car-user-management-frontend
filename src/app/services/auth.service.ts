import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { Observable, of, throwError } from 'rxjs';
import { ApiResponse } from '../model/api-response.model';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) { }

  signup(data: any): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/signup`, data, { observe: 'response' }).pipe(
      map((response) => {
        return {
          status: response.status,
          message: response.body?.message || 'Sucesso desconhecido',
        };
      }),
      catchError((error: HttpErrorResponse) => {
        const errorMessage = error.error?.error || error.message || 'Erro desconhecido';
        return throwError(() => ({
          status: error.status,
          message: errorMessage,
        }));
      })
    );
  }

  login(data: any): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(`${this.apiUrl}/signin`, data).pipe(
      catchError((error: HttpErrorResponse) => {
        const errorMessage = error.error?.error || error.error?.message || 'Erro ao realizar o login';
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    if (typeof window !== 'undefined' && window.localStorage) {
    return localStorage.getItem('token');
    }
    return null;
  }

  logout(): void {
    localStorage.removeItem('token');
  }

}
