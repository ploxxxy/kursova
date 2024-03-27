import { Thread, Vote, VoteType } from '@prisma/client'
import { getSession } from 'next-auth/react'
import { notFound } from 'next/navigation'
import { FC } from 'react'
import ThreadVoteClient from './ThreadVoteClient'

interface ThreadVoteServerProps {
  threadId: string
  initialVotesAmount?: number
  initialVote?: VoteType | null
  getData?: () => Promise<(Thread & { votes: Vote[] }) | null>
}

const ThreadVoteServer: FC<ThreadVoteServerProps> = async ({
  threadId,
  initialVotesAmount,
  initialVote,
  getData,
}) => {
  const session = await getSession()

  let voteAmount = 0
  let currentVote: VoteType | null | undefined = undefined

  if (getData) {
    const thread = await getData()
    if (!thread) return notFound()

    voteAmount = thread.votes.reduce((acc, vote) => {
      if (vote.type === 'UPVOTE') return acc + 1
      if (vote.type === 'DOWNVOTE') return acc - 1
      return acc
    }, 0)

    currentVote = thread.votes.find(
      (vote) => vote.userId === session?.user?.id,
    )?.type
  } else {
    voteAmount = initialVotesAmount || 0
    currentVote = initialVote
  }

  return (
    <ThreadVoteClient
      initialVotesAmount={voteAmount}
      threadId={threadId}
      initialVote={currentVote}
    />
  )
}

export default ThreadVoteServer
