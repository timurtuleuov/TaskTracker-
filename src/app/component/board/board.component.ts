import { Component, Inject } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatMenuModule} from '@angular/material/menu';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {provideNativeDateAdapter} from '@angular/material/core';
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
import { FormsModule } from '@angular/forms';
import { EditTaskComponent } from './layers/edit-task/edit-task.component';
import { Observable } from 'rxjs';
import { TaskStatus } from '../../interface/task-status';
import { v4 as uuidv4 } from 'uuid';
import {RouterModule} from '@angular/router';
@Component({
  selector: 'app-board',
  standalone: true,
  imports: [CdkDropListGroup, CdkDropList, CdkDrag, NgbModule, MatIconModule, MatButtonModule, MatMenuModule, MatDialogModule, RouterModule],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss'
})
export class BoardComponent {
  todo!: Task[];
  doing!: Task[];
  done!: Task[];

  constructor(private dialog: MatDialog, private taskService: TaskService){}

  ngOnInit(): void {
    this.taskService.getTasksByStatus(TaskStatus.Todo)
      .subscribe(tasks => this.todo = tasks);

    this.taskService.getTasksByStatus(TaskStatus.Doing)
      .subscribe(tasks => this.doing = tasks);

    this.taskService.getTasksByStatus(TaskStatus.Done)
      .subscribe(tasks => this.done = tasks);
  
  }

  drop(event: CdkDragDrop<Task[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
      const task = event.item.data;
      console.log(event.item.element)
      const thisTask = JSON.parse(JSON.stringify(event.container.data[event.currentIndex]))
      console.log(thisTask)
      console.log("id контейнера",event.container.id)

      if (event.container.id === 'cdk-drop-list-0') {
        thisTask.status = TaskStatus.Todo;
      } else if (event.container.id === 'cdk-drop-list-1') {
        console.log('DOING')
        thisTask.status = TaskStatus.Doing;
      } else if (event.container.id === 'cdk-drop-list-2') {
        thisTask.status = TaskStatus.Done;
        console.log("HERE IS DONE")
      }
  
      this.taskService.updateTask(thisTask)
      
    
  }
    
  }
  addTask(status: string) {
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
    switch(status) {
        case 'todo':
          newTask.status = TaskStatus.Todo
            this.taskService.addTask(newTask)
            
            break;
        case 'doing':
          newTask.status = TaskStatus.Doing
          this.taskService.addTask(newTask)
          
            break;
        case 'done':
          newTask.status = TaskStatus.Done
          this.taskService.addTask(newTask)
            break;
        default:
            console.error('Invalid status provided');
            break;
    }
    this.editTask(newTask);
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
  }

  duplicateTask(taskToDuplicate: Task): void {
    const duplicatedTask: Task = { ...taskToDuplicate };
  
    duplicatedTask.id = uuidv4();
    this.taskService.addTask(duplicatedTask)
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
  constructor(
    public dialogRef: MatDialogRef<EditTaskDialog>,
    @Inject(MAT_DIALOG_DATA) public data: Task
  ) {}

  onCancelClick(): void {
    this.dialogRef.close();
  }

  onSaveClick(): void {
    this.dialogRef.close(this.data);
  }
}