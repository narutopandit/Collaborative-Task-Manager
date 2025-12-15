import { deleteTask } from '../api/task.api'
import { useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'

export default function DeleteTask({ taskId, creatorId, currentUserId }: { taskId: string; creatorId: string | undefined; currentUserId: string | undefined }) {
  const queryClient = useQueryClient()
  const [isDeleting, setIsDeleting] = useState(false)

  // Only show delete button if current user is the creator
  if (!creatorId || !currentUserId || creatorId !== currentUserId) return null

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this task?')) return

    try {
      setIsDeleting(true)
      await deleteTask(taskId)
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    } catch (err: any) {
      console.error('Failed to delete task:', err)
      alert(err.response?.data?.message || 'Failed to delete task')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white px-3 py-1 rounded text-sm"
    >
      {isDeleting ? 'Deleting...' : 'Delete'}
    </button>
  )
}
