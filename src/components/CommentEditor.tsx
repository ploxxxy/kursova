'use client'

import { useCustomToast } from '@/hooks/use-custom-toast'
import { toast } from '@/hooks/use-toast'
import { CommentRequest } from '@/lib/validators/comment'
import { useMutation } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'
import { Send, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { ChangeEvent, FC, useState } from 'react'
import TextareaAutoSize from 'react-textarea-autosize'
import { Button } from './ui/Button'
import { Label } from './ui/Label'

interface CommentEditorProps {
  threadId: string
  replyToId?: string
  inlineComment?: boolean
  onClose?: () => void
}

const CommentEditor: FC<CommentEditorProps> = ({
  threadId,
  replyToId,
  inlineComment,
  onClose,
}) => {
  const { loginToast } = useCustomToast()
  const [input, setInput] = useState('')
  const router = useRouter()

  const { mutate, isPending } = useMutation({
    mutationFn: async ({ threadId, text, replyToId }: CommentRequest) => {
      const payload: CommentRequest = {
        threadId,
        text,
        replyToId,
      }

      const { data } = await axios.patch(
        '/api/subforum/thread/comment',
        payload,
      )
      return data
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          return loginToast()
        }

        if (error.response?.status === 403) {
          return toast({
            title: 'Ви не можете коментувати цей пост',
            variant: 'destructive',
          })
        }
      }

      return toast({
        title: 'Щось пішло не так',
        variant: 'destructive',
      })
    },
    onSuccess: () => {
      router.refresh()
      setInput('')
      toast({
        title: 'Коментар успішно відправлено',
        description:
          'Твій коментар буде опубліковано після перевірки модератором',
      })

      if (onClose) onClose()
    },
  })

  const onCloseEditor = () => {
    if (!onClose) return
    if (input.length == 0) return onClose()

    if (
      confirm(
        'Ви впевнені, що хочете відмінити написання коментаря? Ваші зміни не будуть збережені.',
      )
    )
      return onClose()
  }

  if (inlineComment)
    return (
      <div className="relative mb-3 flex flex-col">
        <div className="absolute inset-0 h-full w-1 bg-border" />

        <div className="flex items-center gap-2 pl-3">
          <Textarea
            placeholder="Відповідь до коментаря..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <Button
            variant="ghost"
            size="icon"
            isLoading={isPending}
            disabled={input.length === 0}
            onClick={() => {
              mutate({ threadId, text: input, replyToId })
            }}
          >
            <Send className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="ghost" onClick={onCloseEditor}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    )

  return (
    <div className="space-y-2">
      <Label htmlFor="commentArea">Твій коментар</Label>
      <Textarea
        placeholder="Напиши, що вважаєш про це..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <Button
        className="float-end"
        isLoading={isPending}
        disabled={input.length === 0}
        onClick={() => {
          mutate({ threadId, text: input, replyToId })
        }}
      >
        Відправити
      </Button>
    </div>
  )
}

interface TextareaProps {
  placeholder: string
  value: string
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void
}

const Textarea: FC<TextareaProps> = ({ placeholder, value, onChange }) => {
  return (
    <TextareaAutoSize
      className="flex w-full resize-none appearance-none overflow-hidden rounded-md border border-input bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
      id="commentArea"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
    />
  )
}
export default CommentEditor
