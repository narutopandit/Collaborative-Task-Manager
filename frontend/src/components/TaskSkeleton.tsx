export default function TaskSkeleton() {
  return (
    <div className="border p-4 rounded animate-pulse space-y-2">
      <div className="h-4 bg-gray-300 rounded w-3/4"></div>
      <div className="h-3 bg-gray-200 rounded w-full"></div>
      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
      <div className="flex gap-4 mt-2">
        <div className="h-10 bg-gray-300 rounded w-32"></div>
        <div className="h-3 bg-gray-200 rounded w-24"></div>
      </div>
    </div>
  )
}
