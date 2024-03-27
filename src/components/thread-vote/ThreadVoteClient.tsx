'use client'

import { useCustomToast } from '@/hooks/use-custom-toast'
import { cn } from '@/lib/utils'
import { ThreadVoteRequest } from '@/lib/validators/vote'
import { usePrevious } from '@mantine/hooks'
import { VoteType } from '@prisma/client'
import { useMutation } from '@tanstack/react-query'
import { ArrowBigDown, ArrowBigUp } from 'lucide-react'
import { FC, useEffect, useState } from 'react'
import { Button } from '../ui/Button'
import axios, { AxiosError } from 'axios'
import { toast } from '@/hooks/use-toast'

interface ThreadVoteClientProps {
  threadId: string
  initialVotesAmount: number
  initialVote?: VoteType | null
}

const ThreadVoteClient: FC<ThreadVoteClientProps> = ({
  threadId,
  initialVotesAmount,
  initialVote,
}) => {
  const { loginToast } = useCustomToast()

  const [voteAmount, setVoteAmount] = useState(initialVotesAmount)
  const [currentVote, setCurrentVote] = useState(initialVote)
  const previousVote = usePrevious(currentVote)

  useEffect(() => {
    setCurrentVote(initialVote)
  }, [initialVote])

  const { mutate } = useMutation({
    mutationFn: async (type: VoteType) => {
      const payload: ThreadVoteRequest = {
        threadId: threadId,
        voteType: type,
      }

      await axios.patch('/api/subforum/thread/vote', payload)
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
    <div className="flex flex-col px-3 pt-8">
      <Button
        onClick={() => mutate('UPVOTE')}
        size="sm"
        variant="ghost"
        className="hover:bg-unset -mb-2 p-0 hover:text-primary-400"
        aria-label="upvote"
      >
        <ArrowBigUp
          className={cn(
            'h-5 w-5',
            currentVote === 'UPVOTE' && 'fill-primary text-primary',
          )}
        />
      </Button>

      <p className="py-2 text-center text-sm font-medium text-text-950">
        {voteAmount}
      </p>

      <Button
        onClick={() => mutate('DOWNVOTE')}
        size="sm"
        variant="ghost"
        className="hover:bg-unset -mt-2 p-0 hover:text-secondary-200"
        aria-label="upvote"
      >
        <ArrowBigDown
          className={cn(
            'h-5 w-5',
            currentVote === 'DOWNVOTE' && 'fill-secondary text-secondary',
          )}
        />
      </Button>
    </div>
  )
}

export default ThreadVoteClient
