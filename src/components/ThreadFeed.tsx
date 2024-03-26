'use client'

import { INFINE_SCROLLING_PAGE_SIZE } from '@/config'
import { ExtendedThread } from '@/types/db'
import { useIntersection } from '@mantine/hooks'
import { useInfiniteQuery } from '@tanstack/react-query'
import axios from 'axios'
import { useSession } from 'next-auth/react'
import { FC, useRef } from 'react'
import Thread from './Thread'

interface ThreadFeedProps {
  initialThreads: ExtendedThread[]
  subforumName?: string
}

const ThreadFeed: FC<ThreadFeedProps> = ({ initialThreads, subforumName }) => {
  const lastThreadRef = useRef<HTMLElement>(null)

  const { ref, entry } = useIntersection({
    root: lastThreadRef.current,
    threshold: 1,
  })

  const { data: session } = useSession()

  const { data, fetchNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ['infinite-query'],
    queryFn: async ({ pageParam = 1 }) => {
      const query =
        `/api/threads?limit=${INFINE_SCROLLING_PAGE_SIZE}&page=${pageParam}` +
        (subforumName ? `&subforumName=${subforumName}` : '')

      const { data } = await axios.get(query)

      return data as ExtendedThread[]
    },
    getNextPageParam: (_lastPage, allPages) => {
      return allPages.length + 1
    },
    initialPageParam: 1,
    initialData: { pages: [initialThreads], pageParams: [1] },
  })

  const threads = data?.pages.flatMap((page) => page) ?? initialThreads

  return (
    <ul className="col-span-2 flex flex-col gap-y-4">
      {threads.map((thread, index) => {
        const voteAmount = thread.votes.reduce((acc, vote) => {
          if (vote.type === 'UPVOTE') return acc + 1
          if (vote.type === 'DOWNVOTE') return acc - 1
          return acc
        }, 0)

        const currentVote = thread.votes.find(
          (vote) => vote.userId === session?.user.id,
        )

        return (
          <li key={thread.id} ref={index === threads.length - 1 ? ref : null}>
            <Thread
              subforumName={thread.subforum.name}
              thread={thread}
              commentAmount={thread.comments.length}
            />
          </li>
        )
      })}
    </ul>
  )
}

export default ThreadFeed
