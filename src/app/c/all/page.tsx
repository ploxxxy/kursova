import GeneralFeed from '@/components/feed/GeneralFeed'
import { buttonVariants } from '@/components/ui/Button'
import { Globe } from 'lucide-react'
import Link from 'next/link'

export default async function Home() {
  return (
    <>
      <h1 className="text-3xl font-bold md:text-4xl">Глобальна стрічка</h1>
      <div className="grid grid-cols-1 gap-y-4 py-6 md:grid-cols-3 md:gap-x-4">
        <GeneralFeed />

        <div className="order-first h-fit overflow-hidden rounded-lg border md:order-last">
          <div className="bg-secondary px-6 py-4 text-text"></div>

          <div className="bg-card px-6 py-4 leading-6">
            <p className="flex items-center gap-1 py-3 text-xl font-semibold">
              <Globe className="mr-2 h-6 w-6" />
              Глобальна стрічка
            </p>
            <div className="mb-2 justify-between py-3 text-sm">
              <p className="mb-4">Тут можна переглянути всі теми форуму 🌚</p>
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
