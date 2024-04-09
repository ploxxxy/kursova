'use client'

import { formatTimeToNow } from '@/lib/utils'
import type { Thread, User, Vote } from '@prisma/client'
import { Globe, MessageSquare, Users } from 'lucide-react'
import { FC, useEffect, useRef } from 'react'
import EditorOutput from './EditorOutput'
import ThreadVoteClient from './thread-vote/ThreadVoteClient'
import Link from 'next/link'
import Username from './Username'

type PartialVote = Pick<Vote, 'type'>

interface ThreadProps {
  subforumTitle?: string | null
  subforumName: string
  thread: Thread & {
    author: User
    votes: Vote[]
  }
  commentAmount: number
  voteAmount: number
  currentVote?: PartialVote
}

const Thread: FC<ThreadProps> = ({
  subforumTitle,
  subforumName,
  thread,
  commentAmount,
  voteAmount,
  currentVote,
}) => {
  const threadRef = useRef<HTMLDivElement>(null)

  return (
    <div
      className="rounded-md border bg-card shadow transition-shadow hover:shadow-lg"
      // onClick={() => {
      //   window.location.href = `/c/${subforumName}/thread/${thread.id}`
      // }}
    >
      <div className="flex justify-between px-4 py-2 pl-0">
        <ThreadVoteClient
          threadId={thread.id}
          initialVote={currentVote?.type}
          initialVotesAmount={voteAmount}
        />

        <div className="w-0 flex-1">
          <div className="mt-1 flex max-h-40 items-center text-xs text-text">
            <Link
              className="max-w-36 sm:max-w-none items-center gap-1 truncate text-sm text-text-800 hover:text-text-950 hover:underline"
              href={`/c/${subforumName}`}
            >
              <Globe className="h-4 w-4 inline mr-1 mb-px" />
              {subforumTitle ?? `c/${subforumName}`}
            </Link>
            <span className="px-1">•</span>
            <Username user={thread.author} />
            <span className="px-1">•</span>
            <span suppressHydrationWarning className='text-nowrap'>
              {formatTimeToNow(thread.createdAt)}
            </span>
          </div>

          <Link href={`/c/${subforumName}/thread/${thread.id}`}>
            <h1 className="py-2 text-lg font-semibold leading-6 text-text-950 hover:text-text-700 hover:underline">
              {thread.title}
            </h1>
          </Link>

          <div
            className="relative max-h-80 w-full overflow-clip text-sm"
            ref={threadRef}
          >
            <EditorOutput content={thread.content} />

            {threadRef.current?.clientHeight == 320 ? (
              <div className="pointer-events-none absolute bottom-0 left-0 h-48 w-full bg-gradient-to-t from-card to-transparent" />
            ) : null}
          </div>
        </div>
      </div>

      <div className="flex justify-between bg-background-50 p-4 text-sm sm:px-6">
        <Link
          className="flex w-fit items-center gap-2 hover:underline"
          href={`/c/${subforumName}/thread/${thread.id}`}
        >
          <MessageSquare className="h-4 w-4" />
          {commentAmount} {formatText(commentAmount)}
        </Link>
      </div>
    </div>
  )
}

const formatText = (commentAmount: number) => {
  switch (commentAmount) {
    case 11:
    case 12:
    case 13:
    case 14:
      return 'коментарів'
  }

  const lastDigit = commentAmount % 10

  switch (lastDigit) {
    case 1:
      return 'коментар'
    case 2:
    case 3:
    case 4:
      return 'коментарі'
    default:
      return 'коментарів'
  }
}

export default Thread
