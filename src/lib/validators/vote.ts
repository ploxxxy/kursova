import { z } from 'zod'

export const ThreadVoteValidator = z.object({
  threadId: z.string(),
  voteType: z.enum(['UPVOTE', 'DOWNVOTE']),
})

export type ThreadVoteRequest = z.infer<typeof ThreadVoteValidator>

export const CommentVoteValidator = z.object({
  comment: z.string(),
  voteType: z.enum(['UPVOTE', 'DOWNVOTE']),
})

export type CommentVoteRequest = z.infer<typeof CommentVoteValidator>
