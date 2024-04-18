import { Routes } from '@angular/router';
import { BoardComponent } from './component/board/board.component';
import { TimelineComponent } from './component/timeline/timeline.component';
import { TaskComponent } from './component/task/task.component';

export const routes: Routes = [
    {path: '', component: BoardComponent},
    {path: 'timeline', component: TimelineComponent},
    {path: 'task/:slug', component: TaskComponent}
];
