import { Controller, Get, Post, Body, Param, Delete, Res, HttpStatus, Patch, Query } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task, TaskStatus } from './tasks.model';
import { CreateTaskDto } from './dto/create-task-dto';
import { Response } from 'express';
import { GetTaskFilterDto } from './dto/get-task-dto';

@Controller('tasks')
export class TasksController {
    constructor(private readonly taskService: TasksService) {

    }

    /**
     * get list of all tasks
     */
    @Get()
    getTasks(@Query() filterDto: GetTaskFilterDto): Task[] {
        if (Object.keys(filterDto).length > 0) {
            return this.taskService.getTaskByFilter(filterDto);
        }
        return this.taskService.getAllTasks();
    }

    /**
     * Get task by id
     * @param id 
     */
    @Get('/:id')
    getTaskById(@Param('id') id: string): Task {
        return this.taskService.getTaskById(id);
    }

    /**
     * Delete a task
     * @param id 
     * @param response 
     */
    @Delete('/:id')
    deleteTaskById(@Param('id') id: string, @Res() response: Response): void {
        this.taskService.deleteTaskById(id);
        response.status(HttpStatus.OK).json();
    }

    /**
     * add new task
     * @param title 
     * @param description 
     */
    @Post()
    createTask(
        @Body() createTaskDto: CreateTaskDto
    ): Task {
        return this.taskService.createTask(createTaskDto);
    }

    @Patch('/:id')
    updateTask(
        @Body('status') status: TaskStatus,
        @Param('id') id: string
    ): Task {
        return this.taskService.updateTask(id, status);
    }
}
