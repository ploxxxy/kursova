'use client'

import { toast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'
import {
  UserSettingsRequest,
  UserSettingsValidator,
} from '@/lib/validators/userSettings'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'
import { Session } from 'next-auth'
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
  user: Session['user']
}

const UserSettingsForm: FC<UserSettingsFormProps> = ({ user }) => {
  const router = useRouter()

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<UserSettingsRequest>({
    resolver: zodResolver(UserSettingsValidator),
    defaultValues: {
      username: user?.username || '<blank>',
    },
  })

  const { mutate, isPending } = useMutation({
    mutationFn: async ({ username }: UserSettingsRequest) => {
      const payload: UserSettingsRequest = { username }

      const { data } = await axios.patch('/api/settings', payload)
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
          <CardTitle>Твій псевдоним</CardTitle>
          <CardDescription>
            Введіть псевдоним, який замінить ваше повне ім&apos;я в
            повідомленнях, коментарях тощо.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="relative grid gap-1">
            <div className="absolute inset-0 grid h-9 w-8 place-items-center">
              <span className="text-sm text-text">@</span>
            </div>

            <Label className="sr-only" htmlFor="name">
              Ім&apos;я
            </Label>
            <Input
              id="name"
              className={cn(
                'max-w-96 pl-6',
                errors.username &&
                  'border-red-500 hover:border-red-300 focus-visible:ring-red-500',
              )}
              size={32}
              {...register('username')}
            />

            {errors.username && (
              <p className="text-xs text-red-500">{errors.username.message}</p>
            )}
          </div>
        </CardContent>

        <CardFooter>
          <Button isLoading={isPending}>Зберегти</Button>
        </CardFooter>
      </Card>
    </form>
  )
}

export default UserSettingsForm
