import { Component, Inject, OnInit } from '@angular/core';
import { TaskTheme } from '../../interface/task-theme.interface';
import { DarkModeService } from '../../service/darkMode/dark-mode.service';
import { TaskThemeService } from '../../service/taskTheme/task-theme.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { v4 as uuidv4 } from 'uuid';
import { EditThemeComponent } from '../board/layers/edit-theme/edit-theme.component';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { TaskService } from '../../service/task.service';
@Component({
  selector: 'app-board-theme',
  standalone: true,
  imports: [NgbModule, MatInputModule, FormsModule],
  templateUrl: './board-theme.component.html',
  styleUrl: './board-theme.component.scss'
})
export class BoardThemeComponent implements OnInit {
  boards: (TaskTheme & { taskCount: number })[] = []; // Добавляем поле taskCount
  selectedBoard?: TaskTheme;
  newBoard = "";

  constructor(
    private darkModeService: DarkModeService,
    private taskThemeService: TaskThemeService,
    private taskService: TaskService, // Подключаем TaskService
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.darkModeService.initTheme();

    // Загрузка бордов
    this.taskThemeService.getAllThemes().subscribe((boards) => {
      this.boards = boards.map((board) => ({ ...board, taskCount: 0 }));
      // Обновляем подсчет задач для всех бордов
      this.updateTaskCounts();

      // Установим первый борт как выбранный, если есть данные
      if (this.boards.length > 0) {
        this.selectedBoard = this.boards[0];
      }
    });
  }

  selectBoard(board: TaskTheme): void {
    this.selectedBoard = board;
    // Здесь можно вызывать обновление задач для выбранного борда
  }

  updateBoard(theme: TaskTheme): void {
    const dialogRef = this.dialog.open(EditThemeComponent, {
      data: theme,
      height: '650px',
      width: '800px',
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }

  addBoard(): void {
    if (this.newBoard.trim()) {
      const newTheme: TaskTheme = {
        id: uuidv4(),
        title: this.newBoard.trim(),
      };
      this.taskThemeService.addTheme(newTheme).subscribe(() => {
        this.boards.push({ ...newTheme, taskCount: 0 });
        this.newBoard = '';
      });
    } else {
      console.error('Название доски не может быть пустым');
    }
  }

  deleteBoard(theme: TaskTheme): void {
    this.taskThemeService.deleteTheme(theme.id).subscribe(() => {
      this.boards = this.boards.filter((board) => board.id !== theme.id);
    });
  }

  /**
   * Обновляет количество задач для каждого борда.
   */
  updateTaskCounts(): void {
    this.boards.forEach((board) => {
      this.taskService.getTasksByBoard(board.id).subscribe((tasks) => {
        const boardToUpdate = this.boards.find((b) => b.id === board.id);
        if (boardToUpdate) {
          boardToUpdate.taskCount = tasks.length;
        }
      });
    });
  }
}


@Component({
  selector: 'edit-theme',
  templateUrl: 'edit-theme.html',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [NgbModule, MatDialogModule, MatButtonModule, MatFormFieldModule,  MatIconModule, MatSelectModule, FormsModule],
})
export class EditThemeDialog {
  constructor(
    public dialogRef: MatDialogRef<EditThemeDialog>,
    @Inject(MAT_DIALOG_DATA) public data: TaskTheme
  ) {}

  onCancelClick(): void {
    this.dialogRef.close();
  }

  onSaveClick(): void {
    this.dialogRef.close(this.data);
  }
}