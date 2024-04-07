'use client'

import { toast } from '@/hooks/use-toast'
import { CommentDeleteRequest } from '@/lib/validators/comment'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { FC } from 'react'
import CustomTooltip from './CustomTooltip'
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
import { Button } from './ui/Button'

interface CommentDeleteButtonProps {
  commentId: string
}

const CommentDeleteButton: FC<CommentDeleteButtonProps> = ({ commentId }) => {
  const router = useRouter()

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const payload: CommentDeleteRequest = {
        commentId,
      }

      const { data } = await axios.post(
        '/api/subforum/thread/comment/delete',
        payload,
      )
      return data as string
    },
    onError: (error) => {
      toast({
        title: 'Щось пішло не так',
        description: (error as Error).message,
        variant: 'destructive',
      })
    },
    onSuccess: () => {
      toast({
        title: 'Коментар видалено',
      })
      router.refresh()
    },
  })

  return (
    <CustomTooltip text="Видалити цей коментар?">
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
            <AlertDialogTitle>
              Ви збираєтесь видалити цей коментар
            </AlertDialogTitle>
            <AlertDialogDescription>
              Ця дія не може бути повернута назад. Це призведе до остаточного
              видалення цього коментаря з наших серверів.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Скасувати</AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button onClick={() => mutate()} isLoading={isPending}>
                Видалити коментар
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </CustomTooltip>
  )
}

export default CommentDeleteButton
