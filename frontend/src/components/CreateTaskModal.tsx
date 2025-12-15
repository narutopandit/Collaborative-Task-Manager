import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { createTask } from '../api/task.api'
import { useQueryClient } from '@tanstack/react-query'

const schema = z.object({
  title: z.string().max(100),
  description: z.string(),
  dueDate: z.string(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']),
  assignedToEmail: z.string().email()
})

export default function CreateTaskModal({ onCreated }: { onCreated?: () => void }) {
  const queryClient = useQueryClient()
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(schema)
  })

  const onSubmit = async (data: any) => {
    try {
      const payload = { ...data }
      if (payload.dueDate) {
        const d = new Date(payload.dueDate)
        if (!isNaN(d.getTime())) payload.dueDate = d.toISOString()
      }

      await createTask(payload)
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      reset()
      onCreated?.()
    } catch (err) {
      console.error('Failed to create task:', err)
    }
  }

  return (
    <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4 pb-3 border-b border-gray-200">Create a new task</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm text-gray-600 mb-1">Title</label>
          <input
            {...register('title')}
            placeholder="Task title"
            className="block w-full px-4 py-2 rounded-md border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 shadow-sm"
          />
          {errors.title && <p className="text-red-500 text-sm mt-1">Title is required</p>}
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">Description</label>
          <textarea
            {...register('description')}
            placeholder="Describe the task"
            className="block w-full px-4 py-2 rounded-md border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 shadow-sm min-h-[90px]"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Due date</label>
            <input
              type="date"
              {...register('dueDate')}
              className="block w-full px-3 py-2 rounded-md border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300"
            />
            {errors.dueDate && <p className="text-red-500 text-sm mt-1">Due date is required</p>}
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Priority</label>
            <select {...register('priority')} className="block w-full px-3 py-2 rounded-md border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300">
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="URGENT">Urgent</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">Assignee (email)</label>
          <input
            {...register('assignedToEmail')}
            placeholder="assignee@example.com"
            type="email"
            className="block w-full px-4 py-2 rounded-md border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 shadow-sm"
          />
          {errors.assignedToEmail && <p className="text-red-500 text-sm mt-1">Valid email is required</p>}
        </div>

        <button className="w-full bg-slate-900 text-white py-3 rounded-md hover:bg-black transition-colors">
          Create Task
        </button>
      </form>
    </div>
  )
}
