import GeneralFeed from '@/components/feed/GeneralFeed'
import PersonalFeed from '@/components/feed/PersonalFeed'
import { buttonVariants } from '@/components/ui/Button'
import { getSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { Subforum } from '@prisma/client'
import { HomeIcon, Users } from 'lucide-react'
import Link from 'next/link'

export default async function Home() {
  const session = await getSession()

  let followedCommunities:
    | { subforum: Subforum; userId: string; subforumId: string }[]
    | null = null

  if (session) {
    followedCommunities = await db.subscription.findMany({
      where: {
        userId: session?.user.id,
      },
      include: {
        subforum: true,
      },
      take: 5,
    })
  }

  const accessGranted =
    session?.user.role === 'ADMIN' || session?.user.role === 'MODERATOR'

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
            <div className="mb-2 justify-between py-3 text-sm">
              <p className="mb-4">Твоя персоналізована домашня сторінка 🌞</p>

              {session ? (
                <div className="flex flex-col gap-1">
                  {followedCommunities ? (
                    <>
                      <p className="text-xs text-text">
                        Дані підтягуються з таких форумів, як:
                      </p>
                      {followedCommunities.map(({ subforum, subforumId }) => (
                        <Link
                          className="flex items-center gap-1 hover:underline"
                          key={subforumId}
                          href={`/c/${subforum.name}`}
                        >
                          <Users className="h-4 w-4" />
                          {subforum.name}
                        </Link>
                      ))}
                    </>
                  ) : (
                    <p className="text-xs text-text">
                      Ти ще не підписався на жоден форум!
                    </p>
                  )}
                </div>
              ) : (
                <span className="text-red-500">
                  Увійди до свого акаунту, щоб отримати персоналізовану сторінку
                </span>
              )}
            </div>

            {accessGranted && (
              <Link
                href="/c/create"
                className={buttonVariants({
                  className: 'w-full',
                })}
              >
                Створити форум
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
