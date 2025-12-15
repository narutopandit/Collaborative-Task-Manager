
import { Task } from '../../models/task/model';
import { User } from '../../models/user/model';
import { io } from '../..';
import { Notification } from '../../models/notification/model';
import { AuditLog } from '../../models/auditLog/model';

export class TaskService {
  static async create(data: any, creatorId: string) {
    // Lookup user by email
    const assignedUser = await User.findOne({ email: data.assignedToEmail });
    if (!assignedUser) throw new Error('User not found');

    const task = new Task({
      title: data.title,
      description: data.description,
      dueDate: data.dueDate,
      priority: data.priority,
      status: 'TODO',
      creatorId,
      assignedToId: assignedUser._id
    });

    await task.save();

    // Notify assignee
    await Notification.create({
      userId: assignedUser._id,
      message: `You have been assigned a new task: ${task.title}`
    });

    // Notify creator
    await Notification.create({
      userId: creatorId,
      message: `You created a task: ${task.title}`
    });

    // Socket emissions to specific users
    io.to(assignedUser._id.toString()).emit('task:assigned', {
      userId: assignedUser._id,
      message: `You have been assigned a new task: ${task.title}`
    });

    io.to(creatorId.toString()).emit('task:created', {
      userId: creatorId,
      message: `You created a task: ${task.title}`
    });

    io.emit('task:created', task);
    return task;
  }

  static async update(taskId: string, data: any, userId: string) {
    const task = await Task.findById(taskId);
    if (!task) throw new Error('Task not found');

    // Creator can edit all fields (title, description, priority, dueDate, assignedToEmail)
    // Assignee can only update status
    const isCreator = task.creatorId?.toString() === userId;
    const isAssignee = task.assignedToId?.toString() === userId;

    if (!isCreator && !isAssignee) {
      throw new Error('You do not have permission to update this task');
    }

    // If not creator, only allow status updates
    if (!isCreator && (data.title || data.description || data.priority || data.dueDate || data.assignedToEmail)) {
      throw new Error('Only the task creator can edit task details');
    }

    let newAssignee = null;
    if (data.assignedToEmail) {
      const newUser = await User.findOne({ email: data.assignedToEmail });
      if (!newUser) throw new Error('User not found');
      newAssignee = newUser._id;
      task.assignedToId = newAssignee;
    }

    Object.assign(task, data);
    await task.save();

    await AuditLog.create({
      taskId: task._id,
      userId,
      action: 'Task updated'
    });

    if (newAssignee) {
      await Notification.create({
        userId: newAssignee,
        message: `You have been reassigned to a task: ${task.title}`
      });

      io.to(newAssignee.toString()).emit('task:assigned', {
        userId: newAssignee,
        message: `You have been reassigned to a task: ${task.title}`
      });
    }

    io.emit('task:updated', task);
    return task;
  }

  static async delete(taskId: string, userId: string) {
    const task = await Task.findById(taskId);
    if (!task) throw new Error('Task not found');

    // Only creator can delete
    if (!task.creatorId || task.creatorId.toString() !== userId) {
      throw new Error('Only the task creator can delete this task');
    }

    await Task.findByIdAndDelete(taskId);
    io.emit('task:deleted', taskId);
  }

  static async getAll() {
    return Task.find()
      .populate('creatorId', 'name email')
      .populate('assignedToId', 'name email');
  }
}
