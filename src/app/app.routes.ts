import { Routes } from '@angular/router';
import { BoardComponent } from './board/board.component';
import { TimelineComponent } from './timeline/timeline.component';

export const routes: Routes = [
    {path: '', component: BoardComponent},
    {path: 'timeline', component: TimelineComponent},
];
