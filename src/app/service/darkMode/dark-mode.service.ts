import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DarkModeService {
  private darkModeSubject = new BehaviorSubject<boolean>(this.isDarkMode());
  darkMode$ = this.darkModeSubject.asObservable();
  constructor() { }

  isDarkMode(): boolean {
    if (typeof window !== 'undefined' && localStorage) {
      return localStorage.getItem('theme') === 'dark' ||
        (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false; // возвращаем значение по умолчанию, если localStorage недоступен
  }

  enableDarkMode(): void {
    if (typeof window !== 'undefined' && localStorage) {
      document.body.classList.add('dark');     
      localStorage.setItem('theme', 'dark');
    }
  }

  disableDarkMode(): void {
    if (typeof window !== 'undefined' && localStorage) {
      document.body.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }

  toggleDarkMode(): void {
    const darkMode = !this.isDarkMode();
    localStorage.setItem('darkMode', darkMode ? 'true' : 'false');
    this.darkModeSubject.next(darkMode); // Обновляем состояние темы
    this.updateTheme(darkMode);
  }

  initTheme(): void {
    if (this.isDarkMode()) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }
  private updateTheme(darkMode: boolean): void {
    document.body.classList.toggle('dark-mode', darkMode);
  }
}

