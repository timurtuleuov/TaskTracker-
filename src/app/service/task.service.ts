import { Injectable } from '@angular/core';
import { Task } from '../interface/task.interface';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private readonly localStorageKey = 'tasks';

  constructor() { }

  // Получить таски из localStorage
  getTasks(): Task[] {
    const tasksString = localStorage.getItem(this.localStorageKey);
    return tasksString ? JSON.parse(tasksString) : [];
  }

  // Сохранить таски в localStorage
  saveTasks(tasks: Task[]): void {
    localStorage.setItem(this.localStorageKey, JSON.stringify(tasks));
  }

  // Добавить новый таск
  addTask(newTask: Task): void {
    const tasks = this.getTasks();
    tasks.push(newTask);
    this.saveTasks(tasks);
  }

  // Удалить таск
  deleteTask(taskToDelete: Task): void {
    let tasks = this.getTasks();
    tasks = tasks.filter(task => task !== taskToDelete);
    this.saveTasks(tasks);
  }

  // Обновить таск
  updateTask(updatedTask: Task): void {
    let tasks = this.getTasks();
    tasks = tasks.map(task => (task === updatedTask ? updatedTask : task));
    this.saveTasks(tasks);
  }
}
