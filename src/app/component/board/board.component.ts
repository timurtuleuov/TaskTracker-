import { AfterViewInit, ChangeDetectorRef, Component, HostListener, Inject, NgZone, OnInit } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatMenuModule} from '@angular/material/menu';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {DateAdapter, MatNativeDateModule, provideNativeDateAdapter} from '@angular/material/core';
import {MatInputModule} from '@angular/material/input';
import { NgbCalendar, NgbDatepickerModule, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import {
  CdkDragDrop,
  CdkDrag,
  CdkDropList,
  CdkDropListGroup,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Task } from '../../interface/task.interface';
import {MatDatepickerInputEvent, MatDatepickerModule} from '@angular/material/datepicker';
import { TaskService } from '../../service/task.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EditTaskComponent } from './layers/edit-task/edit-task.component';
import { Observable } from 'rxjs';
import { TaskStatus } from '../../interface/task-status';
import { v4 as uuidv4 } from 'uuid';
import {RouterModule} from '@angular/router';
import { DarkModeService } from '../../service/darkMode/dark-mode.service';
import { TaskTheme } from '../../interface/task-theme.interface';
import { TaskThemeService } from '../../service/taskTheme/task-theme.service';
import { CommonModule } from '@angular/common';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { AppDateAdapter, APP_DATE_FORMATS } from '../../datepicker custom/customDateFomat';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask'
import {MatChipsModule} from '@angular/material/chips';
import {MatSidenavModule} from '@angular/material/sidenav';



@Component({
  selector: 'app-board',
  standalone: true,
  imports: [CdkDropListGroup, CdkDropList, CdkDrag, NgbModule, MatIconModule, MatButtonModule, 
    MatMenuModule, MatDialogModule, RouterModule, MatInputModule, MatSelectModule, CommonModule,NgbDatepickerModule,
    MatDatepickerModule, MatNativeDateModule, FormsModule, ReactiveFormsModule,
    PickerComponent, NgxMaskDirective, NgxMaskPipe, MatChipsModule, MatSidenavModule], 
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss',
  providers: [
    {provide: DateAdapter, useClass: AppDateAdapter},
    {provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS},
    provideNgxMask(), NgxMaskDirective,
  ]
})
export class BoardComponent implements OnInit, AfterViewInit {
  todo!: Task[];
  doing!: Task[];
  done!: Task[];
  isDataLoaded = false;
  boards!: TaskTheme[];
  selectedBoard: string = "Без темы";
  activeEmojiPickerId: string | null = null; 
  darkMode!: boolean;
  tagColors = ['#F87171', '#60A5FA', '#FBBF24', '#34D399', '#A78BFA', '#F472B6', '#CD5C5C', '#CCCCFF', '#DE3163', '#40E0D0', '#6c3483', '#17a589', '#7fb3d5'];
  tagColorMap: { [tagTitle: string]: string } = {};
  

  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });
   mask: string = 'd0/M0/0000';
  startDate?: Date
  endDate?: Date
  constructor(
    private dialog: MatDialog,
    private taskService: TaskService,
    private darkModeService: DarkModeService,
    private taskThemeService: TaskThemeService,
    private cdr: ChangeDetectorRef,
    private zone: NgZone,
    public maskDirective: NgxMaskDirective
  ) {}

  toggleEmojiPicker(taskId: string): void {
    this.activeEmojiPickerId = this.activeEmojiPickerId === taskId ? null : taskId;
  }

  addEmoji(event: any, task: Task): void {
    task.emoji = event.emoji.native; 
    this.taskService.updateTask(task); 
    this.activeEmojiPickerId = null; 
  }

  ngOnInit(): void {
    this.maskDirective.maskExpression = '+0 (000) 000 00 00';
    this.darkModeService.initTheme();
    this.darkModeService.darkMode$.subscribe(darkMode => {
      this.zone.run(() => {
        this.darkMode = darkMode;
        this.cdr.detectChanges();
      });
    });

    const savedStartDate = localStorage.getItem("startDate");
  const savedEndDate = localStorage.getItem("endDate");
    this.startDate = savedStartDate ? new Date(savedStartDate) : undefined;
  this.endDate = savedEndDate ? new Date(savedEndDate) : undefined;
    this.taskThemeService.getAllThemes().subscribe(boards => {
      this.boards = boards;
      const savedBoardId = localStorage.getItem("selectedBoard");
      if (savedBoardId && boards.some(board => board.id === savedBoardId)) {
        this.selectedBoard = savedBoardId;
      } else if (boards.length > 0) {
        this.selectedBoard = boards[0].id;
      }
      this.loadTasks();
    });
    this.assignTagColors();
  }

  assignTagColors(): void {
    const allTasks = [...this.todo, ...this.doing, ...this.done];
    allTasks.forEach(task => {
      if (task.tags && Array.isArray(task.tags)) { 
        task.tags.forEach(tag => {
          if (!this.tagColorMap[tag.title]) {
            this.tagColorMap[tag.title] = this.getRandomColor(); 
          }
        });
      }
    });
  }
  

  ngAfterViewInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    const boardId = this.selectedBoard === "Без темы" ? null : this.selectedBoard;
  
    if (boardId) {
      this.taskService.getTasksByBoard(boardId).subscribe(tasks => {
        const filteredTasks = this.filterTasksByDateRange(tasks, this.startDate, this.endDate);
  
        this.todo = filteredTasks.filter(task => task.status === TaskStatus.Todo);
        this.doing = filteredTasks.filter(task => task.status === TaskStatus.Doing);
        this.done = filteredTasks.filter(task => task.status === TaskStatus.Done);
  
        this.isDataLoaded = true;
        this.cdr.detectChanges();
      });
    } else {
      const filterByStatus = (status: TaskStatus) =>
        this.taskService.getTasksByStatus(status).subscribe(tasks => {
          const filteredTasks = this.filterTasksByDateRange(tasks, this.startDate, this.endDate);
          if (status === TaskStatus.Todo) this.todo = filteredTasks;
          if (status === TaskStatus.Doing) this.doing = filteredTasks;
          if (status === TaskStatus.Done) this.done = filteredTasks;
          this.cdr.detectChanges();
        });
  
      filterByStatus(TaskStatus.Todo);
      filterByStatus(TaskStatus.Doing);
      filterByStatus(TaskStatus.Done);
  
      this.isDataLoaded = true;
      
    }
  }
  filterTasksByDateRange(tasks: Task[], startDate?: Date, endDate?: Date): Task[] {

    if (!startDate && !endDate) return tasks; 

    return tasks.filter(task => {
        const taskStart = task.start ? new Date(task.start) : null;
        const taskEnd = task.deadline ? new Date(task.deadline) : null;

        const isValidStart = taskStart && !isNaN(taskStart.getTime());
        const isValidEnd = taskEnd && !isNaN(taskEnd.getTime());

        if (!isValidStart && !isValidEnd) {
            return false;
        }

        const isWithinStart = startDate && isValidStart ? taskStart >= startDate : true;
        const isWithinEnd = endDate && isValidEnd ? taskEnd <= endDate : true;

        return isWithinStart && isWithinEnd;
    });
}

  
  
  onBoardChange(boardId: string): void {
    this.selectedBoard = boardId;
    localStorage.setItem("selectedBoard", this.selectedBoard);
    this.loadTasks();
  }

  onTimeRangeChange(): void {
    this.startDate = this.range.value.start ? new Date(this.range.value.start) : undefined;
    this.endDate = this.range.value.end ? new Date(this.range.value.end) : undefined;
  
    localStorage.setItem("startDate", this.startDate ? this.startDate.toISOString() : '');
    localStorage.setItem("endDate", this.endDate ? this.endDate.toISOString() : '');
  
    this.loadTasks();
  }

  drop(event: CdkDragDrop<Task[]>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );

      const thisTask = { ...event.container.data[event.currentIndex] };

      if (event.container.id === 'cdk-drop-list-0') {
        thisTask.status = TaskStatus.Todo;
      } else if (event.container.id === 'cdk-drop-list-1') {
        thisTask.status = TaskStatus.Doing;
      } else if (event.container.id === 'cdk-drop-list-2') {
        thisTask.status = TaskStatus.Done;
      }

      this.taskService.updateTask(thisTask);
    }
  }

  addTask(status: string): void {
    const newTask: Task = {
      id: uuidv4(),
      title: 'New Task',
      description: '',
      start: new Date().toISOString(),
      deadline: '',
      priority: '',
      status: TaskStatus.Todo,
      executor: '',
      board: this.selectedBoard === "Без темы" ? undefined : { id: this.selectedBoard, title: '' }
    };

    switch (status) {
      case 'todo':
        newTask.status = TaskStatus.Todo;
        break;
      case 'doing':
        newTask.status = TaskStatus.Doing;
        break;
      case 'done':
        newTask.status = TaskStatus.Done;
        break;
      default:
        console.error('Invalid status provided');
        return;
    }
  
    const dialogRef = this.dialog.open(EditTaskComponent, {
      data: newTask,
      
      width: '800px',
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.taskService.addTask(result);
      } else {
        console.log('Task creation canceled');
      }
    });
  }

  editTask(task: Task): void {
    const taskCopy = { ...task };
  
    const dialogRef = this.dialog.open(EditTaskComponent, {
      data: taskCopy,
      
      width: '800px',
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.taskService.updateTask(result);
      } 
    });
  }

  deleteTask(task: Task): void {
    this.taskService.deleteTask(task);
  }

  duplicateTask(taskToDuplicate: Task): void {
    const duplicatedTask: Task = { ...taskToDuplicate };
    duplicatedTask.id = uuidv4();
    this.taskService.addTask(duplicatedTask);
  }

  trackByFn(index: number, item: any): any {
    return item.id; 
  }

  getRandomColor(): string {
    const randomIndex = Math.floor(Math.random() * this.tagColors.length);
    return this.tagColors[randomIndex];
  }

  getTaskStyle(task: Task): { [key: string]: string } {
    const now = new Date().getTime();
    const deadline = task.deadline ? new Date(task.deadline).getTime() : null;
  
    if (!deadline) {
      return {}; 
    }
  
    const diff = deadline - now; 
    const daysDiff = diff / (1000 * 60 * 60 * 24);
  
  
    if (daysDiff >= 7) {
      return {};
    }
  

    if (daysDiff <= 0) {
      return { backgroundColor: 'rgba(255, 0, 0, 0.8)' };
    }
  

    const intensity = Math.max(0, Math.min(1, 1 - daysDiff / 7)); 
    const red = Math.floor(255 * intensity);
    const green = Math.floor(255 * (1 - intensity));
    const blue = 0;
  
    return {
      backgroundColor: `rgb(${red}, ${green}, ${blue})`
    };
  }
  
  exportLocalStorage() {
    // Получаем все данные из localStorage
    const localStorageData = { ...localStorage };

    // Преобразуем данные в JSON-строку
    const dataStr = JSON.stringify(localStorageData, null, 2);

    // Создаем Blob с данными
    const blob = new Blob([dataStr], { type: 'application/json' });

    // Создаем ссылку для скачивания файла
    const url = window.URL.createObjectURL(blob);

    // Создаем временный элемент для ссылки
    const a = document.createElement('a');
    a.href = url;
    a.download = 'localStorage_backup.json';

    // Кликаем на ссылку для скачивания
    a.click();

    // Освобождаем память
    window.URL.revokeObjectURL(url);
  }

  importLocalStorage(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    const file = fileInput.files?.[0];

    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        // Читаем данные из файла
        const importedData = JSON.parse(reader.result as string);

        // Проверяем, что это объект
        if (typeof importedData === 'object' && importedData !== null) {
          // Добавляем данные к существующим
          for (const key in importedData) {
            localStorage.setItem(key, importedData[key]);
          }
          alert('Данные успешно импортированы в localStorage!');
        } else {
          alert('Файл не содержит корректных данных для импорта.');
        }
      } catch (error) {
        alert('Произошла ошибка при обработке файла: ' + error);
      }
    };

    reader.readAsText(file);
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.emoji-mart') && !target.classList.contains('img')) {
      this.activeEmojiPickerId = null;
    }
  }

  @HostListener('window:keydown', ['$event'])
  createNewDoingTask(event: KeyboardEvent) {
    if ((event.ctrlKey || event.metaKey) && (event.key.toLowerCase() === 'b' || event.key.toLowerCase() === 'и')) {
      event.preventDefault();
      this.addTask('doing');
    }
  }
}



@Component({
  selector: 'edit-task',
  templateUrl: 'edit-task.html',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [NgbModule, MatDialogModule, MatButtonModule, MatFormFieldModule,  MatIconModule, MatSelectModule, MatDatepickerModule, NgbDatepickerModule, FormsModule],
})
export class EditTaskDialog {
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

