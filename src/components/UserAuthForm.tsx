'use client'

import { Button } from '@/components/ui/Button'
import { signIn } from 'next-auth/react'
import { FC, useState } from 'react'
import { Icons } from './Icons'
import { useToast } from '@/hooks/use-toast'
import { User } from 'lucide-react'

const UserAuthForm: FC = () => {
  const [isLoadingGoogle, setIsLoadingGoogle] = useState(false)
  const [isLoadingDemo, setIsLoadingDemo] = useState(false)

  const { toast } = useToast()

  const loginWithGoogle = async () => {
    setIsLoadingGoogle(true)

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
      setIsLoadingGoogle(false)
    }
  }

  const loginIntoDemoAccount = async () => {
    setIsLoadingDemo(true)

    try {
      await signIn('credentials')
    } catch (error) {
      toast({
        title: 'Сталася помилка!',
        description:
          (error as Error)?.message ??
          'Спробуйте ще раз або зверніться до адміністратора',
        variant: 'destructive',
      })
    } finally {
      setIsLoadingDemo(false)
    }
  }

  return (
    <div className='flex justify-center gap-2'>
      <Button
        variant="outline"
        isLoading={isLoadingGoogle}
        onClick={loginWithGoogle}
        className="w-full"
      >
        {isLoadingGoogle ? null : <Icons.google className="mr-2 h-4 w-4" />}
        Google
      </Button>

      <Button
        variant="outline"
        isLoading={isLoadingDemo}
        onClick={loginIntoDemoAccount}
        className="w-full"
      >
        {isLoadingDemo ? null : <User className="mr-2 h-4 w-4" />}
        Демо-акаунт
      </Button>
    </div>
  )
}

export default UserAuthForm
