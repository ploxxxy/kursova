import { z } from 'zod'

export const CommentValidator = z.object({
  threadId: z.string(),
  text: z.string().min(3).max(1000),
  replyToId: z.string().optional(),
})

export const CommentDeleteValidator = z.object({
  commentId: z.string(),
})

export type CommentRequest = z.infer<typeof CommentValidator>
export type CommentDeleteRequest = z.infer<typeof CommentDeleteValidator>
