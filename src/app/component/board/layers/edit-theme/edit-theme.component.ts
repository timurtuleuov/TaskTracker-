import { Component, Inject } from '@angular/core';
import { TaskThemeService } from '../../../../service/taskTheme/task-theme.service';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TaskTheme } from '../../../../interface/task-theme.interface';
import { EditThemeDialog } from '../../../board-theme/board-theme.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-edit-theme',
  standalone: true,
  imports: [NgbModule, MatDialogModule, MatInputModule, MatNativeDateModule, MatButtonModule, MatFormFieldModule, ReactiveFormsModule, MatIconModule, FormsModule],
  templateUrl: './edit-theme.component.html',
  styleUrl: './edit-theme.component.scss'
})
export class EditThemeComponent {
  constructor(
    public themeService: TaskThemeService,
    public dialogRef: MatDialogRef<EditThemeDialog>,
    @Inject(MAT_DIALOG_DATA) public data: TaskTheme
  ) {}
  onCancelClick(): void {
    this.dialogRef.close();
  }

  onSaveClick(): void {
    this.themeService.updateTheme(this.data)

    this.dialogRef.close(this.data);
  }
}
