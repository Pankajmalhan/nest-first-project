import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Task, TaskStatus } from './tasks.model';
import * as uuid from 'uuid/v1'
import { CreateTaskDto } from './dto/create-task-dto';
import { GetTaskFilterDto } from './dto/get-task-dto';
@Injectable()
export class TasksService {
    tasks: Task[] = [];

    /**
     * Get all task list
     */
    getAllTasks(): Task[] {
        return this.tasks;
    }

    /**
     * Get task by id
     * @param taskId 
     */
    getTaskById(taskId: String): Task {
        return this.tasks.find(x => x.id == taskId);
    }
    /**
     * Create a new task
     * @param title 
     * @param description 
     */
    createTask(createTaskDto: CreateTaskDto): Task {
        let { description, title } = createTaskDto;
        const task: Task = {
            id: uuid(),
            description,
            title,
            status: TaskStatus.OPEN
        }
        this.tasks.push(task);
        return task;
    }

    /**
     * Delete task by id
     * @param taskId 
     */
    deleteTaskById(taskId: String): void {
        if (this.tasks.find(x => x.id == taskId)) {
            this.tasks = this.tasks.filter(x => x.id != taskId);
        } else {
            throw new HttpException('Task id is not exist', HttpStatus.BAD_REQUEST)
        }
    }

    /**
     * Update the status of task
     * @param taskId 
     * @param status 
     */
    updateTask(taskId: String, status: TaskStatus): Task {
        if (this.tasks.find(x => x.id == taskId)) {
            let task = this.getTaskById(taskId);
            task.status = status;
            return task;
        } else {
            throw new HttpException('Task id is not exist', HttpStatus.BAD_REQUEST)
        }
    }

    /**
     * Return the search result
     * @param filterTaskDto 
     */
    getTaskByFilter(filterTaskDto: GetTaskFilterDto): Task[] {
        let { status, search } = filterTaskDto;
        let taskList = this.tasks;
        if (status) {
            taskList = this.tasks.filter((x: Task) => x.status == status);
        }
        if (search) {
            taskList = taskList.filter((x: Task) => {
                return x.title.includes(search) ||
                    x.description.includes(search)
            })
        }
        return taskList;
    }
}
