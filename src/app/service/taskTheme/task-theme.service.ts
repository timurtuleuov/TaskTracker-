import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { TaskTheme } from '../../interface/task-theme.interface';
import { Task } from '../../interface/task.interface';

@Injectable({
  providedIn: 'root'
})
export class TaskThemeService {
  private readonly localStorageKey = 'taskThemes';
  private themes$: BehaviorSubject<TaskTheme[]> = new BehaviorSubject<TaskTheme[]>(this.getThemes());

  constructor() {}

  private getThemes(): TaskTheme[] {
    const themesString = localStorage.getItem(this.localStorageKey);
    return themesString ? JSON.parse(themesString) : [];
  }

  private saveThemes(themes: TaskTheme[]): void {
    localStorage.setItem(this.localStorageKey, JSON.stringify(themes));
    this.themes$.next(themes);
  }

  getAllThemes(): Observable<TaskTheme[]> {
    return this.themes$.asObservable();
  }

  addTheme(newTheme: TaskTheme): void {
    const themes = this.getThemes();
    themes.push(newTheme);
    this.saveThemes(themes);
  }

  deleteTheme(themeId: string): void {
    let themes = this.getThemes();
    themes = themes.filter(theme => theme.id !== themeId);
    this.saveThemes(themes);
  }

  updateTheme(updatedTheme: TaskTheme): void {
    let themes = this.getThemes();
    themes = themes.map(theme => (theme.id === updatedTheme.id ? updatedTheme : theme));
    this.saveThemes(themes);
  }

  addTaskToTheme(themeId: string, task: Task): void {
    const themes = this.getThemes();
    const theme = themes.find(t => t.id === themeId);
    if (theme) {
      theme.tasks.push(task);
      this.saveThemes(themes);
    }
  }

  deleteTaskFromTheme(themeId: string, taskId: string): void {
    const themes = this.getThemes();
    const theme = themes.find(t => t.id === themeId);
    if (theme) {
      theme.tasks = theme.tasks.filter(task => task.id !== taskId);
      this.saveThemes(themes);
    }
  }

  updateTaskInTheme(themeId: string, updatedTask: Task): void {
    const themes = this.getThemes();
    const theme = themes.find(t => t.id === themeId);
    if (theme) {
      theme.tasks = theme.tasks.map(task => (task.id === updatedTask.id ? updatedTask : task));
      this.saveThemes(themes);
    }
  }

  getTasksFromTheme(themeId: string): Observable<Task[]> {
    return this.themes$.pipe(
      map((themes) => {
        const theme = themes.find(t => t.id === themeId);
        return theme ? theme.tasks : [];
      })
    );
  }
}
