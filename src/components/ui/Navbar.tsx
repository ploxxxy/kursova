import Link from 'next/link'
import { Icons } from '../Icons'
import { buttonVariants } from '@/components/ui/Button'
import { getSession } from '@/lib/auth'
import UserAccountNav from '../UserAccountNav'
import { cn } from '@/lib/utils'

const Navbar = async () => {
  const session = await getSession()

  return (
    <div className="fixed top-0 inset-x-0 bg-zinc-100 border-b border-zinc-300 z-[10] py-2">
      <div className="container max-w-7xl h-full mx-auto flex items-center justify-between gap-2">
        <Link
          href="/"
          className={cn('gap-2', buttonVariants({ variant: 'subtle' }))}
        >
          <Icons.logo className="h-8 w-8 sm:h-6 sm:w-6" />
          <p className="hidden text-zinc-700 text-sm font-medium md:block">
            Форум
          </p>
        </Link>

        {/* TODO: add a search bar */}

        {session?.user ? (
          <UserAccountNav user={session.user} />
        ) : (
          <Link href="/login" className={buttonVariants()}>
            Увійти
          </Link>
        )}
      </div>
    </div>
  )
}

export default Navbar
