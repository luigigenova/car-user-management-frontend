import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { Router } from '@angular/router';
import { LoaderService } from '../../services/loader.service';

/**
 * Interceptor responsável por adicionar o token JWT nas requisições HTTP e gerenciar o loader.
 * Também redireciona para a tela de login em caso de falha de autenticação.
 */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  /**
   * Lista de URLs que não devem conter o cabeçalho Authorization.
   * Responsável por gerenciar rotas específicas sem autenticação.
   */
  private readonly excludedUrls: string[] = ['/api/users', '/api/users/available-cars', '/api/users/signup', '/api/users/signin'];

  /**
   * Construtor com injeção de dependências.
   * @param loaderService Serviço responsável por exibir/esconder o loader.
   * @param router Serviço de navegação para redirecionamento.
   */
  constructor(private readonly loaderService: LoaderService, private readonly router: Router) {}

  /**
   * Intercepta requisições HTTP, adiciona token de autenticação (se necessário), controla o loader
   * e redireciona para login em caso de erro 401/403.
   * @param req Requisição HTTP original.
   * @param next Próximo manipulador no pipeline de requisições.
   * @returns Fluxo observável do evento HTTP.
   */
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.loaderService.show(); // Exibe o loader no início da requisição

    // Verifica se a URL está na lista de exclusão
    if (this.isExcludedUrl(req.url)) {
      return next.handle(req).pipe(
        finalize(() => this.loaderService.hide()) // Esconde o loader após a conclusão
      );
    }

    // Obtém o token JWT do armazenamento local
    const token = this.getToken();

    // Clona a requisição adicionando o cabeçalho Authorization, se o token estiver presente
    const clonedRequest = token
      ? req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`,
          },
        })
      : req;

    // Encaminha a requisição clonada, lida com erros de autenticação e esconde o loader após a conclusão
    return next.handle(clonedRequest).pipe(
      catchError((error) => this.handleAuthError(error)), // Gerencia erros de autenticação
      finalize(() => this.loaderService.hide())
    );
  }

  /**
   * Verifica se uma URL está na lista de exclusão.
   * @param url URL da requisição.
   * @returns Verdadeiro se a URL está na lista de exclusão, caso contrário falso.
   */
  private isExcludedUrl(url: string): boolean {
    return this.excludedUrls.some((excludedUrl) => url.includes(excludedUrl));
  }

  /**
   * Obtém o token JWT armazenado localmente.
   * @returns Token JWT ou null se não estiver disponível.
   */
  private getToken(): string | null {
    return localStorage.getItem('token');
  }

  /**
   * Lida com erros de autenticação, redirecionando para a tela de login em caso de 401/403.
   * @param error Resposta de erro HTTP.
   * @returns Observable que propaga o erro para ser tratado posteriormente.
   */
  private handleAuthError(error: HttpErrorResponse): Observable<never> {
    if (error.status === 401 || error.status === 403) {
      // Redireciona para a tela de login e preserva a URL de retorno
      const returnUrl = window.location.pathname;
      this.router.navigate(['/login'], { queryParams: { returnUrl } });
    }
    return throwError(() => error); // Propaga o erro para que outros manipuladores possam lidar
  }
}
