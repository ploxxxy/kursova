import GeneralFeed from '@/components/feed/GeneralFeed'
import PersonalFeed from '@/components/feed/PersonalFeed'
import { buttonVariants } from '@/components/ui/Button'
import { getSession } from '@/lib/auth'
import { HomeIcon } from 'lucide-react'
import Link from 'next/link'

export default async function Home() {
  const session = await getSession()

  return (
    <>
      <h1 className="text-3xl font-bold md:text-4xl">Твоя стрічка</h1>
      <div className="grid grid-cols-1 gap-y-4 py-6 md:grid-cols-3 md:gap-x-4">
        {session ? <PersonalFeed session={session} /> : <GeneralFeed />}

        <div className="order-first h-fit overflow-hidden rounded-lg border md:order-last">
          <div className="bg-secondary px-6 py-4 text-text"></div>

          <div className="bg-card px-6 py-4 leading-6">
            <p className="flex items-center gap-1 py-3 text-xl font-semibold">
              <HomeIcon className="mr-2 h-6 w-6" />
              Домашня сторінка
            </p>
            <div className="gap-x 4 mb-2 flex justify-between py-3 text-sm">
              <p className="">Твоя персоналізована домашня сторінка 🌞</p>
            </div>

            <Link
              href="/c/create"
              className={buttonVariants({
                className: 'w-full',
              })}
            >
              Створити форум
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
