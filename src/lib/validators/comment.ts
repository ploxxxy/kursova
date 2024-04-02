import { z } from 'zod'

export const CommentValidator = z.object({
  threadId: z.string(),
  text: z.string().min(6).max(1000),
  replyToId: z.string().optional(),
})

export type CommentRequest = z.infer<typeof CommentValidator>
