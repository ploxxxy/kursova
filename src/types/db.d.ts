import { Comment, Subforum, Thread, User, Vote } from '@prisma/client'

export type ExtendedThread = Thread & {
  subforum: Subforum
  votes: Vote[]
  author: User
  comments: Comment[]
}
