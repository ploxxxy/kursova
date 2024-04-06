'use client'

import { toast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'
import { CreateSubforumPayload } from '@/lib/validators/subforum'
import { useMutation } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'
import { useRouter } from 'next/navigation'
import { FC } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '../ui/Button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../ui/Card'
import { Input } from '../ui/Input'
import { Label } from '../ui/Label'

interface UserSettingsFormProps {
  subforumName: string
}

const SubforumEditForm: FC<UserSettingsFormProps> = ({ subforumName }) => {
  const router = useRouter()

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<CreateSubforumPayload>({})

  const { mutate, isPending } = useMutation({
    mutationFn: async ({ description, title }: CreateSubforumPayload) => {
      const payload: CreateSubforumPayload = {
        name: subforumName,
        description,
        title,
      }

      console.log(payload)

      const { data } = await axios.patch('/api/subforum', payload)
      return data
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        if (error.response?.status === 409) {
          return toast({
            title: 'Цей псевдоним вже зайнятий',
            description: 'Будь ласка, виберіть інший, унікальний псевдоним.',
            variant: 'destructive',
          })
        }

        if (error.response?.status === 400) {
          return toast({
            title: 'Неправильні дані',
            description:
              'При заповненні форми виникли помилки. Будь ласка, перевірте їх і спробуйте ще раз.',
            variant: 'destructive',
          })
        }
      }

      toast({
        title: 'Щось пішло не так',
        variant: 'destructive',
      })
    },
    onSuccess: () => {
      toast({
        title: 'Збережено',
        description: 'Ваші налаштування успішно збережено.',
      })

      router.refresh()
    },
  })

  return (
    <form
      onSubmit={handleSubmit((e) => {
        mutate(e)
      })}
    >
      <Card className="rounded">
        <CardHeader>
          <CardTitle>Титульна назва форуму</CardTitle>
          <CardDescription>
            Введіть титульну назву форуму, яка замінить його ідентифікатор на
            сторінках форуму та в створених темах.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Label className="sr-only" htmlFor="title">
            Опис форуму
          </Label>
          <Input
            id="title"
            className={cn(
              'max-w-96',
              errors.description &&
                'border-red-500 hover:border-red-300 focus-visible:ring-red-500',
            )}
            size={32}
            {...register('title')}
          />

          {errors.description && (
            <p className="text-xs text-red-500">{errors.description.message}</p>
          )}
        </CardContent>

        <CardHeader>
          <CardTitle>Опис форуму</CardTitle>
          <CardDescription>
            Введіть короткий опис форуму, який буде відображатися на головній
            сторінці та усіх темах форуму.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Label className="sr-only" htmlFor="description">
            Опис форуму
          </Label>
          <Input
            id="description"
            className={cn(
              'max-w-96',
              errors.description &&
                'border-red-500 hover:border-red-300 focus-visible:ring-red-500',
            )}
            size={32}
            {...register('description')}
          />

          {errors.description && (
            <p className="text-xs text-red-500">{errors.description.message}</p>
          )}
        </CardContent>

        <CardFooter>
          <Button isLoading={isPending}>Зберегти</Button>
        </CardFooter>
      </Card>
    </form>
  )
}

export default SubforumEditForm
