import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, finalize } from 'rxjs';
import { LoaderService } from '../../services/loader.service';

/**
 * Interceptor responsável por gerenciar a adição do token de autenticação às requisições HTTP
 * e controlar a exibição de um loader durante o processamento.
 */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  /**
   * Construtor com injeção de dependência.
   *
   * @param loaderService Serviço responsável por exibir/esconder o loader.
   */
  constructor(private loaderService: LoaderService) {}

  /**
   * Intercepta requisições HTTP para adicionar o token de autenticação, exceto para URLs excluídas,
   * e exibe/esconde o loader conforme necessário.
   *
   * @param req Requisição HTTP original.
   * @param next Próximo manipulador da requisição.
   * @returns Fluxo observável do evento HTTP.
   */
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.loaderService.show();

    // Lista de URLs que não devem conter o cabeçalho Authorization
    const excludedUrls = ['/api/users', '/api/users/available-cars'];

    // Verifica se a URL atual está na lista de exclusão
    const isExcluded = excludedUrls.some((url) => req.url.includes(url));

    if (isExcluded) {
      return next.handle(req).pipe(
        finalize(() => this.loaderService.hide())
      );
    }

    // Obtém o token JWT do armazenamento local
    const token = localStorage.getItem('token');

    // Se houver token, adiciona o cabeçalho Authorization
    const clonedRequest = token
      ? req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`,
          },
        })
      : req;

    // Encaminha a requisição, escondendo o loader após a conclusão
    return next.handle(clonedRequest).pipe(
      finalize(() => this.loaderService.hide())
    );
  }
}
