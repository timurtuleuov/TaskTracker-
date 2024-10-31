import { Component, OnInit } from '@angular/core';
import { TaskTheme } from '../../interface/task-theme.interface';
import { DarkModeService } from '../../service/darkMode/dark-mode.service';
import { TaskThemeService } from '../../service/taskTheme/task-theme.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { v4 as uuidv4 } from 'uuid';
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
    private taskThemeService: TaskThemeService
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
  createBoard() {
   
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
}

