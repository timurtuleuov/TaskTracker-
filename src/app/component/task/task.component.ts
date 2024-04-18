import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TaskService } from '../../service/task.service';
import { Task } from '../../interface/task.interface';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [CommonModule],
  providers: [DatePipe],
  templateUrl: './task.component.html',
  styleUrl: './task.component.scss'
})
export class TaskComponent implements OnInit{
  constructor(private route: ActivatedRoute, private taskService: TaskService) {}
  task!: Task;
  ngOnInit() {
    this.route.params.subscribe(params => {
      const slug = params['slug'];
      this.taskService.getTaskById(slug).subscribe(
        (task) => this.task = task,
        (error) => console.log("Нету такого id")
      )
    });
  }
}
