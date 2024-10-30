import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DarkModeService {

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
    if (this.isDarkMode()) {
      this.disableDarkMode();
    } else {
      this.enableDarkMode();
    }
  }

  initTheme(): void {
    if (this.isDarkMode()) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }
}

