'use client'

import { formatTimeToNow } from '@/lib/utils'
import { Thread, User, Vote } from '@prisma/client'
import { MessageSquare } from 'lucide-react'
import { FC, useRef } from 'react'
import EditorOutput from './EditorOutput'
import ThreadVoteClient from './thread-vote/ThreadVoteClient'

type PartialVote = Pick<Vote, 'type'>

interface ThreadProps {
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
      <div className="flex justify-between pl-0 px-4 py-2">
        <ThreadVoteClient
          threadId={thread.id}
          initialVote={currentVote?.type}
          initialVotesAmount={voteAmount}
        />

        <div className="w-0 flex-1">
          <div className="mt-1 max-h-40 text-xs text-muted-foreground">
            {subforumName ? (
              <>
                <a
                  className="text-sm text-text-950 underline underline-offset-2 hover:text-primary"
                  href={`/c/${subforumName}`}
                >
                  c/{subforumName}
                </a>

                <span className="px-1">•</span>
              </>
            ) : null}
            <span>{thread.author.name}</span>
            <span className="px-1">•</span>
            {formatTimeToNow(thread.createdAt)}
          </div>

          <a href={`/c/${subforumName}/thread/${thread.id}`}>
            <h1 className="py-2 text-lg font-semibold leading-6 text-text-950 hover:text-text-700 hover:underline">
              {thread.title}
            </h1>
          </a>

          <div
            className="relative max-h-40 w-full overflow-clip text-sm"
            ref={threadRef}
          >
            <EditorOutput content={thread.content} />

            {threadRef.current?.clientHeight === 160 ? (
              <div className="absolute bottom-0 left-0 h-24 w-full bg-gradient-to-t from-card to-transparent" />
            ) : null}
          </div>
        </div>
      </div>

      <div className="z-20 bg-background-50 p-4 text-sm sm:px-6">
        <a
          className="flex w-fit items-center gap-2 hover:underline"
          href={`/c/${subforumName}/thread/${thread.id}`}
        >
          <MessageSquare className="h-4 w-4" />
          {commentAmount} коментарів
        </a>
      </div>
    </div>
  )
}

export default Thread