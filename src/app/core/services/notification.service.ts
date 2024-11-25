import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

/**
 * Service to handle global notifications across the application.
 */
@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private messageSubject = new BehaviorSubject<{ message: string; type?: string } | null>(null);
  message$ = this.messageSubject.asObservable();

  /**
   * Display a notification message.
   * @param message The message to display.
   * @param type Optional type of notification (e.g., 'success', 'error').
   */
  showNotification(message: string, type: string = 'info'): void {
    this.messageSubject.next({ message, type });
  }

  /**
   * Clear the current notification message.
   */
  clearNotification(): void {
    this.messageSubject.next(null);
  }
}
