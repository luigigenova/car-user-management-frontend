import { provideRouter, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { TesteComponent } from './test/teste/teste.component';
import { CarListComponent } from './pages/car-list/car-list.component';
import { CarFormComponent } from './pages/car-form/car-form.component';
import { UserFormComponent } from './pages/users/user-form/user-form.component';
import { UserListComponent } from './pages/users/user-list/user-list.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AuthGuard } from './core/guards/auth.guard';

/**
 * Rotas do aplicativo, organizadas para garantir proteção e clareza.
 * Segue princípios de S.O.L.I.D. e boas práticas para roteamento em Angular.
 */
export const routes: Routes = [
  // Rotas públicas
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'teste', component: TesteComponent }, 
  { path: '', component: DashboardComponent },

  // Rotas de usuários
  {
    path: 'users',
    children: [
      { path: '', component: UserListComponent },
      { path: 'new', component: UserFormComponent },
      { path: 'edit/:id', component: UserFormComponent },
    ],
  },

  // Rotas de carros
  {
    path: 'cars',
    canActivate: [AuthGuard],
    children: [
      { path: '', component: CarListComponent },
      { path: 'add', component: CarFormComponent },
      { path: 'edit/:id', component: CarFormComponent },
    ],
  },

  // Fallback para rotas não encontradas
  { path: '**', redirectTo: 'login' },
];

/**
 * Configuração de roteamento principal do aplicativo.
 */
export const appRouting = provideRouter(routes);
