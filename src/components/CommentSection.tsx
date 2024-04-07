import { getSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { FC } from 'react'
import ThreadComment from './ThreadComment'
import CommentEditor from './CommentEditor'

interface CommentSectionProps {
  threadId: string
  authorId: string
  accessGranted: boolean
}

const CommentSection: FC<CommentSectionProps> = async ({
  threadId,
  authorId,
  accessGranted,
}) => {
  const session = await getSession()
  const comments = await db.comment.findMany({
    where: {
      threadId,
      replyToId: null,
    },
    include: {
      author: true,
      votes: true,
      replies: {
        include: {
          author: true,
          votes: true,
        },
      },
    },
  })

  return (
    <div className="mt-4 flex flex-col gap-y-4">
      <hr className="h-px w-full" />

      <CommentEditor threadId={threadId} />

      <div className="mt-4 flex flex-col gap-y-6">
        {comments
          .filter((comment) => !comment.replyToId)
          .sort((a, b) => b.votes.length - a.votes.length)
          .map((topLevelComment) => {
            const topLevelCommentVotesAmount = topLevelComment.votes.reduce(
              (acc, vote) => {
                if (vote.type === 'UPVOTE') return acc + 1
                if (vote.type === 'DOWNVOTE') return acc - 1
                return acc
              },
              0,
            )

            const topLevelCommentVote = topLevelComment.votes.find(
              (vote) => vote.userId === session?.user.id,
            )

            return (
              <div key={topLevelComment.id} className="flex flex-col">
                <ThreadComment
                  accessGranted={accessGranted}
                  isOP={topLevelComment.authorId === authorId}
                  comment={topLevelComment}
                  currentVote={topLevelCommentVote?.type}
                  votesAmount={topLevelCommentVotesAmount}
                />

                <div className="relative space-y-2 pl-6">
                  <div className="absolute inset-0 h-full w-1 bg-border" />

                  {topLevelComment.replies
                    .sort((a, b) => b.votes.length - a.votes.length)
                    .map((reply) => {
                      const replyVotesAmount = reply.votes.reduce(
                        (acc, vote) => {
                          if (vote.type === 'UPVOTE') return acc + 1
                          if (vote.type === 'DOWNVOTE') return acc - 1
                          return acc
                        },
                        0,
                      )

                      const replyVote = reply.votes.find(
                        (vote) => vote.userId === session?.user.id,
                      )

                      return (
                        <ThreadComment
                          accessGranted={accessGranted}
                          isOP={reply.authorId === authorId}
                          key={reply.id}
                          comment={reply}
                          currentVote={replyVote?.type}
                          votesAmount={replyVotesAmount}
                        />
                      )
                    })}
                </div>
              </div>
            )
          })}
      </div>
    </div>
  )
}

export default CommentSection
