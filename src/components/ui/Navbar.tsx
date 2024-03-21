import Link from 'next/link'
import { Icons } from '../Icons'
import { buttonVariants } from '@/components/ui/Button'
import { getSession } from '@/lib/auth'
import UserAccountNav from '../UserAccountNav'
import { cn } from '@/lib/utils'

const Navbar = async () => {
  const session = await getSession()

  return (
    <div className="fixed inset-x-0 top-0 z-[10] border-b border-zinc-300 bg-zinc-100 py-2">
      <div className="container mx-auto flex h-full max-w-7xl items-center justify-between gap-2">
        <Link
          href="/"
          className={cn('gap-2', buttonVariants({ variant: 'subtle' }))}
        >
          <Icons.logo className="h-8 w-8 sm:h-6 sm:w-6" />
          <p className="hidden text-sm font-medium text-zinc-700 md:block">
            Форум
          </p>
        </Link>

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
