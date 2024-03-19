import { FC } from 'react'
import { Icons } from './Icons'
import Link from 'next/link'
import UserAuthForm from './UserAuthForm'

const Login: FC = () => {
  return (
    <div className="container mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
      <div className="flex flex-col space-y-2 text-center">
        <Icons.logo className="mx-auto h-6 w-6" />
        <h1 className="text-2xl font-semibold tracking-tight">
          Ласкаво просимо
        </h1>
        <p className="text-sm max-w-xs mx-auto">
          By continuing, you agree to our User Agreement and Privacy Policy
        </p>

        <UserAuthForm />

        <p className="px-8 text-center text-sm text-zinc-500">
          Не маєш акаунту?{' '}
          <Link
            href="/register"
            className="hover:text-zinc-800 text-sm underline underline-offset-2"
          >
            Зареєструватися
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login
