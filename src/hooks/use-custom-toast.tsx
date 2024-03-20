import Link from 'next/link'
import { toast } from './use-toast'
import { buttonVariants } from '@/components/ui/Button'

export const useCustomToast = () => {
  const loginToast = () => {
    const { dismiss } = toast({
      title: 'Потрібна авторизація',
      description: 'Будь ласка, увійдіть, щоб виконати цю дію',
      variant: 'destructive',
      action: (
        <Link
          onClick={() => dismiss()}
          href="/login"
          className={buttonVariants({ variant: 'secondary' })}
        >
          Увійти
        </Link>
      ),
    })
  }

  return { loginToast }
}
