import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardThemeComponent } from './board-theme.component';

describe('BoardThemeComponent', () => {
  let component: BoardThemeComponent;
  let fixture: ComponentFixture<BoardThemeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BoardThemeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BoardThemeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
