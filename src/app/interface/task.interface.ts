import { Tag } from "./tag.interface";
import { TaskStatus } from "./task-status";
import { TaskTheme } from "./task-theme.interface";

export interface Task{
    id: string,
    title: string;
    description: string;
    start: string;
    deadline: string;
    priority: number;
    status: TaskStatus;
    executor: string;
    emoji?: string;
    board?: TaskTheme;
    tags?: Tag[]
}