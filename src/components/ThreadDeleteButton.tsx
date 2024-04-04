'use client'

import { toast } from '@/hooks/use-toast'
import { ThreadDeleteRequest } from '@/lib/validators/thread'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { FC } from 'react'
import CustomTooltip from './CustomTooltip'
import { Button } from './ui/Button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './ui/AlertDialog'

interface ThreadDeleteButtonProps {
  threadId: string
  subforumName: string
}

const ThreadDeleteButton: FC<ThreadDeleteButtonProps> = ({
  threadId,
  subforumName,
}) => {
  const router = useRouter()

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const payload: ThreadDeleteRequest = {
        threadId,
      }

      const { data } = await axios.post('/api/subforum/thread/delete', payload)
      return data as string
    },
    onError: () => {
      toast({
        title: 'Щось пішло не так',
        variant: 'destructive',
      })
    },
    onSuccess: () => {
      toast({
        title: 'Тему видалено',
      })
      router.push(`/c/${subforumName}`)
      router.refresh()
    },
  })

  return (
    <CustomTooltip text="Видалити цю тему?">
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 z-10"
          >
            <X className="h-4 w-4" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Ви збираєтесь видалити цю тему</AlertDialogTitle>
            <AlertDialogDescription>
              Ця дія не може бути повернута назад. Це призведе до остаточного
              видалення цієї теми з наших серверів.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Скасувати</AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button onClick={() => mutate()} isLoading={isPending}>
                Видалити тему
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </CustomTooltip>
  )
}

export default ThreadDeleteButton
