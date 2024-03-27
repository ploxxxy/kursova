import { getSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { redis } from '@/lib/redis'
import { ThreadVoteValidator } from '@/lib/validators/vote'
import { z } from 'zod'

const CACHE_AFTER_VOTES = 1 // TODO: change this after testing

export async function PATCH(req: Request) {
  try {
    const body = await req.json()

    const { threadId, voteType } = ThreadVoteValidator.parse(body)

    const session = await getSession()

    if (!session?.user) {
      return new Response('Unauthorized', { status: 401 })
    }

    const existingVote = await db.vote.findFirst({
      where: {
        userId: session.user.id,
        threadId,
      },
    })

    const thread = await db.thread.findUnique({
      where: {
        id: threadId,
      },
      include: {
        author: true,
        votes: true,
      },
    })

    if (!thread) {
      return new Response('Thread not found', { status: 404 })
    }

    if (existingVote) {
      if (existingVote.type === voteType) {
        await db.vote.delete({
          where: {
            userId_threadId: {
              userId: session.user.id,
              threadId,
            },
          },
        })

        return new Response('Vote removed', { status: 200 })
      }

      await db.vote.update({
        where: {
          userId_threadId: {
            userId: session.user.id,
            threadId,
          },
        },
        data: {
          type: voteType,
        },
      })

      const voteAmount = thread.votes.reduce((acc, vote) => {
        if (vote.type === 'UPVOTE') return acc + 1
        if (vote.type === 'DOWNVOTE') return acc - 1
        return acc
      }, 0)

      if (voteAmount >= CACHE_AFTER_VOTES) {
        // const cachePayload: CachedThread = {
        //   id: thread.id,
        //   title: thread.title,
        //   authorName: thread.author.name ?? '',
        //   content: JSON.stringify(thread.content),
        //   currentVote: voteType,
        //   createdAt: thread.createdAt.toString(),
        // }

        // TODO: Validate the object
        await redis.hSet(`thread:${threadId}`, {
          id: thread.id,
          title: thread.title,
          authorName: thread.author.name ?? '',
          content: JSON.stringify(thread.content),
          currentVote: voteType,
          createdAt: thread.createdAt.toString(),
        })
      }

      return new Response('Vote updated', { status: 200 })
    }

    await db.vote.create({
      data: {
        type: voteType,
        userId: session.user.id,
        threadId,
      },
    })

    const voteAmount = thread.votes.reduce((acc, vote) => {
      if (vote.type === 'UPVOTE') return acc + 1
      if (vote.type === 'DOWNVOTE') return acc - 1
      return acc
    }, 0)

    if (voteAmount >= CACHE_AFTER_VOTES) {
      // TODO: Validate the object
      await redis.hSet(`thread:${threadId}`, {
        id: thread.id,
        title: thread.title,
        authorName: thread.author.name ?? '',
        content: JSON.stringify(thread.content),
        currentVote: voteType,
        createdAt: thread.createdAt.toString(),
      })
    }

    return new Response('Vote created', { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response('Invalid Request', { status: 400 })
    }

    return new Response('Internal Server Error', { status: 500 })
  }
}