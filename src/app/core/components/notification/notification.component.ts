import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../../services/notification.service';
import { CommonModule } from '@angular/common';

/**
 * Global notification component to display error messages across the application.
 */
@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
  standalone: true,
  imports:[ CommonModule ]
})
export class NotificationComponent implements OnInit {
  message: string | null = null;
  type: string = 'info';

  constructor(private readonly notificationService: NotificationService) {}

  ngOnInit(): void {
    this.notificationService.message$.subscribe((notification) => {
      if (notification) {
        this.message = notification.message;
        this.type = notification.type || 'info';

        setTimeout(() => {
          this.message = null;
        }, 5000);
      }
    });
  }
}
