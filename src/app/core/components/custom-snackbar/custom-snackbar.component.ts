import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
  selector: 'app-custom-snackbar',
  template: `<div [innerHTML]="data"></div>`,
  styles: [`
    div {
      color: white;
      font-size: 14px;
      line-height: 1.5;
    }
  `],
  standalone: true
})
export class CustomSnackbarComponent {
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: string) {}
}
