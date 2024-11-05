import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DarkModeService {
  private darkModeSubject = new BehaviorSubject<boolean>(this.isDarkMode());
  darkMode$ = this.darkModeSubject.asObservable();

  constructor(@Inject(PLATFORM_ID) private platformId: object) {
    this.initTheme();
  }

  isDarkMode(): boolean {
    if (isPlatformBrowser(this.platformId) && localStorage) {
      return localStorage.getItem('theme') === 'dark' ||
        (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  }

  enableDarkMode(): void {
    if (isPlatformBrowser(this.platformId) && localStorage) {
      document.body.classList.add('dark');     
      localStorage.setItem('theme', 'dark');
      this.darkModeSubject.next(true);
    }
  }

  disableDarkMode(): void {
    if (isPlatformBrowser(this.platformId) && localStorage) {
      document.body.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      this.darkModeSubject.next(false);
    }
  }

  toggleDarkMode(): void {
    const darkMode = !this.isDarkMode();
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('theme', darkMode ? 'dark' : 'light');
      this.darkModeSubject.next(darkMode);
      this.updateTheme(darkMode);
    }
  }

  initTheme(): void {
    if (isPlatformBrowser(this.platformId)) {
      const darkMode = this.isDarkMode();
      this.updateTheme(darkMode);
    }
  }

  private updateTheme(darkMode: boolean): void {
    if (isPlatformBrowser(this.platformId)) {
      document.body.classList.toggle('dark', darkMode);
    }
  }
}
