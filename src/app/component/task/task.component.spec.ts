import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskComponent } from './task.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TranslateModule, TranslateLoader, TranslateFakeLoader } from '@ngx-translate/core';

describe('TaskComponent', () => {
  let component: TaskComponent;
  let fixture: ComponentFixture<TaskComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
     imports: [
       
       TranslateModule.forRoot({
         loader: {
           provide: TranslateLoader,
           useClass: TranslateFakeLoader
         }
       }),
       
     ],
     declarations: [ TaskComponent ],
     schemas: [ NO_ERRORS_SCHEMA ]
   })
   .compileComponents();
   }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
