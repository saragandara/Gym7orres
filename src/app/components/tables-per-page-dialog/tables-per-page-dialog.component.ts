import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-tables-per-page-dialog',
  standalone: true,
  imports: [MatButtonModule, MatDialogModule, MatIconModule, MatFormFieldModule, MatInputModule, FormsModule],
  templateUrl: './tables-per-page-dialog.component.html',
  styleUrl: './tables-per-page-dialog.component.scss'
})
export class TablesPerPageDialogComponent {
  dialogRef = inject(MatDialogRef<TablesPerPageDialogComponent>);
  tablesPerPage: number = 1;

  onConfirm() {
    if (this.tablesPerPage > 0) {
      this.dialogRef.close(this.tablesPerPage);
    }
  }

  onCancel() {
    this.dialogRef.close(null);
  }
}
