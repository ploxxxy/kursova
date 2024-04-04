import SubscribeToggle from '@/components/SubscribeToggle'
import ToFeedButton from '@/components/ToFeedButton'
import { buttonVariants } from '@/components/ui/Button'
import { getSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { formatTime } from '@/lib/utils'
import Link from 'next/link'
import { notFound } from 'next/navigation'

const Layout = async ({
  children,
  params: { slug },
}: {
  children: React.ReactNode
  params: { slug: string }
}) => {
  const session = await getSession()
  const subforum = await db.subforum.findFirst({
    where: {
      name: slug,
    },
    include: {
      threads: {
        include: {
          author: true,
          votes: true,
        },
      },
    },
  })

  const subscription = !session?.user
    ? undefined
    : await db.subscription.findFirst({
      where: {
        subforum: {
          name: slug,
        },
        user: {
          id: session.user.id,
        },
      },
    })

  const isSubscribed = !!subscription
  if (!subforum) return notFound()

  const memberCount = await db.subscription.count({
    where: {
      subforum: {
        name: slug,
      },
    },
  })

  return (
    <div className="mx-auto h-full max-w-7xl sm:container">
      <div>
        <ToFeedButton />
        <h1 className="text-3xl font-bold md:text-4xl">c/{subforum.name}</h1>
      </div>
      <div className="grid grid-cols-1 gap-y-4 py-6 md:grid-cols-3 md:gap-x-4">
        <div className="col-span-2 flex flex-col gap-4">{children}</div>

        <div className="order-first h-fit overflow-hidden rounded-lg border md:order-last md:block">
          <div className="bg-secondary px-6 py-4">
            <p className="font-semibold text-secondary-foreground">
              Про c/{subforum.name}
            </p>
          </div>

          <dl className="bg-card px-6 py-4 text-sm leading-6">
            <div className="flex justify-between gap-x-4 py-1">
              <dt className="text-muted-foreground">Створено</dt>
              <dd>
                <time dateTime={subforum.createdAt.toString()}>
                  {formatTime(subforum.createdAt)}
                </time>
              </dd>
            </div>

            <div className="flex justify-between gap-x-4 py-1">
              <dt className="text-muted-foreground">Учасників</dt>
              <dd>
                <div>{memberCount}</div>
              </dd>
            </div>

            <hr className="my-3 h-px" />

            {subforum.creatorId === session?.user.id ? (
              <div className="flex justify-between gap-x-4 py-3">
                <p>Ви створили цей форум</p>
              </div>
            ) : (
              <SubscribeToggle
                subforumId={subforum.id}
                subforumName={subforum.name}
                isSubscribed={isSubscribed}
              />
            )}

            <Link
              href={`/c/${slug}/submit`}
              className={buttonVariants({
                variant: 'outline',
                className: 'w-full',
              })}
            >
              Створити тему
            </Link>
          </dl>
        </div>
      </div>
    </div>
  )
}

export default Layout
