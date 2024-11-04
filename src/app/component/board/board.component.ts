import { AfterViewInit, ChangeDetectorRef, Component, HostListener, Inject, OnInit } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatMenuModule} from '@angular/material/menu';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatNativeDateModule, provideNativeDateAdapter} from '@angular/material/core';
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
import {MatDatepickerModule} from '@angular/material/datepicker';
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
@Component({
  selector: 'app-board',
  standalone: true,
  imports: [CdkDropListGroup, CdkDropList, CdkDrag, NgbModule, MatIconModule, MatButtonModule, MatMenuModule, MatDialogModule, RouterModule, MatInputModule, MatSelectModule, CommonModule], 
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss'
})
export class BoardComponent implements OnInit, AfterViewInit {
  todo!: Task[];
  doing!: Task[];
  done!: Task[];

  isDataLoaded = false;

  boards!: TaskTheme[];
  selectedBoard: string = "Без темы";

  constructor(
    private dialog: MatDialog, 
    private taskService: TaskService, 
    private darkModeService: DarkModeService, 
    private taskThemeService: TaskThemeService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.darkModeService.initTheme();

    // Load boards
    this.taskThemeService.getAllThemes().subscribe(
      boards => {
        this.boards = boards;

        // Load selected board from localStorage, or default to "Без темы"
        const savedBoardId = localStorage.getItem("selectedBoard");
        if (savedBoardId && boards.some(board => board.id === savedBoardId)) {
          this.selectedBoard = savedBoardId;
        } else if (boards.length > 0) {
          // If no valid saved board, select the first board
          this.selectedBoard = boards[0].id;
        }

        this.loadTasks();
      }
    );
  }

  ngAfterViewInit(): void {
    // Load tasks after view is initialized
    this.loadTasks();
  }

  loadTasks(): void {
    const boardId = this.selectedBoard === "Без темы" ? null : this.selectedBoard;

    if (boardId) {
      this.taskService.getTasksByBoard(boardId).subscribe(tasks => {
        this.todo = tasks.filter(task => task.status === TaskStatus.Todo);
        this.doing = tasks.filter(task => task.status === TaskStatus.Doing);
        this.done = tasks.filter(task => task.status === TaskStatus.Done);
        
        this.isDataLoaded = true;
        this.cdr.detectChanges();
      });
    } else {
      // If no board selected, load tasks by status
      this.taskService.getTasksByStatus(TaskStatus.Todo).subscribe(tasks => this.todo = tasks);
      this.taskService.getTasksByStatus(TaskStatus.Doing).subscribe(tasks => this.doing = tasks);
      this.taskService.getTasksByStatus(TaskStatus.Done).subscribe(tasks => this.done = tasks);

      this.isDataLoaded = true;
      this.cdr.detectChanges();
    }
  }

  onBoardChange(boardId: string): void {
    this.selectedBoard = boardId;
    // Save the selected board ID to localStorage
    localStorage.setItem("selectedBoard", this.selectedBoard);
    this.loadTasks(); // Reload tasks for the new selected board
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

      // Update task status based on drop container
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
      start: '',
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
  
    // Open edit dialog with the new task
    const dialogRef = this.dialog.open(EditTaskComponent, {
      data: newTask,
      height: '650px',
      width: '800px',
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // If user clicks "Save," add the task
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
      height: '650px',
      width: '800px',
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.taskService.updateTask(result);
      } else {
        console.log('Изменения отменены');
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

  // Shortcuts
  @HostListener('window:keydown', ['$event'])
  createNewDoingTask(event: KeyboardEvent) {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'b' || (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'и') {
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