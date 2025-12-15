import { z } from 'zod';

export const CreateTaskDto = z.object({
  title: z.string().max(100),
  description: z.string(),
  dueDate: z.string().datetime(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']),
  assignedToEmail: z.string().email()
});

export const UpdateTaskDto = z.object({
  title: z.string().max(100).optional(),
  description: z.string().optional(),
  dueDate: z.string().datetime().optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
  status: z.enum(['TODO', 'IN_PROGRESS', 'REVIEW', 'COMPLETED']).optional(),
  assignedToEmail: z.string().email().optional()
});
