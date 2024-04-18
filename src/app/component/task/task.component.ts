import { Component, importProvidersFrom, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TaskService } from '../../service/task.service';
import { Task } from '../../interface/task.interface';
import { CommonModule, DatePipe } from '@angular/common';
import { HttpClientModule, HttpClient, provideHttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import localeRu from '@angular/common/locales/ru';
import { TranslatePipe } from "../../pipe/translate.pipe";
export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient);
}
@Component({
    selector: 'app-task',
    standalone: true,
    providers: [DatePipe, TranslatePipe],
    templateUrl: './task.component.html',
    styleUrl: './task.component.scss',
    imports: [CommonModule, HttpClientModule, TranslatePipe]
})
export class TaskComponent implements OnInit{
  constructor(private route: ActivatedRoute, private taskService: TaskService) {
  }
  
  
  task?: Task;
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
