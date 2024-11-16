import { provideRouter, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { AuthGuard } from './guards/auth.guard';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TesteComponent } from './test/teste/teste.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'teste', component: TesteComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];

export const appRouting = [
  provideRouter(routes)
];