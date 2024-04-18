import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Task } from '../../../../interface/task.interface';
import { EditTaskDialog } from '../../board.component';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { NgbModule, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { TaskService } from '../../../../service/task.service';

@Component({
  selector: 'app-edit-task',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [NgbModule, MatDialogModule, MatInputModule, MatNativeDateModule, MatButtonModule, MatFormFieldModule, ReactiveFormsModule, MatIconModule, MatSelectModule, MatDatepickerModule, NgbDatepickerModule, FormsModule],
  templateUrl: './edit-task.component.html',
  styleUrl: './edit-task.component.scss'
})
export class EditTaskComponent {
  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });
  constructor(
    public taskService: TaskService,
    public dialogRef: MatDialogRef<EditTaskDialog>,
    @Inject(MAT_DIALOG_DATA) public data: Task
  ) {}
  onCancelClick(): void {
    this.dialogRef.close();
  }

  onSaveClick(): void {
    this.taskService.updateTask(this.data)
    // You can perform additional validation or processing here before closing the dialog
    this.dialogRef.close(this.data);
  }
}
