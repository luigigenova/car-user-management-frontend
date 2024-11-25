import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';
import { MatPaginatorModule } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { HeaderComponent } from '../../../core/components/header/header.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { UserService } from '../../../services/user.service';

/**
 * Componente responsável por exibir a lista de usuários com paginação.
 * Permite remover usuários e navegar para a página de edição.
 */
@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
  standalone: true,
  imports: [
    MatIconModule,
    MatFormFieldModule,
    MatCardModule,
    ReactiveFormsModule,
    MatTableModule,
    CommonModule,
    FormsModule,
    HeaderComponent,
    MatPaginatorModule,
    MatProgressSpinnerModule
  ],
})
export class UserListComponent implements OnInit {
  /** Colunas exibidas na tabela de usuários. */
  displayedColumns: string[] = ['id', 'name', 'email', 'cars', 'actions'];

  /** Fonte de dados da tabela de usuários. */
  dataSource = new MatTableDataSource<any>();

  /** Total de usuários cadastrados. */
  totalUsers = 0;

  /** Tamanho da página de usuários exibida. */
  pageSize = 10;

  /** Índice da página atual. */
  pageIndex = 0;

  /** Opções de tamanhos de página disponíveis. */
  pageSizeOptions: number[] = [5, 10, 25, 50];

  /**
   * Construtor para injeção de dependências.
   * @param userService Serviço responsável por operações de usuários.
   * @param snackBar Serviço para exibição de mensagens.
   * @param router Serviço de navegação entre rotas.
   */
  constructor(
    private userService: UserService,
    private snackBar: MatSnackBar,
    private router: Router
  ) { }

  /**
   * Inicializa o componente carregando os usuários.
   */
  ngOnInit(): void {
    this.loadUsers();
  }

  /**
   * Carrega os usuários do backend com base na página atual.
   */
  loadUsers(): void {
    this.userService.getAllUsers(this.pageIndex, this.pageSize).subscribe({
      next: (response) => {
        this.dataSource.data = response.body;
        this.totalUsers = parseInt(response.headers.get('X-Total-Count') || '0', 10);
      },
      error: (err) => {
        this.snackBar.open(err.error?.message || 'Erro ao carregar usuários', 'Fechar', {
          duration: 3000,
        });
      },
    });
  }

  /**
   * Navega para a página de edição de usuário.
   * @param id ID do usuário.
   */
  editUser(id: number): void {
    this.router.navigate([`/users/edit/${id}`]);
  }

  /**
   * Remove um usuário do sistema.
   * @param userId ID do usuário a ser removido.
   */
  deleteUser(userId: number): void {
    this.userService.deleteUser(userId).subscribe({
      next: () => {
        this.snackBar.open('Usuário removido com sucesso!', 'Fechar', { duration: 3000 });
        this.loadUsers();
      },
      error: (err) => {
        this.snackBar.open(err.error?.message || 'Erro ao remover usuário', 'Fechar', {
          duration: 3000,
        });
      },
    });
  }

  /**
   * Atualiza a tabela quando a página é alterada.
   * @param event Evento de paginação.
   */
  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadUsers();
  }
}
