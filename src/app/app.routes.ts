import { Routes } from '@angular/router';
import { BoardComponent } from './component/board/board.component';
import { TimelineComponent } from './component/timeline/timeline.component';
import { TaskComponent } from './component/task/task.component';
import { TaskListComponent } from './component/task-list/task-list.component';
import { AboutComponent } from './component/about/about.component';
import { BoardThemeComponent } from './component/board-theme/board-theme.component';

export const routes: Routes = [
    {path: '', redirectTo: 'board', pathMatch: 'full' },
    
    {path: 'board', component: BoardComponent},
    {path: 'timeline', component: TimelineComponent},
    {path: 'task-list', component: TaskListComponent},
    {path: 'task/:slug', component: TaskComponent},
    {path: 'about', component: AboutComponent},
    {path: 'theme', component: BoardThemeComponent},
    {path: '**', redirectTo: 'board'},
];
