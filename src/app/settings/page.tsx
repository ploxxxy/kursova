export const metadata = {
  title: 'Налаштування',
}

import UsernameForm from '@/components/forms/UserSettingsForm'
import { authOptions, getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { FC } from 'react'

const page: FC = async () => {
  const session = await getSession()

  if (!session?.user) {
    redirect(authOptions.pages?.signIn || '/login')
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="grid items-start gap-8">
        <h1 className="text-3xl font-bold md:text-4xl">Налаштування</h1>
      </div>

      <div className="grid gap-10 mt-6">
        <UsernameForm user={session.user} />
      </div>
    </div>
  )
}

export default page
