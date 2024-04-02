import Link from 'next/link'
import { Icons } from '../Icons'
import { buttonVariants } from '@/components/ui/Button'
import { getSession } from '@/lib/auth'
import UserAccountNav from '../UserAccountNav'
import { cn } from '@/lib/utils'
import Searchbar from '../Searchbar'

const Navbar = async () => {
  const session = await getSession()

  return (
    <div className="fixed inset-x-0 top-0 z-[10] border-b bg-card py-2">
      <div className="container mx-auto flex h-full max-w-7xl items-center justify-between gap-2">
        <Link
          href="/"
          className={buttonVariants({ variant: 'ghost', className: 'gap-2 !px-2' })}
        >
          <Icons.logo className="h-8 w-8 sm:h-6 sm:w-6" />
          <p className="hidden text-sm font-medium md:block text-foreground">
            Форум
          </p>
        </Link>

        <Searchbar />

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
