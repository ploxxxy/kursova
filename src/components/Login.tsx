import { FC } from 'react'
import { Icons } from './Icons'
import Link from 'next/link'
import UserAuthForm from './UserAuthForm'

const Login: FC = () => {
  return (
    <div className="container mx-auto flex w-full flex-col justify-center sm:w-[400px]">
      <div className="flex flex-col gap-2 text-center">
        <div className="flex items-center justify-center gap-2">
          <Icons.logo className="h-8 w-8" />
          <h1 className="text-3xl font-bold">Веб-форум ЄУ</h1>
        </div>
        <h3 className="text-2xl font-semibold tracking-tight">
          Ласкаво просимо
        </h3>
        <p className="mx-auto text-sm">
          Для авторизації на нашому порталі, будь ласка, використайте свій
          Корпоративний акаунт Європейського університету (закінчується на
          @e-u.edu.ua)
        </p>

        <p className="mx-auto my-4 max-w-xs text-sm text-muted-foreground">
          Після продовження, Ви надаєте згоду на обробку персональних даних
        </p>

        <UserAuthForm />

        <p className="px-8 text-center text-sm text-muted-foreground">
          Не маєш акаунту?{' '}
          <Link
            href="https://e-u.edu.ua/ua/"
            rel="noreferrer noopener"
            target="_blank"
            className="text-sm underline underline-offset-2 hover:text-text"
          >
            Зареєструватися
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login
