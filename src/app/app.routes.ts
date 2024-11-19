import { provideRouter, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { AuthGuard } from './guards/auth.guard';
import { TesteComponent } from './test/teste/teste.component';
import { CarListComponent } from './cars/car-list/car-list.component';
import { CarFormComponent } from './cars/car-form/car-form.component';
import { UserFormComponent } from './users/user-form/user-form.component';
import { UserListComponent } from './users/user-list/user-list.component';
import { DashboardComponent } from './dashboard/dashboard.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'teste', component: TesteComponent },
  { path: '', component: DashboardComponent },
  { path: 'users',
    children: [
      { path: '', component: UserListComponent },
      { path: 'new', component: UserFormComponent },
      { path: 'edit/:id', component: UserFormComponent },
    ],
  },
  {
    path: 'cars',
    children: [
      { path: '', component: CarListComponent, canActivate: [AuthGuard] },
      { path: 'add', component: CarFormComponent, canActivate: [AuthGuard] },
      { path: 'edit/:id', component: CarFormComponent, canActivate: [AuthGuard] },
    ],
  },
  { path: '**', redirectTo: '/login' },
];

export const appRouting = provideRouter(routes);
