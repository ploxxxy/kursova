'use client'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useCustomToast } from '@/hooks/use-custom-toast'
import { toast } from '@/hooks/use-toast'
import { CreateSubforumPayload } from '@/lib/validators/subforum'
import { useMutation } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

const Page = () => {
  const [input, setInput] = useState('')
  const router = useRouter()
  const { loginToast } = useCustomToast()

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const payload: CreateSubforumPayload = {
        name: input,
      }

      const { data } = await axios.post('/api/subforum', payload)
      return data as string
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        if (error.response?.status === 409) {
          return toast({
            title: 'Форум з такою назвою вже існує',
            variant: 'destructive',
          })
        }

        if (error.response?.status === 400) {
          return toast({
            title: 'Неправильна назва форуму',
            description:
              'Назва має бути унікальною, складатися з латиниці та мати від 3 до 10 символів.',
            variant: 'destructive',
          })
        }

        if (error.response?.status === 401) {
          return loginToast()
        }
      }

      toast({
        title: 'Щось пішло не так',
        variant: 'destructive',
      })
    },
    onSuccess: (data) => {
      router.push(`/c/${data}`)
    },
  })

  return (
    <div className="container mx-auto flex h-full max-w-3xl items-center">
      <div className="relative h-fit w-full gap-y-4 rounded-lg bg-card border p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Створити форум</h1>
        </div>

        <hr className="h-px bg-zinc-500" />

        <div>
          <p className="-mb-1 text-lg font-medium">Назва</p>
          <p className="pb-2 text-xs text-zinc-400">
            Назву форуму та формат тексту (великі літери) не можна буде змінити
          </p>

          <div className="relative">
            <p className="absolute inset-y-0 left-0 grid w-8 place-items-center text-sm text-zinc-400">
              c/
            </p>
            <Input
              className="pl-6 mt-2"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </div>
        </div>

        <div className="jsutify-end flex gap-3 mt-4">
          <Button variant="subtle" onClick={() => router.back()}>
            Скасувати
          </Button>
          <Button
            isLoading={isPending}
            disabled={input.length === 0}
            onClick={() => mutate()}
          >
            Створити форум
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Page
