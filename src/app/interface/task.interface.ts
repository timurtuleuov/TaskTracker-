import { TaskStatus } from "./task-status";
import { TaskTheme } from "./task-theme.interface";

export interface Task{
    id: string,
    title: string;
    description: string;
    start: string;
    deadline: string;
    priority: string;
    status: TaskStatus;
    executor: string;
    board?: TaskTheme;
}