import { TaskStatus } from "./task-status";

export interface Task{
    id: string,
    title: string;
    description: string;
    deadline: string;
    priority: string;
    status: TaskStatus;
    executor: string;
}