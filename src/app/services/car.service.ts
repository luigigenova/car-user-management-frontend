import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Car } from '../model/user.model';

/**
 * Service responsible for car-related operations.
 */
@Injectable({
  providedIn: 'root',
})
export class CarService {
  private readonly apiUrl = 'http://localhost:8080/api/cars';

  constructor(private readonly http: HttpClient) {}

  getAll(): Observable<Car[]> {
    return this.http.get<Car[]>(this.apiUrl).pipe(catchError(this.handleError));
  }

  getCarById(id: string): Observable<Car> {
    return this.http.get<Car>(`${this.apiUrl}/${id}`).pipe(catchError(this.handleError));
  }

  getAvailableCars(): Observable<Car[]> {
    return this.http.get<Car[]>(`${this.apiUrl}/available`).pipe(catchError(this.handleError));
  }

  createCar(car: Car): Observable<any> {
    return this.http.post<any>(this.apiUrl, car).pipe(catchError(this.handleError));
  }

  updateCar(id: string, car: Car): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, car).pipe(catchError(this.handleError));
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(catchError(this.handleError));
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

  addCarsToUser(userId: number, carIds: number[]): Observable<any> {
    return this.http
      .patch(`${this.apiUrl}/users/${userId}/add-cars`, carIds)
      .pipe(catchError(this.handleError));
  }
}
