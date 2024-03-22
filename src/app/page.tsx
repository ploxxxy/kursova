import { buttonVariants } from '@/components/ui/Button'
import { HomeIcon } from 'lucide-react'
import Link from 'next/link'

export default function Home() {
  return (
    <>
      <h1 className="text-3xl font-bold md:text-4xl">Твоя стрічка</h1>
      <div className="grid grid-cols-1 gap-y-4 py-6 md:grid-cols-3 md:gap-x-4">
        <div className="order-first h-fit overflow-hidden rounded-lg border md:order-last">
          <div className="text-text bg-secondary px-6 py-4"></div>

          <div className="bg-card px-6 py-4 leading-6">
            <p className="flex items-center gap-1 py-3 text-xl font-semibold">
              <HomeIcon className="mr-2 h-6 w-6" />
              Домашня сторінка
            </p>
            <div className="gap-x 4 flex justify-between py-3 text-sm mb-2">
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
