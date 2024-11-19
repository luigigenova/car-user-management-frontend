import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { User } from '../model/user.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ApiResponse } from '../model/api-response.model';
import { catchError, map, throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserService {
  private apiUrl = 'http://localhost:8080/api/users';

  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  getUser(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  createUser(user: User): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}`, user, { observe: 'response' }).pipe(
      map((response) => {
        return {
          status: response.status,
          message: response.body?.message || 'Usuário criado com sucesso',
        };
      }),
      catchError((error: HttpErrorResponse) => {
        const errorMessage = error?.error?.message || 'Erro desconhecido';
        return throwError(() => ({
          status: error.status,
          message: errorMessage,
        }));
      })
    );
  }

  updateUser(id: number, user: User): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${this.apiUrl}/${id}`, user, { observe: 'response' }).pipe(
      map((response) => {
        return {
          status: response.status,
          message: response.body?.message || 'Usuário criado com sucesso',
        };
      }),
      catchError((error: HttpErrorResponse) => {
        const errorMessage = error?.error?.message || 'Erro desconhecido';
        return throwError(() => ({
          status: error.status,
          message: errorMessage,
        }));
      })
    );
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

