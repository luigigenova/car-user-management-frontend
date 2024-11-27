import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { User } from '../model/user.model';
import { ApiResponse } from '../model/api-response.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class UserService {
  private apiUrl = environment.apiUrl;
  private endpoints = environment.endpoints;

  constructor(private http: HttpClient) {}

  getUser(id: number): Observable<User> {
    return this.http
      .get<User>(`${this.apiUrl}${this.endpoints.users}/${id}`)
      .pipe(catchError(this.handleError));
  }

  createUser(user: User): Observable<ApiResponse> {
    return this.http
      .post<ApiResponse>(`${this.apiUrl}${this.endpoints.users}`, user, { observe: 'response' })
      .pipe(
        map((response) => ({
          status: response.status,
          message: response.body?.message || 'Usuário criado com sucesso',
        })),
        catchError(this.mapHttpError)
      );
  }

  updateUser(id: number, user: User): Observable<ApiResponse> {
    return this.http
      .put<ApiResponse>(`${this.apiUrl}${this.endpoints.users}/${id}`, user, { observe: 'response' })
      .pipe(
        map((response) => ({
          status: response.status,
          message: response.body?.message || 'Usuário atualizado com sucesso',
        })),
        catchError(this.mapHttpError)
      );
  }

  deleteUser(id: number): Observable<void> {
    return this.http
      .delete<void>(`${this.apiUrl}${this.endpoints.users}/${id}`)
      .pipe(catchError(this.handleError));
  }

  getAllUsers(page: number, size: number): Observable<HttpResponse<any>> {
    return this.http
      .get<any>(`${this.apiUrl}${this.endpoints.getAllUsers(page, size)}`, { observe: 'response' })
      .pipe(catchError(this.handleError));
  }

  removeCarFromUser(userId: number, carId: number): Observable<any> {
    return this.http
      .patch(`${this.apiUrl}${this.endpoints.userRemoveCar(userId, carId)}`, null)
      .pipe(catchError(this.handleError));
  }

  addCarsToUser(userId: number, carIds: number[]): Observable<any> {
    return this.http
      .patch(`${this.apiUrl}${this.endpoints.userAddCars(userId)}`, carIds)
      .pipe(catchError(this.handleError));
  }

  getAvailableCars(): Observable<any[]> {
    return this.http
      .get<any[]>(`${this.apiUrl}${this.endpoints.getAvailableCars}`)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred.';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Client-side error: ${error.error.message}`;
    } else {
      errorMessage = error.error?.message || `Server error: ${error.message}`;
    }
    return throwError(() => new Error(errorMessage));
  }

  private mapHttpError(error: HttpErrorResponse): Observable<never> {
    const errorMessage = error?.error?.message || 'Erro desconhecido';
    return throwError(() => ({
      status: error.status,
      message: errorMessage,
    }));
  }
}
