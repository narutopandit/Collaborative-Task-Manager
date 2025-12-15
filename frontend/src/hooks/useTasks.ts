import {
  useQuery,
  useMutation,
  useQueryClient
} from '@tanstack/react-query'
import { fetchTasks, updateTask } from '../api/task.api'

export const useTasks = () => {
  return useQuery({
    queryKey: ['tasks'],
    queryFn: fetchTasks
  })
}

export const useUpdateTask = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: any) => updateTask(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: ['tasks'] })

      const previous = queryClient.getQueryData<any[]>(['tasks'])

      queryClient.setQueryData(['tasks'], (old: any) =>
        old.map((t: any) =>
          t._id === id ? { ...t, ...data } : t
        )
      )

      return { previous }
    },
    onError: (_err, _data, context) => {
      queryClient.setQueryData(['tasks'], context?.previous)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    }
  })
}
