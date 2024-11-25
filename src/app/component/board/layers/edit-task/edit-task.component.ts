import { Component, Inject, OnInit } from '@angular/core';
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
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { TagService } from '../../../../service/tagService/tag.service';
import { Tag } from '../../../../interface/tag.interface';

@Component({
  selector: 'app-edit-task',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [NgbModule, MatDialogModule, MatInputModule, MatNativeDateModule, MatButtonModule, MatFormFieldModule, MatIconModule, MatSelectModule, MatDatepickerModule, NgbDatepickerModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
  CommonModule],
  templateUrl: './edit-task.component.html',
  styleUrl: './edit-task.component.scss'
})
export class EditTaskComponent implements OnInit {
  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  tags = [
    { id: '1', title: 'Учеба' },
    { id: '2', title: 'Работа' },
    { id: '3', title: 'Домашние дела' },
    { id: '4', title: 'Проект' },
    { id: '5', title: 'Здоровье' },
    { id: '6', title: 'Спорт' },
    { id: '7', title: 'Хобби' },
    { id: '8', title: 'Путешествия' },
    { id: '9', title: 'Семья' },
    { id: '10', title: 'Карьера' },
    { id: '11', title: 'Медитация' },
    { id: '12', title: 'Чтение' },
    { id: '13', title: 'Покупки' },
    { id: '14', title: 'Финансы' },
    { id: '15', title: 'Кулинария' },
    { id: '16', title: 'Творчество' },
    { id: '17', title: 'Социальные сети' },
    { id: '18', title: 'Музыка' },
    { id: '19', title: 'Фильмы' },
    { id: '20', title: 'Образование' }
  ];

  selectId!: { id: string; title: string }[];
  selectedTags: Tag[] = [];

  constructor(
    private tagService: TagService,
    private taskService: TaskService,
    public dialogRef: MatDialogRef<EditTaskComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Task
  ) {}

  ngOnInit(): void {
    
  }



  onCancelClick(): void {
    this.dialogRef.close();
  }

  onSaveClick(): void {
    this.taskService.updateTask(this.data);

    this.dialogRef.close(this.data); // Close the dialog after saving
  }
}