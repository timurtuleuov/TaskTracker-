import { TestBed } from '@angular/core/testing';

import { TaskThemeService } from './task-theme.service';

describe('TaskThemeService', () => {
  let service: TaskThemeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaskThemeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
