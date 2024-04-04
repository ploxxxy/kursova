'use client'

import { formatTimeToNow } from '@/lib/utils'
import { Comment, CommentVote, User, VoteType } from '@prisma/client'
import { MessageSquare, Pencil } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { FC, useRef, useState } from 'react'
import CommentEditor from './CommentEditor'
import CommentVotes from './CommentVotes'
import UserAvatar from './UserAvatar'
import { Button } from './ui/Button'
import Username from './Username'
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/Tooltip'

type ExtendedComment = Comment & { votes: CommentVote[]; author: User }

interface ThreadCommentProps {
  comment: ExtendedComment
  votesAmount: number
  currentVote: VoteType | undefined
  isOP?: boolean
}

const ThreadComment: FC<ThreadCommentProps> = ({
  comment,
  votesAmount,
  currentVote,
  isOP,
}) => {
  const commentRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const { data: session } = useSession()
  const [isReplying, setIsReplying] = useState(false)

  return (
    <div ref={commentRef} className="flex flex-col">
      <div className="flex items-center">
        <UserAvatar
          user={{
            name: comment.author.name || null,
            image: comment.author.image || null,
          }}
          className="h-6 w-6"
        />

        <div className="ml-2 flex items-baseline gap-x-2">
          <Username className="text-sm font-medium" user={comment.author} />
          {isOP && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Pencil className="h-4 w-4 self-center text-secondary" />
              </TooltipTrigger>
              <TooltipContent className='p-2 bg-card border text-text shadow'>Цей користувач створив поточну тему</TooltipContent>
            </Tooltip>
          )}
          <p
            className="max-h-40 truncate text-xs text-text"
            suppressHydrationWarning
          >
            {formatTimeToNow(comment.createdAt)}
          </p>
        </div>
      </div>

      <p className="mt-2 text-sm">{comment.text}</p>

      <div className="flex flex-col">
        <div className="flex items-center">
          <CommentVotes
            commentId={comment.id}
            initialVotesAmount={votesAmount}
            initialVote={currentVote}
          />
          <Button
            variant="link"
            className="text-text"
            onClick={() => {
              if (!session) return router.push('/login')
              setIsReplying(true)
            }}
          >
            <MessageSquare className="mr-1.5 h-4 w-4" />
            Відповісти
          </Button>
        </div>

        {isReplying && (
          <CommentEditor
            inlineComment
            threadId={comment.threadId}
            replyToId={comment.replyToId || comment.id}
            onClose={() => setIsReplying(false)}
          />
        )}
      </div>
    </div>
  )
}

export default ThreadComment
