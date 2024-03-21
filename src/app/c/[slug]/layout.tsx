import SubscribeToggle from '@/components/SubscribeToggle'
import { getSession } from '@/lib/auth'
import { db } from '@/lib/db'
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
    <div className="mx-auto h-full max-w-7xl pt-12 sm:container">
      <div>
        <div className="grid grid-cols-1 gap-y-4 py-6 md:grid-cols-3 md:gap-x-4">
          <div className="col-span-2 flex flex-col space-y-6">{children}</div>

          <div className="order-first hidden h-fit overflow-hidden rounded-lg border border-gray-300 bg-orange-200 md:order-last md:block">
            <div className="px-6 py-4">
              <p className="py-3 font-semibold">Про c/{subforum.name}</p>
            </div>

            <dl className="divide-y divide-gray-100 bg-white px-6 py-4 text-sm leading-6">
              <div className="flex justify-between gap-x-4 py-3">
                <dt className="text-gray-500">Створено</dt>
                <dd className="text-gray-700">
                  <time dateTime={subforum.createdAt.toString()}>
                    {subforum.createdAt.toLocaleDateString('uk-UA', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </time>
                </dd>
              </div>

              <div className="flex justify-between gap-x-4 py-3">
                <dt className="text-gray-500">Учасників</dt>
                <dd className="text-gray-700">
                  <div className="text-gray-900">{memberCount}</div>
                </dd>
              </div>

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
            </dl>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Layout
