import { Component, OnInit } from '@angular/core';
import { NgModule } from '@angular/core';
import { GANTT_GLOBAL_CONFIG, GanttItem, GanttBarClickEvent,
  GanttDragEvent,
  GanttLineClickEvent,
  GanttLinkDragEvent,
  
  NgxGanttComponent,
  GanttSelectedEvent, NgxGanttModule, 
  registerView} from '@worktile/gantt';
import { TaskService } from '../../service/task.service';
import { Task } from '../../interface/task.interface';
import { fr } from 'date-fns/locale';
import { GanttViewCustom } from './custom-day-view';


@Component({
  selector: 'app-timeline',
  standalone: true,
  imports: [NgxGanttModule],
  providers: [
    {
      provide: GANTT_GLOBAL_CONFIG,
      useValue: {
        dateFormat: {
        yearQuarter: `QQQQ 'of' yyyy`,
          month: 'LLLL',
          yearMonth: `LLLL yyyy'(week' w ')'`,
        },
        dateOptions: {
          locale: fr,
          weekStartsOn: 1
     }
      }
    }],
  templateUrl: './timeline.component.html',
  styleUrl: './timeline.component.scss'
})
export class TimelineComponent implements OnInit{
  
  tasks: Task[] = []
  items: GanttItem[] = []
  viewOptions = {
    showWeekend: true
  };
  // [
  //   { id: '000000', title: 'Task 0', start: 1627729997, end: 1628421197, expandable: true },
  //   { id: '000001', title: 'Task 1', start: 1617361997, end: 1625483597, links: ['000003', '000004', '000000'], expandable: true },
  //   { id: '000002', title: 'Task 2', start: 1610536397, end: 1610622797 },
  //   { id: '000003', title: 'Task 3', start: 1628507597, end: 1633345997, expandable: true }
  // ];
  constructor(public taskService: TaskService){}

  ngOnInit(): void {
    this.tasks = this.taskService.getTasks()
    this.tasks.forEach((task) =>{
      let newItem: GanttItem = {
        id: task.id,
        title: task.title,
        start: new Date(task.start).getTime(),
        end: new Date(task.deadline).getTime(),
        expandable: true
      }
      this.items.push(newItem)
    })
      
  }
  
  
}
