import { VoteType } from '@prisma/client'

export type CachedThread = {
  id: string
  title: string
  authorName: string
  content: string
  currentVote: VoteType | null
  createdAt: string
}
