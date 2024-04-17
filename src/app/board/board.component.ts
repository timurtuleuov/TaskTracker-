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
@Component({
  selector: 'app-board',
  standalone: true,
  imports: [CdkDropListGroup, CdkDropList, CdkDrag, NgbModule, MatIconModule, MatButtonModule, MatMenuModule],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss'
})
export class BoardComponent {
  todo = ['Get to work', 'Pick up groceries', 'Go home', 'Fall asleep'];
  doing: string[] = []
  done = ['Get up', 'Brush teeth', 'Take a shower', 'Check e-mail', 'Walk dog'];

  drop(event: CdkDragDrop<string[]>) {
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
    switch(status) {
        case 'todo':
            this.todo.push('New Task');
            break;
        case 'doing':
            this.doing.push('New Task');
            break;
        case 'done':
            this.done.push('New Task');
            break;
        default:
            console.error('Invalid status provided');
            break;
    }
}
}
