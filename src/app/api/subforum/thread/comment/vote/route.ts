import { getSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { CommentVoteValidator } from '@/lib/validators/vote'
import { z } from 'zod'

export async function PATCH(req: Request) {
  try {
    const body = await req.json()

    const { commentId, voteType } = CommentVoteValidator.parse(body)

    const session = await getSession()

    if (!session?.user) {
      return new Response('Unauthorized', { status: 401 })
    }

    const existingVote = await db.commentVote.findFirst({
      where: {
        userId: session.user.id,
        commentId,
      },
    })

    const comment = await db.comment.findUnique({
      where: {
        id: commentId,
      },
      include: {
        author: true,
        votes: true,
      },
    })

    if (!comment) {
      return new Response('Comment not found', { status: 404 })
    }

    if (existingVote) {
      if (existingVote.type === voteType) {
        await db.commentVote.delete({
          where: {
            userId_commentId: {
              userId: session.user.id,
              commentId,
            },
          },
        })

        return new Response('Vote removed', { status: 200 })
      }

      await db.commentVote.update({
        where: {
          userId_commentId: {
            userId: session.user.id,
            commentId,
          },
        },
        data: {
          type: voteType,
        },
      })
      return new Response('Vote updated', { status: 200 })
    }

    await db.commentVote.create({
      data: {
        type: voteType,
        userId: session.user.id,
        commentId,
      },
    })

    return new Response('Vote created', { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response('Invalid Request', { status: 400 })
    }

    return new Response('Internal Server Error', { status: 500 })
  }
}
