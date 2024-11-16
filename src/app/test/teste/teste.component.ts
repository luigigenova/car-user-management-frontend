import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-teste',
  template: `
    <div>
      <h2>Teste do AuthInterceptor</h2>
      <button (click)="fazerRequisicao()">Testar Requisição Protegida</button>
    </div>
  `
})
export class TesteComponent {
  constructor(private http: HttpClient) {}

  fazerRequisicao() {
    this.http.get('/api/users').subscribe(
      response => console.log('Resposta da API:', response),
      error => console.error('Erro na requisição:', error)
    );
  }
}