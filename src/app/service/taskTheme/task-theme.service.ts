import { Injectable, Injector } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { TaskTheme } from '../../interface/task-theme.interface';
import { Task } from '../../interface/task.interface';
import { TaskService } from '../task.service';

@Injectable({
  providedIn: 'root'
})
export class TaskThemeService {
  private readonly localStorageKey = 'taskThemes';
  private themes$: BehaviorSubject<TaskTheme[]> = new BehaviorSubject<TaskTheme[]>(this.getThemes());
  private taskService: TaskService | null = null;

  constructor(private injector: Injector) {
    this.getOrCreateDefaultTheme();
  }

  // Отложенное внедрение TaskService
  private getTaskService(): TaskService {
    if (!this.taskService) {
      this.taskService = this.injector.get(TaskService);
    }
    return this.taskService;
  }

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
    
    // Используем отложенное внедрение TaskService
    this.getTaskService().deleteTasksByBoard(themeId);
    this.saveThemes(themes);
  }

  updateTheme(updatedTheme: TaskTheme): void {
    let themes = this.getThemes();
    themes = themes.map(theme => (theme.id === updatedTheme.id ? updatedTheme : theme));
    this.saveThemes(themes);
  }

  getOrCreateDefaultTheme(): TaskTheme {
    let themes = this.getThemes();
    let defaultTheme = themes.find(theme => theme.title === 'Без темы');
    if (!defaultTheme) {
      defaultTheme = { id: 'default', title: 'Без темы' };
      this.addTheme(defaultTheme);
    }
    return defaultTheme;
  }
  getThemeById(id: string): TaskTheme {
    let themes = this.getThemes();
    const board = themes.filter(theme => theme.id !== id)
    return board[0]
  }
}