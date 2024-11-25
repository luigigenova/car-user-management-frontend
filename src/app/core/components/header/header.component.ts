import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';

/**
 * Componente responsável pelo cabeçalho do sistema.
 * Exibe informações do usuário logado e botões de navegação.
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
   */
  isLoggedIn = false;

  /**
   * Nome do usuário logado.
   */
  name = '';

  /**
   * Indica se a página atual é o Dashboard.
   */
  isDashboardPage = false;

  /**
   * Construtor do HeaderComponent.
   * @param authService Serviço de autenticação para gerenciar o status do usuário.
   * @param router Roteador Angular para navegação.
   */
  constructor(private authService: AuthService, private router: Router) {
    this.authService.isLoggedIn$.subscribe((status) => {
      this.isLoggedIn = status;
      if (status) {
        this.name = this.authService.getName();
      } else {
        this.name = '';
      }
    });

    // Detecta a rota ativa
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.isDashboardPage = event.url === '/' || event.url === '/dashboard';
      });
  }

  /**
   * Realiza logout do usuário e redireciona para a página inicial.
   */
  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
