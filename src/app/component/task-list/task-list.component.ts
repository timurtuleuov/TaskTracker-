import { Component, OnInit, ViewChild } from '@angular/core';
import { Task } from '../../interface/task.interface';
import { TaskService } from '../../service/task.service';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { CommonModule, DatePipe } from '@angular/common';
import { TranslatePipe } from "../../pipe/translate.pipe";
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { EditTaskComponent } from '../board/layers/edit-task/edit-task.component';
import { TaskStatus } from '../../interface/task-status';
import { v4 as uuidv4 } from 'uuid';
import { DarkModeService } from '../../service/darkMode/dark-mode.service';
@Component({
  selector: 'app-task-list',
  standalone: true,
  providers: [DatePipe, TranslatePipe],
  imports: [CommonModule, MatFormFieldModule, MatInputModule, MatTableModule, MatSortModule, MatPaginatorModule, TranslatePipe, MatIconModule, MatButtonModule, MatMenuModule, MatDialogModule, RouterModule],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss'
})
export class TaskListComponent implements OnInit{
  task: Task[] = []

  constructor(private taskService: TaskService, private dialog: MatDialog, private darkModeService: DarkModeService){
    
  }

  ngOnInit(): void {
    this.darkModeService.initTheme();
    this.task = this.taskService.getTasks()
    this.dataSource = new MatTableDataSource(this.task);
    
  }
  displayedColumns: string[] = ['title', 'description', 'start', 'deadline', 'priority', 'status', 'operation'];
  dataSource!: MatTableDataSource<Task>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;


  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  addTask() {
    const newTask: Task = {
      id: uuidv4(),
      title: 'New Task',
      description: '',
      start: '',
      deadline: '',
      priority: '',
      status: TaskStatus.Todo,
      executor: ''
  };
    this.taskService.addTask(newTask)
    window.location.reload()

  }

  editTask(task: Task) {
    const dialogRef = this.dialog.open(EditTaskComponent, {
      data: task, 
      height: '650px',
      width: '800px',
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  deleteTask(task: Task): void{
    this.taskService.deleteTask(task);
    window.location.reload()
  }
  duplicateTask(taskToDuplicate: Task): void {
    const duplicatedTask: Task = { ...taskToDuplicate };
  
    duplicatedTask.id = uuidv4();
    this.taskService.addTask(duplicatedTask)
    window.location.reload()
  }
}



