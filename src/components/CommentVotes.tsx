'use client'

import { useCustomToast } from '@/hooks/use-custom-toast'
import { toast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'
import { CommentVoteRequest } from '@/lib/validators/vote'
import { usePrevious } from '@mantine/hooks'
import { VoteType } from '@prisma/client'
import { useMutation } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'
import { ArrowBigDown, ArrowBigUp } from 'lucide-react'
import { FC, useState } from 'react'
import { Button } from './ui/Button'

interface CommentVotesProps {
  commentId: string
  initialVotesAmount: number
  initialVote?: VoteType | undefined
}

const CommentVotes: FC<CommentVotesProps> = ({
  commentId,
  initialVotesAmount,
  initialVote,
}) => {
  const { loginToast } = useCustomToast()

  const [voteAmount, setVoteAmount] = useState(initialVotesAmount)
  const [currentVote, setCurrentVote] = useState(initialVote)
  const previousVote = usePrevious(currentVote)

  const { mutate } = useMutation({
    mutationFn: async (type: VoteType) => {
      const payload: CommentVoteRequest = {
        commentId,
        voteType: type,
      }

      await axios.patch('/api/subforum/thread/comment/vote', payload)
    },
    onError: (error, voteType) => {
      if (voteType === 'UPVOTE') setVoteAmount((prev) => prev - 1)
      else setVoteAmount((prev) => prev + 1)

      setCurrentVote(previousVote)

      if (error instanceof AxiosError) {
        if (error.response?.status === 401) loginToast()

        return
      }

      return toast({
        title: 'Щось пішло не так...',
        description: 'Твій голос не було зараховано. Спробуй ще раз пізніше.',
        variant: 'destructive',
      })
    },
    onMutate: (type: VoteType) => {
      if (currentVote === type) {
        setCurrentVote(undefined)

        if (type === 'UPVOTE') setVoteAmount((prev) => prev - 1)
        else setVoteAmount((prev) => prev + 1)
      } else {
        setCurrentVote(type)
        if (type === 'UPVOTE')
          setVoteAmount((prev) => prev + (currentVote ? 2 : 1))
        else setVoteAmount((prev) => prev - (currentVote ? 2 : 1))
      }
    },
  })

  return (
    <div className="flex items-center">
      <Button
        onClick={() => mutate('UPVOTE')}
        size="sm"
        variant="ghost"
        className="hover:bg-unset p-0 hover:text-green-500"
        aria-label="upvote"
      >
        <ArrowBigUp
          className={cn(
            'h-6 w-6',
            currentVote === 'UPVOTE' && 'fill-green-500 text-green-500',
          )}
        />
      </Button>

      <p
        className="px-2 text-center text-sm font-medium text-text-950"
        suppressHydrationWarning
      >
        {voteAmount}
      </p>

      <Button
        onClick={() => mutate('DOWNVOTE')}
        size="sm"
        variant="ghost"
        className="hover:bg-unset p-0 hover:text-red-500"
        aria-label="downvote"
      >
        <ArrowBigDown
          className={cn(
            'h-6 w-6',
            currentVote === 'DOWNVOTE' && 'fill-red-500 text-red-500',
          )}
        />
      </Button>
    </div>
  )
}

export default CommentVotes
