import { useEffect, useState } from 'react'
import { socket } from '../socket/socket'

interface Notification {
  id: string
  message: string
  timestamp: Date
}

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [visibleToasts, setVisibleToasts] = useState<Notification[]>([])
  const [showAll, setShowAll] = useState(false)

  // Auto-remove toasts after 5 seconds (but keep in panel)
  useEffect(() => {
    if (visibleToasts.length === 0) return

    const timer = setTimeout(() => {
      setVisibleToasts([])
    }, 5000)

    return () => clearTimeout(timer)
  }, [visibleToasts])

  useEffect(() => {
    const handleTaskAssigned = (notif: any) => {
      const newNotif: Notification = {
        id: Math.random().toString(),
        message: notif.message || `New task assigned`,
        timestamp: new Date()
      }
      // Add to panel notifications
      setNotifications((prev) => [newNotif, ...prev])
      // Add to visible toasts
      setVisibleToasts((prev) => [newNotif, ...prev])
    }

    const handleTaskCreated = (notif: any) => {
      const newNotif: Notification = {
        id: Math.random().toString(),
        message: notif.message || `New task created`,
        timestamp: new Date()
      }
      // Add to panel notifications
      setNotifications((prev) => [newNotif, ...prev])
      // Add to visible toasts
      setVisibleToasts((prev) => [newNotif, ...prev])
    }

    socket.on('task:assigned', handleTaskAssigned)
    socket.on('task:created', handleTaskCreated)

    return () => {
      socket.off('task:assigned', handleTaskAssigned)
      socket.off('task:created', handleTaskCreated)
    }
  }, [])

  return (
    <>
      {/* Toast notifications */}
      {!showAll && (
        <div className="fixed top-4 right-4 space-y-2 z-50">
          {visibleToasts.map((n) => (
            <div
              key={n.id}
              className="bg-white shadow-lg p-4 rounded border-l-4 border-blue-500 animate-fade-in"
            >
              <p className="text-sm">{n.message}</p>
            </div>
          ))}
        </div>
      )}

      {/* Notification bell icon */}
      <button
        onClick={() => setShowAll(!showAll)}
        className="fixed top-4 right-4 z-50 relative"
      >
        <div className="bg-white p-2 rounded-full shadow-lg hover:shadow-xl transition-shadow">
          <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          {notifications.length > 0 && (
            <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">
              {notifications.length}
            </span>
          )}
        </div>
      </button>

      {/* All notifications panel */}
      {showAll && (
        <div className="fixed top-16 right-4 w-96 max-h-96 bg-white rounded-lg shadow-xl z-50 overflow-y-auto">
          <div className="p-4 border-b flex justify-between items-center">
            <h3 className="font-bold text-lg">All Notifications ({notifications.length})</h3>
            <div className="flex gap-2">
              {notifications.length > 0 && (
                <button 
                  onClick={() => setNotifications([])}
                  className="text-xs px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded"
                >
                  Clear
                </button>
              )}
              <button onClick={() => setShowAll(false)} className="text-gray-500 hover:text-gray-700">
                ✕
              </button>
            </div>
          </div>
          <div className="divide-y">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">No notifications</div>
            ) : (
              notifications.map((n) => (
                <div key={n.id} className="p-4 hover:bg-gray-50">
                  <p className="text-sm text-gray-800">{n.message}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {n.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </>
  )
}
