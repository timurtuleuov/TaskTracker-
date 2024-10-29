import { Task } from "./task.interface";

export interface TaskTheme{
    id: string,
    title: string;
    tasks: Task[];
}