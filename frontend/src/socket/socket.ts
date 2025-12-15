import { io } from 'socket.io-client'
import { QueryClient } from '@tanstack/react-query'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000'

export const socket = io(BACKEND_URL, {
  withCredentials: true,
  transports: ['websocket', 'polling'],
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: 5
})

export const registerSocketListeners = (queryClient: QueryClient, userId?: string) => {
  // Join user room when user ID is available
  if (userId) {
    socket.emit('user:joined', userId)
  }

  socket.on('task:created', () => {
    queryClient.invalidateQueries({ queryKey: ['tasks'] })
  })

  socket.on('task:updated', () => {
    queryClient.invalidateQueries({ queryKey: ['tasks'] })
  })

  socket.on('task:deleted', () => {
    queryClient.invalidateQueries({ queryKey: ['tasks'] })
  })
}
