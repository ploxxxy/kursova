'use client'

import { UkrainianEditorLocale } from '@/config'
import { toast } from '@/hooks/use-toast'
import { uploadFiles } from '@/lib/uploadthing'
import { ThreadCreationRequest, ThreadValidator } from '@/lib/validators/thread'
import '@/styles/editor.css'
import type EditorJS from '@editorjs/editorjs'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { usePathname, useRouter } from 'next/navigation'
import { FC, useCallback, useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import TextareaAutoSize from 'react-textarea-autosize'

interface EditorProps {
  subforumId: string
}

const Editor: FC<EditorProps> = ({ subforumId }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ThreadCreationRequest>({
    resolver: zodResolver(ThreadValidator),
    defaultValues: {
      subforumId,
      title: '',
      content: null,
    },
  })

  const editorRef = useRef<EditorJS>()
  const _titleRef = useRef<HTMLTextAreaElement>(null)
  const [isMounted, setIsMounted] = useState(false)
  const pathName = usePathname()
  const router = useRouter()

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsMounted(true)
    }
  }, [])

  const initializeEditor = useCallback(async () => {
    const EditorJS = (await import('@editorjs/editorjs')).default
    const Header = (await import('@editorjs/header')).default
    const Embed = (await import('@editorjs/embed')).default
    const Table = (await import('@editorjs/table')).default
    const List = (await import('@editorjs/list')).default
    const Code = (await import('@editorjs/code')).default
    const LinkTool = (await import('@editorjs/link')).default
    const InlineCode = (await import('@editorjs/inline-code')).default
    const ImageTool = (await import('@editorjs/image')).default

    if (!editorRef.current) {
      const editor = new EditorJS({
        i18n: UkrainianEditorLocale,
        holder: 'editor',
        onReady() {
          editorRef.current = editor
        },
        placeholder: 'Почніть писати тут...',
        inlineToolbar: true,
        data: { blocks: [] },
        tools: {
          header: Header,
          linkTool: {
            class: LinkTool,
            config: {
              endpoint: '/api/crawl',
            },
          },
          image: {
            class: ImageTool,
            config: {
              uploader: {
                async uploadByFile(file: File) {
                  const [response] = await uploadFiles('imageUploader', {
                    files: [file],
                  })

                  return {
                    success: true,
                    file: {
                      url: response.url,
                    },
                  }
                },
              },
            },
          },
          list: List,
          code: Code,
          inlineCode: InlineCode,
          // table: Table, // TODO: fix table styling
          embed: Embed,
        },
      })
    }
  }, [])

  useEffect(() => {
    if (Object.keys(errors).length) {
      for (const [_key, value] of Object.entries(errors)) {
        toast({
          title: 'Щось пішло не так...',
          description: (value as { message: string }).message,
          variant: 'destructive',
        })
      }
    }
  }, [errors])

  useEffect(() => {
    const init = async () => {
      await initializeEditor()

      setTimeout(() => {
        _titleRef.current?.focus()
      }, 0)
    }

    if (isMounted) {
      init()

      return () => {
        editorRef.current?.destroy()
        editorRef.current = undefined
      }
    }
  }, [isMounted, initializeEditor])

  const { mutate } = useMutation({
    mutationFn: async ({
      title,
      content,
      subforumId,
    }: ThreadCreationRequest) => {
      const payload: ThreadCreationRequest = {
        title,
        content,
        subforumId,
      }

      const { data } = await axios.post('/api/subforum/thread/create', payload)
      return data
    },
    onError: () => {
      return toast({
        title: 'Щось пішло не так...',
        description: 'Не вдалося створити тему. Спробуйте ще раз пізніше.',
        variant: 'destructive',
      })
    },
    onSuccess: () => {
      const path = pathName.split('/').slice(0, -1).join('/')
      router.push(path)

      router.refresh()

      return toast({
        title: 'Успішно!',
        description: 'Тему успішно створено.',
      })
    },
  })

  async function onSubmit(data: ThreadCreationRequest) {
    const content = await editorRef.current?.save()

    const payload: ThreadCreationRequest = {
      subforumId,
      title: data.title,
      content,
    }

    mutate(payload)
  }

  if (!isMounted) return null

  const { ref: titleRef, ...rest } = register('title')

  return (
    <div className="w-full rounded-lg border bg-card px-4 py-2">
      <form id="subforum-thread-form" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col">
          <TextareaAutoSize
            ref={(e) => {
              titleRef(e)

              // @ts-expect-error - Not an error
              _titleRef.current = e as HTMLTextAreaElement
            }}
            {...rest}
            placeholder="Заголовок"
            className="resize-none appearance-none overflow-hidden bg-transparent text-2xl font-bold text-white placeholder:text-muted-foreground focus:outline-none"
          />

          <div id="editor" className="min-h-[400px]" />
        </div>
      </form>
    </div>
  )
}

export default Editor
