'use client'

import { useCustomToast } from '@/hooks/use-custom-toast'
import { SubscribeToSubforumPayload } from '@/lib/validators/subforum'
import { useMutation } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'
import { FC, startTransition } from 'react'
import { Button } from './ui/Button'
import { toast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'

interface SubscribeToggleProps {
  subforumId: string
  subforumName: string
  isSubscribed: boolean
}

const SubscribeToggle: FC<SubscribeToggleProps> = ({
  subforumId,
  subforumName,
  isSubscribed,
}) => {
  const router = useRouter()
  const { loginToast } = useCustomToast()

  const { mutate: subscribe, isPending: isPendingSubscription } = useMutation({
    mutationFn: async () => {
      const payload: SubscribeToSubforumPayload = {
        subforumId,
      }

      const { data } = await axios.post('/api/subforum/subscribe', payload)
      return data as string
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          return loginToast()
        }
      }

      return toast({
        title: 'Щось пішло не так',
        variant: 'destructive',
      })
    },
    onSuccess: () => {
      startTransition(() => {
        router.refresh()
      })

      return toast({
        title: 'Успіх',
        description: `Ви успішно підписались на форум c/${subforumName}`,
      })
    },
  })

  const { mutate: unsubscribe, isPending: isPendingUnsubscription } =
    useMutation({
      mutationFn: async () => {
        const payload: SubscribeToSubforumPayload = {
          subforumId,
        }

        const { data } = await axios.post('/api/subforum/unsubscribe', payload)
        return data as string
      },
      onError: (error) => {
        if (error instanceof AxiosError) {
          if (error.response?.status === 401) {
            return loginToast()
          }
        }

        return toast({
          title: 'Щось пішло не так',
          variant: 'destructive',
        })
      },
      onSuccess: () => {
        startTransition(() => {
          router.refresh()
        })

        return toast({
          title: 'Успіх',
          description: `Ви успішно покинули форум c/${subforumName}`,
        })
      },
    })

  return isSubscribed ? (
    <Button
      isLoading={isPendingUnsubscription}
      className="my-1 w-full"
      onClick={() => unsubscribe()}
    >
      Покинути форум
    </Button>
  ) : (
    <Button
      isLoading={isPendingSubscription}
      className="my-1 w-full"
      onClick={() => subscribe()}
    >
      Приєднатися
    </Button>
  )
}

export default SubscribeToggle
