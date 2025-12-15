import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { updateTask } from '../api/task.api';
import { useMutation } from '@tanstack/react-query';
import { useCallback } from 'react';

const updateTaskSchema = z.object({
  title: z.string().min(1, 'Title is required').min(5, 'Title must be at least 5 characters'),
  description: z.string().min(1, 'Description is required').min(10, 'Description must be at least 10 characters'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']),
  dueDate: z.string().min(1, 'Due date is required'),
});

type UpdateTaskFormData = z.infer<typeof updateTaskSchema>;

interface UpdateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: () => void;
  task: {
    _id: string;
    title: string;
    description: string;
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
    dueDate: string;
  };
}

export function UpdateTaskModal({ isOpen, onClose, onCreated, task }: UpdateTaskModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UpdateTaskFormData>({
    resolver: zodResolver(updateTaskSchema),
    defaultValues: {
      title: task.title,
      description: task.description,
      priority: task.priority,
      dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: UpdateTaskFormData) => {
      const isoDateTime = new Date(data.dueDate).toISOString();
      return updateTask(task._id, {
        title: data.title,
        description: data.description,
        priority: data.priority,
        dueDate: isoDateTime,
      });
    },
    onSuccess: () => {
      reset();
      onCreated();
      onClose();
    },
  });

  const handleFormSubmit = useCallback((data: UpdateTaskFormData) => {
    mutation.mutate(data);
  }, [mutation]);

  if (!isOpen) return null;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Edit Task</h2>
        
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          {/* Title */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
            <input
              type="text"
              {...register('title')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter task title"
            />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
          </div>

          {/* Description */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              {...register('description')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter task description"
              rows={3}
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
          </div>

          {/* Priority */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
            <select
              {...register('priority')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="URGENT">Urgent</option>
            </select>
            {errors.priority && <p className="text-red-500 text-sm mt-1">{errors.priority.message}</p>}
          </div>

          {/* Due Date */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
            <input
              type="date"
              {...register('dueDate')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.dueDate && <p className="text-red-500 text-sm mt-1">{errors.dueDate.message}</p>}
          </div>

          {/* Buttons */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-300 text-black rounded-md hover:bg-gray-400 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={mutation.isPending}
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition disabled:opacity-50"
            >
              {mutation.isPending ? 'Updating...' : 'Update Task'}
            </button>
          </div>
        </form>

    </div>
  );
}
