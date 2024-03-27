import { INFINE_SCROLLING_PAGE_SIZE } from '@/config'
import { db } from '@/lib/db'
import ThreadFeed from '../ThreadFeed'

const GeneralFeed = async () => {
  const threads = await db.thread.findMany({
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

export default GeneralFeed
