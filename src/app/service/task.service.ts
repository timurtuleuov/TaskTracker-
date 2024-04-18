import { Injectable } from '@angular/core';
import { Task } from '../interface/task.interface';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { TaskStatus } from '../interface/task-status';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private readonly localStorageKey = 'tasks';
  private tasks$: BehaviorSubject<Task[]> = new BehaviorSubject<Task[]>(this.getTasks());

  constructor() {}

  private getTasks(): Task[] {
    if (typeof localStorage !== 'undefined') {
      const tasksString = localStorage.getItem(this.localStorageKey);
      return tasksString ? JSON.parse(tasksString) : [];
    } else {
      // Если localStorage недоступен, вернуть пустой массив или выполнить другие действия по умолчанию
      return [];
    }
  }

  private saveTasks(tasks: Task[]): void {
    localStorage.setItem(this.localStorageKey, JSON.stringify(tasks));
    this.tasks$.next(tasks); // Обновляем поток данных
  }

  getTasksByStatus(status: TaskStatus): Observable<Task[]> {
    return this.tasks$.pipe(
      map(tasks => tasks.filter(task => task.status === status))
    );
  }

  addTask(newTask: Task): void {
    const tasks = this.getTasks();
    tasks.push(newTask);
    this.saveTasks(tasks);
  }

  // Остальные методы для обновления и удаления тасков


  // Удалить таск
  deleteTask(taskToDelete: Task): void {
    let tasks = this.getTasks();
    tasks = tasks.filter(task => task.id !== taskToDelete.id);
    this.saveTasks(tasks);
  }
  
  // Обновить таск
  updateTask(updatedTask: Task): void {
    if (updatedTask) { // Проверяем, что updatedTask не является undefined или null
      let tasks = this.getTasks();
      tasks = tasks.map(task => (task.id === updatedTask.id ? updatedTask : task));
      this.saveTasks(tasks);
    } else {
      console.error('Cannot update task: updatedTask is undefined');
    }
  }
}
