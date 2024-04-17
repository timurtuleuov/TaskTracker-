import { Component } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatMenuModule} from '@angular/material/menu';
import {
  CdkDragDrop,
  CdkDrag,
  CdkDropList,
  CdkDropListGroup,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { Task } from '../interface/task.interface';
@Component({
  selector: 'app-board',
  standalone: true,
  imports: [CdkDropListGroup, CdkDropList, CdkDrag, NgbModule, MatIconModule, MatButtonModule, MatMenuModule],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss'
})
export class BoardComponent {
  todo: Task[] = [];
  doing: Task[] = [];
  done: Task[] = [];

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
    }
  }
  addTask(status: string) {
    const newTask: Task = {
      title: 'New Task',
      name: '',
      deadline: '',
      priority: '',
      status: '',
      executor: ''
  };
    switch(status) {
        case 'todo':
            
            this.todo.push(newTask);
            break;
        case 'doing':
            this.doing.push(newTask);
            break;
        case 'done':
            this.done.push(newTask);
            break;
        default:
            console.error('Invalid status provided');
            break;
    }
}
}
