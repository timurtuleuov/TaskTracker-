import { Injectable } from '@angular/core';
import { Task } from '../interface/task.interface';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { TaskStatus } from '../interface/task-status';
import { TaskThemeService } from './taskTheme/task-theme.service';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private readonly localStorageKey = 'tasks';
  private tasks$: BehaviorSubject<Task[]> = new BehaviorSubject<Task[]>(this.getTasks());

  constructor(private taskThemeService: TaskThemeService) {}

  getTasks(): Task[] {
    if (typeof localStorage !== 'undefined') {
      const tasksString = localStorage.getItem(this.localStorageKey);
      return tasksString ? JSON.parse(tasksString) : [];
    } else {
      return [];
    }
  }

  private saveTasks(tasks: Task[]): void {
    localStorage.setItem(this.localStorageKey, JSON.stringify(tasks));
    this.tasks$.next(tasks); 
  }

  getTasksByStatus(status: TaskStatus): Observable<Task[]> {
    return this.tasks$.pipe(
      map(tasks => tasks.filter(task => task.status === status))
    );
  }
  getTaskById(id: string): Observable<Task | any> {
    return this.tasks$.pipe(
      map(tasks => tasks.find(task => task.id === id))
    );
  }
  getTasksByBoard(boardId: string): Observable<Task[]> {
    return this.tasks$.pipe(
      map(tasks => tasks.filter(task => task.board && task.board.id === boardId))
    );
  }
  addTask(newTask: Task): void {
    if (!newTask.board) {
      newTask.board = this.taskThemeService.getOrCreateDefaultTheme(); // Assign default theme if undefined
    }
    const tasks = this.getTasks();
    tasks.push(newTask);
    this.saveTasks(tasks);
  }

  deleteTask(taskToDelete: Task): void {
    let tasks = this.getTasks();
    tasks = tasks.filter(task => task.id !== taskToDelete.id);
    this.saveTasks(tasks);
  }
  
  updateTask(updatedTask: Task): void {
    if (updatedTask) { 
      let tasks = this.getTasks();
      tasks = tasks.map(task => (task.id === updatedTask.id ? updatedTask : task));
      this.saveTasks(tasks);
    } else {
      console.error('Cannot update task: updatedTask is undefined');
    }
  }
}
