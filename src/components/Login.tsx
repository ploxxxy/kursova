import { FC } from 'react'
import { Icons } from './Icons'
import Link from 'next/link'
import UserAuthForm from './UserAuthForm'

const Login: FC = () => {
  return (
    <div className="container mx-auto flex w-full flex-col justify-center sm:w-[400px]">
      <div className="flex flex-col text-center gap-2">
        <div className="flex justify-center gap-2 items-center">
          <Icons.logo className="h-8 w-8" />
          <h1 className="text-3xl font-bold">Веб-форум ЄУ</h1>
        </div>
        <h3 className="text-2xl font-semibold tracking-tight">
          Ласкаво просимо
        </h3>
        <p className="text-sm mx-auto">
          Для авторизації на нашому порталі, будь ласка, використайте свій
          Корпоративний акаунт Європейського університету (закінчується на
          @e-u.edu.ua)
        </p>

        <p className="text-sm max-w-xs mx-auto text-zinc-500 my-4">
          Після продовження, Ви надаєте згоду на обробку персональних даних
        </p>

        <UserAuthForm />

        <p className="px-8 text-center text-sm text-zinc-500">
          Не маєш акаунту?{' '}
          <Link
            href="https://e-u.edu.ua/ua/"
            rel="noreferrer noopener"
            target="_blank"
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
