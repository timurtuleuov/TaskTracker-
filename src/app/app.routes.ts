import { Routes } from '@angular/router';
import { BoardComponent } from './component/board/board.component';
import { TimelineComponent } from './component/timeline/timeline.component';

export const routes: Routes = [
    {path: '', component: BoardComponent},
    {path: 'timeline', component: TimelineComponent},
];
