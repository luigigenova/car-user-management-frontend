import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { catchError, map, throwError } from 'rxjs';
import { User } from '../model/user.model';
import { ApiResponse } from '../model/api-response.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  private apiUrl = 'http://localhost:8080/api/users';

  constructor(private http: HttpClient) { }

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

  /**
   * Busca os usuários paginados do backend.
   * @param page Página atual.
   * @param size Tamanho da página.
   * @returns Observable com a resposta paginada.
   */
  getAllUsers(page: number, size: number): Observable<HttpResponse<any>> {
    const params = { page: page.toString(), size: size.toString() };
    return this.http.get<any>(this.apiUrl, { params, observe: 'response' });
  }

  /**
   * Remove um carro associado ao usuário.
   * @param userId ID do usuário.
   * @param carId ID do carro.
   * @returns Observable do backend.
   */
  removeCarFromUser(userId: number, carId: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${userId}/remove-car/${carId}`, null);
  }

  addCarsToUser(userId: number, carIds: number[]): Observable<any> {
    return this.http
      .patch(`${this.apiUrl}/${userId}/add-cars`, carIds)
      .pipe(catchError(this.handleError));
  }

  /**
 * Retorna a lista de carros disponíveis para associação.
 * @returns Observable com a lista de carros.
 */
  getAvailableCars(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/available-cars`);
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

}

