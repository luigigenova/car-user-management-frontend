import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  imports: [ MatCardModule, MatToolbarModule ],
})
export class DashboardComponent {
  constructor(private router: Router) {}

  navigateToUsers(): void {
    this.router.navigate(['/users']);
  }

  navigateToCars(): void {
    this.router.navigate(['/cars']);
  }

  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
