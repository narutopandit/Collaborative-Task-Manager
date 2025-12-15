import { io } from 'socket.io-client'
import { QueryClient } from '@tanstack/react-query'

export const socket = io('http://localhost:4000', {
  withCredentials: true
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
