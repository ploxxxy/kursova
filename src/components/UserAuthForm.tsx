'use client'

import { Button } from '@/components/ui/Button'
import { signIn } from 'next-auth/react'
import { FC, useState } from 'react'
import { Icons } from './Icons'
import { useToast } from '@/hooks/use-toast'

const UserAuthForm: FC = () => {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const loginWithGoogle = async () => {
    setIsLoading(true)

    try {
      await signIn('google')
    } catch (error) {
      toast({
        title: 'Сталася помилка!',
        description:
          (error as Error)?.message ??
          'Спробуйте ще раз або зверніться до адміністратора',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={'flex justify-center'}>
      <Button
        isLoading={isLoading}
        onClick={loginWithGoogle}
        className="w-full"
      >
        {isLoading ? null : <Icons.google className="mr-2 h-4 w-4" />}
        Google
      </Button>
    </div>
  )
}

export default UserAuthForm
