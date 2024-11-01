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
@Component({
  selector: 'app-board-theme',
  standalone: true,
  imports: [NgbModule, MatInputModule, FormsModule],
  templateUrl: './board-theme.component.html',
  styleUrl: './board-theme.component.scss'
})
export class BoardThemeComponent implements OnInit {
  boards: TaskTheme[] = [];
  selectedBoard?: TaskTheme;
  newBoard = "";
  constructor(
    private darkModeService: DarkModeService, 
    private taskThemeService: TaskThemeService,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.darkModeService.initTheme();

    // Загрузка бордов
    this.taskThemeService.getAllThemes().subscribe((boards) => {
      this.boards = boards;
      // Установим первый борт как выбранный, если есть данные
      if (boards.length > 0) {
        this.selectedBoard = boards[0];
      }
    });
  }

  selectBoard(board: TaskTheme): void {
    this.selectedBoard = board;
    // Здесь можно вызывать обновление задач для выбранного борда


  }
  updateBoard(theme: TaskTheme)  {
    const dialogRef = this.dialog.open(EditThemeComponent, {
      data: theme, 
      height: '650px',
      width: '800px',
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
  addBoard() {
    if (this.newBoard.trim()) {
      // Логика для добавления новой доски
      const newTheme: TaskTheme = {
        id: uuidv4(),
        title: this.newBoard.trim(),
      };
      this.taskThemeService.addTheme(newTheme)
      
      this.newBoard = '';
    } else {
      console.error('Название доски не может быть пустым');
    }
    // 
  } 
  deleteBoard(theme: TaskTheme) {
    this.taskThemeService.deleteTheme(theme.id)
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