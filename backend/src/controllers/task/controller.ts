import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth/middleware';
import { CreateTaskDto, UpdateTaskDto } from '../../dto/task/dto';
import { TaskService } from '../../services/task/service';


export class TaskController {
  static async create(req: AuthRequest, res: Response) {
    try {
      const data = CreateTaskDto.parse(req.body);
      const task = await TaskService.create(data, req.userId!);
      res.status(201).json(task);
    } catch (e: any) {
      res.status(400).json({ message: e.message });
    }
  }

  static async update(req: AuthRequest, res: Response) {
    try {
      const data = UpdateTaskDto.parse(req.body);
      const task = await TaskService.update(
        req.params.id,
        data,
        req.userId!
      );
      res.json(task);
    } catch (e: any) {
      res.status(400).json({ message: e.message });
    }
  }

  static async remove(req: AuthRequest, res: Response) {
    try {
      await TaskService.delete(req.params.id, req.userId!);
      res.status(204).send();
    } catch (e: any) {
      res.status(403).json({ message: e.message });
    }
  }

  static async getAll(_req: AuthRequest, res: Response) {
    const tasks = await TaskService.getAll();
    res.json(tasks);
  }
}
