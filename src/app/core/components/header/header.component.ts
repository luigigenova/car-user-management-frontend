import { Component } from '@angular/core';
import { NavigationEnd, Router, Event as RouterEvent } from '@angular/router';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';

/**
 * HeaderComponent
 *
 * Componente responsável pelo cabeçalho do sistema.
 * Exibe informações do usuário logado, botões de autenticação, e navegação.
 */
@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [
    CommonModule,
    RouterModule,
  ],
})
export class HeaderComponent {
  /**
   * Indica se o usuário está logado.
   * Subscrito pelo Observable `isLoggedIn$` do AuthService.
   */
  isLoggedIn = false;

  /**
   * Nome do usuário logado, obtido pelo AuthService.
   */
  name = '';

  /**
   * Indica se a página atual é o Dashboard.
   * Detectado dinamicamente via rota.
   */
  isDashboardPage = false;

  /**
   * Construtor do HeaderComponent.
   * Injeta serviços necessários e configura observadores para estados reativos.
   *
   * @param authService Serviço de autenticação para gerenciar status do usuário.
   * @param router Serviço de roteamento Angular para detecção e navegação de rotas.
   */
  constructor(private readonly authService: AuthService, private readonly router: Router) {
    this.subscribeToAuthState();
    this.detectActiveRoute();
    this.clearStorageOnLoginPage();
  }

  /**
   * Inscreve-se no estado de autenticação via `AuthService` para atualizar `isLoggedIn` e `name`.
   * Implementa o princípio de **Dependency Inversion** ao depender de abstrações.
   */
  private subscribeToAuthState(): void {
    this.authService.isLoggedIn$.subscribe((status) => {
      this.isLoggedIn = status;
      this.name = status ? this.authService.getName() : '';
    });
  }

  /**
   * Detecta a rota ativa e atualiza `isDashboardPage` dinamicamente.
   * Implementa **Single Responsibility** ao isolar a lógica de roteamento.
   * Utiliza um type guard para garantir que o evento é do tipo `NavigationEnd`.
   */
  private detectActiveRoute(): void {
    this.router.events
      .pipe(filter((event: RouterEvent): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.isDashboardPage = event.url === '/' || event.url === '/dashboard';
      });
  }

  /**
   * Limpa o localStorage ao navegar para a página de login,
   * caso o usuário não esteja autenticado.
   */
  private clearStorageOnLoginPage(): void {
    this.router.events
      .pipe(filter((event: RouterEvent): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        if (event.url === '/login' && !this.isLoggedIn) {
          localStorage.clear();
        }
      });
  }

  /**
   * Realiza o logout do usuário.
   * Remove informações de sessão e redireciona para a página inicial.
   */
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
