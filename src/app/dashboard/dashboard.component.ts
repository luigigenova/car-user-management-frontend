import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule,
    MatTableModule,
    MatButtonModule,
    MatCardModule,
    MatToolbarModule,
  ],
})
export class DashboardComponent implements OnInit {
  users: MatTableDataSource<any> = new MatTableDataSource();
  displayedColumns: string[] = ['id', 'name', 'actions'];

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.carregarUsuarios();
  }

  carregarUsuarios() {
    this.http.get('/api/users').subscribe({
      next: (data: any) => (this.users.data = data),
      error: (err) => console.error('Erro ao carregar usuários', err),
    });
  }

  editarUsuario(id: number) {
    console.log('Editar usuário', id);
  }

  excluirUsuario(id: number) {
    this.http.delete(`/api/users/${id}`).subscribe({
      next: () => {
        this.carregarUsuarios();
        console.log('Usuário excluído com sucesso!');
      },
      error: (err) => console.error('Erro ao excluir usuário', err),
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
