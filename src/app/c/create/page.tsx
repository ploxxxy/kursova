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
    <div className="container flex items-center h-full max-w-3xl mx-auto">
      <div className="relative bg-white w-full h-fit p-4 rounded-lg space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-semibold">Створити форум</h1>
        </div>

        <hr className="bg-zinc-500 h-px" />

        <div>
          <p className="text-lg font-medium -mb-1">Назва</p>
          <p className="text-xs pb-2 text-zinc-400">
            Назву форуму та формат тексту не можна буде змінити
          </p>

          <div className="relative">
            <p className="absolute text-sm left-0 w-8 inset-y-0 grid place-items-center text-zinc-400">
              c/
            </p>
            <Input
              className="pl-6"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </div>
        </div>

        <div className="flex jsutify-end gap-4">
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
