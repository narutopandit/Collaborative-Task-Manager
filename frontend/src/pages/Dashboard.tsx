import { useEffect, useState } from 'react'
import { useTasks, useUpdateTask } from '../hooks/useTasks'
import { useAuth } from '../context/AuthContext'
import { registerSocketListeners } from '../socket/socket'
import { useQueryClient } from '@tanstack/react-query'
import CreateTaskModal from '../components/CreateTaskModal'
import { UpdateTaskModal } from '../components/UpdateTaskModal'
import TaskSkeleton from '../components/TaskSkeleton'
import Notifications from '../components/Notifications'
import DeleteTask from '../components/DeleteTask'
import api from '../api/axios'

export default function Dashboard() {
  const { user, logout } = useAuth()
  const { data: tasks, isLoading } = useTasks()
  const updateTask = useUpdateTask()
  const queryClient = useQueryClient()

  const [statusFilter, setStatusFilter] = useState('')
  const [priorityFilter, setPriorityFilter] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedTask, setSelectedTask] = useState<any>(null)
  const [showEditProfile, setShowEditProfile] = useState(false)

  useEffect(() => {
    if (user?._id) {
      registerSocketListeners(queryClient, user._id)
    }
  }, [user?._id])

  if (isLoading)
    return (
      <div className="p-8 grid gap-4">
        <TaskSkeleton />
        <TaskSkeleton />
        <TaskSkeleton />
      </div>
    )

  const filteredTasks = (tasks || [])
    .filter((t: any) =>
      statusFilter ? t.status === statusFilter : true
    )
    .filter((t: any) =>
      priorityFilter ? t.priority === priorityFilter : true
    )
    .sort(
      (a: any, b: any) =>
        new Date(a.dueDate).getTime() -
        new Date(b.dueDate).getTime()
    )

  const overdueTasks = (tasks || []).filter(
    (t: any) =>
      new Date(t.dueDate) < new Date() &&
      t.status !== 'COMPLETED'
  )

  const totalTasks = tasks?.length || 0
  const completedTasks = tasks?.filter((t: any) => t.status === 'COMPLETED').length || 0
  const inProgressTasks = tasks?.filter((t: any) => t.status === 'IN_PROGRESS').length || 0
  const todoTasks = tasks?.filter((t: any) => t.status === 'TODO').length || 0

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-72 bg-gradient-to-b from-blue-600 to-blue-800 text-white p-8 flex flex-col">
        {/* Logo */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
              <span className="text-2xl font-bold text-blue-600">✓</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">CTM</h1>
          </div>
          <p className="text-blue-100 text-sm">Collaborative Task Manager</p>
        </div>

        {/* Welcome Section */}
        <div className="flex-1">
          <p className="text-blue-100 text-sm font-medium mb-2">Welcome back,</p>
          <h2 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100 mb-2">
            {user?.name}
          </h2>
          <p className="text-blue-100 text-sm">Have a great day ahead!</p>
        </div>

        {/* Sidebar Footer */}
        <div className="pt-8 border-t border-blue-500">
          <p className="text-xs text-blue-100">Status: Active</p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <div className="bg-white shadow-sm">
          <div className="p-6 flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-800">Tasks</h1>
            
            <div className="flex items-center gap-4">
              <Notifications />
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-medium"
              >
                + New Task
              </button>
              <button
                onClick={() => setShowEditProfile(true)}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition text-xl"
                title="Edit Profile"
              >
                👤
              </button>
              <button
                onClick={logout}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6 space-y-6 overflow-y-auto">

      {showCreateModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="absolute inset-0 bg-black opacity-40"
            onClick={() => setShowCreateModal(false)}
          />
          <div className="relative bg-white p-4 rounded w-full max-w-md z-10 shadow-lg">
            <button
              onClick={() => setShowCreateModal(false)}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
            >
              ✕
            </button>
            <CreateTaskModal onCreated={() => setShowCreateModal(false)} />
          </div>
        </div>
      )}

      {showEditModal && selectedTask && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="absolute inset-0 bg-black opacity-40"
            onClick={() => {
              setShowEditModal(false)
              setSelectedTask(null)
            }}
          />
          <div className="relative bg-white p-4 rounded w-full max-w-md z-10 shadow-lg">
            <button
              onClick={() => {
                setShowEditModal(false)
                setSelectedTask(null)
              }}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
            >
              ✕
            </button>
            <UpdateTaskModal
              isOpen={showEditModal}
              onClose={() => {
                setShowEditModal(false)
                setSelectedTask(null)
              }}
              onCreated={() => {
                setShowEditModal(false)
                setSelectedTask(null)
              }}
              task={selectedTask}
            />
          </div>
        </div>
      )}

      {showEditProfile && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="absolute inset-0 bg-black opacity-40"
            onClick={() => setShowEditProfile(false)}
          />
          <div className="relative bg-white p-6 rounded w-full max-w-md z-10 shadow-lg">
            <button
              onClick={() => setShowEditProfile(false)}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 text-xl"
            >
              ✕
            </button>
            <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>
            <form
              onSubmit={async (e) => {
                e.preventDefault()
                const newName = (e.target as any).name.value
                if (newName.trim()) {
                  try {
                    await api.put('/auth/profile', { name: newName })
                    window.location.reload()
                  } catch (error) {
                    console.error('Error updating profile:', error)
                  }
                }
              }}
            >
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  name="name"
                  defaultValue={user?.name}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your name"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowEditProfile(false)}
                  className="flex-1 px-4 py-2 bg-gray-300 text-black rounded-lg hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
          <p className="text-blue-100 text-sm font-medium">Total Tasks</p>
          <h3 className="text-4xl font-bold mt-2">{totalTasks}</h3>
          <p className="text-blue-100 text-xs mt-2">All tasks</p>
        </div>

        <div className="bg-gradient-to-br from-cyan-400 to-cyan-500 rounded-lg shadow-lg p-6 text-white">
          <p className="text-cyan-100 text-sm font-medium">In Progress</p>
          <h3 className="text-4xl font-bold mt-2">{inProgressTasks}</h3>
          <p className="text-cyan-100 text-xs mt-2">Active tasks</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
          <p className="text-purple-100 text-sm font-medium">To Do</p>
          <h3 className="text-4xl font-bold mt-2">{todoTasks}</h3>
          <p className="text-purple-100 text-xs mt-2">Pending tasks</p>
        </div>

        <div className="bg-gradient-to-br from-green-400 to-green-500 rounded-lg shadow-lg p-6 text-white">
          <p className="text-green-100 text-sm font-medium">Completed</p>
          <h3 className="text-4xl font-bold mt-2">{completedTasks}</h3>
          <p className="text-green-100 text-xs mt-2">Done</p>
        </div>
      </div>

      {/* Overdue Alert */}
      {overdueTasks.length > 0 && (
        <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-6">
          <h2 className="font-bold text-red-700 text-lg flex items-center gap-2">
            ⚠️ Overdue Tasks ({overdueTasks.length})
          </h2>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            {overdueTasks.map((task: any) => (
              <div key={task._id} className="bg-white p-4 rounded-lg border border-red-200">
                <p className="font-semibold text-gray-800">{task.title}</p>
                <p className="text-sm text-gray-600 mt-1">Due: {new Date(task.dueDate).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-4 bg-white p-4 rounded-lg shadow-sm">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Status</option>
          <option value="TODO">To Do</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="REVIEW">Review</option>
          <option value="COMPLETED">Completed</option>
        </select>

        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Priority</option>
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
          <option value="URGENT">Urgent</option>
        </select>
      </div>

      {/* Task List */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">All Tasks</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTasks.map((task: any) => {
            const assignedToId = typeof task.assignedToId === 'object' ? task.assignedToId?._id : task.assignedToId
            const creatorId = typeof task.creatorId === 'object' ? task.creatorId?._id : task.creatorId
            const canUpdate = assignedToId === user?._id
            const isCreator = creatorId === user?._id

            const priorityColors: any = {
              'LOW': 'bg-blue-50 border-blue-200',
              'MEDIUM': 'bg-yellow-50 border-yellow-200',
              'HIGH': 'bg-orange-50 border-orange-200',
              'URGENT': 'bg-red-50 border-red-200'
            }

            const statusBadgeColors: any = {
              'TODO': 'bg-gray-200 text-gray-700',
              'IN_PROGRESS': 'bg-blue-200 text-blue-700',
              'REVIEW': 'bg-purple-200 text-purple-700',
              'COMPLETED': 'bg-green-200 text-green-700'
            }

            return (
              <div
                key={task._id}
                className={`border-2 rounded-lg shadow-md p-6 transition hover:shadow-lg ${priorityColors[task.priority] || 'bg-white border-gray-200'}`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-800">{task.title}</h3>
                  </div>
                  <div className="flex gap-2 ml-2">
                    {isCreator && (
                      <button
                        onClick={() => {
                          setSelectedTask(task)
                          setShowEditModal(true)
                        }}
                        className="px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600 transition"
                      >
                        Edit
                      </button>
                    )}
                    <DeleteTask taskId={task._id} creatorId={creatorId} currentUserId={user?._id || ''} />
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{task.description}</p>

                <div className="space-y-2 mb-4 text-xs text-gray-600">
                  <p><span className="font-semibold">Assigned:</span> {task.assignedToId?.name || 'Unknown'}</p>
                  <p><span className="font-semibold">Creator:</span> {task.creatorId?.name || 'Unknown'}</p>
                  <p><span className="font-semibold">Due:</span> {new Date(task.dueDate).toLocaleDateString()}</p>
                </div>

                <div className="flex gap-2 items-center justify-between pt-3 border-t border-gray-300">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusBadgeColors[task.status]}`}>
                    {task.status}
                  </span>

                  {canUpdate && (
                    <select
                      value={task.status}
                      onChange={(e) =>
                        updateTask.mutate({
                          id: task._id,
                          data: { status: e.target.value }
                        })
                      }
                      className="border border-gray-300 px-2 py-1 rounded text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="TODO">To Do</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="REVIEW">Review</option>
                      <option value="COMPLETED">Completed</option>
                    </select>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {filteredTasks.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No tasks found</p>
          </div>
        )}
      </div>
        </div>
      </div>
    </div>
  )
}
