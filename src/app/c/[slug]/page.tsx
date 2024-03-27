import MiniCreateThread from '@/components/MiniCreateThread'
import ThreadFeed from '@/components/ThreadFeed'
import { INFINE_SCROLLING_PAGE_SIZE } from '@/config'
import { getSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { notFound } from 'next/navigation'
import { FC } from 'react'

interface PageProps {
  params: {
    slug: string
  }
}

const page: FC<PageProps> = async ({ params }) => {
  const { slug } = params

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
          comments: true,
          subforum: true,
        },
        take: INFINE_SCROLLING_PAGE_SIZE,
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  })

  if (!subforum) {
    return notFound()
  }

  return (
    <>
      <MiniCreateThread session={session} />
      <ThreadFeed
        initialThreads={subforum.threads}
        subforumName={subforum.name}
      />
    </>
  )
}

export default page
