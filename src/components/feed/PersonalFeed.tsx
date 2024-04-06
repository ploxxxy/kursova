import { INFINE_SCROLLING_PAGE_SIZE } from '@/config'
import { db } from '@/lib/db'
import { Session } from 'next-auth'
import { FC } from 'react'
import ThreadFeed from '../ThreadFeed'

interface PersonalFeedProps {
  session: Session
}

const PersonalFeed: FC<PersonalFeedProps> = async ({ session }) => {
  const followedCommunities = await db.subscription.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      subforum: true,
    },
  })

  const threads = await db.thread.findMany({
    where: {
      subforum: {
        name: {
          in: followedCommunities.map(({ subforum }) => subforum.id),
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      votes: true,
      author: true,
      comments: true,
      subforum: true,
    },
    take: INFINE_SCROLLING_PAGE_SIZE,
  })

  return <ThreadFeed initialThreads={threads} />
}

export default PersonalFeed
