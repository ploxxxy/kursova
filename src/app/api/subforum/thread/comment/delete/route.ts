import { getSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { CommentDeleteValidator } from '@/lib/validators/comment'
import { ThreadDeleteValidator } from '@/lib/validators/thread'
import { z } from 'zod'

export async function POST(req: Request) {
  try {
    const session = await getSession()

    if (!session?.user) {
      return new Response('Unauthorized', { status: 401 })
    }

    const body = await req.json()
    const { commentId } = CommentDeleteValidator.parse(body)

    const comment = await db.comment.findFirst({
      where: {
        id: commentId,
      },
    })

    if (!comment) {
      return new Response('Comment not found', { status: 404 })
    }

    const deleteComment = async () => {
      return await db.comment.delete({
        where: {
          id: commentId,
        },
      })
    }

    if (comment.authorId === session.user.id) {
      deleteComment()

      return new Response(null, { status: 200 })
    }

    if (session.user.role === 'ADMIN') {
      deleteComment()

      return new Response(null, { status: 200 })
    }

    if (session.user.role === 'MODERATOR') {
      const subforum = await db.subforum.findFirst({
        where: {
          threads: {
            some: {
              id: comment.threadId,
            },
          },
        },
      })

      if (subforum?.moderatorIds.includes(session.user.id)) {
        deleteComment()

        return new Response(null, { status: 200 })
      }
    } else {
      return new Response('Unauthorized', { status: 401 })
    }

    return new Response('Unexpected result', { status: 400 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response('Invalid Request', { status: 400 })
    }

    return new Response('Internal Server Error', { status: 500 })
  }
}
