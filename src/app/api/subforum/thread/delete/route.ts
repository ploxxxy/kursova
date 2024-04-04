import { getSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { ThreadDeleteValidator } from '@/lib/validators/thread'
import { z } from 'zod'

export async function POST(req: Request) {
  try {
    const session = await getSession()

    if (!session?.user) {
      return new Response('Unauthorized', { status: 401 })
    }

    const body = await req.json()
    const { threadId } = ThreadDeleteValidator.parse(body)

    const thread = await db.thread.findFirst({
      where: {
        id: threadId,
      },
    })

    if (!thread) {
      return new Response('Thread not found', { status: 404 })
    }

    if (thread.authorId !== session.user.id) {
      return new Response('Unauthorized', { status: 401 })
    }

    const deleteThread = async () => {
      return await db.thread.delete({
        where: {
          id: threadId,
        },
      })
    }

    if (thread.authorId === session.user.id) {
      deleteThread()

      return new Response(null, { status: 200 })
    }

    if (session.user.role === 'ADMIN') {
      deleteThread()

      return new Response(null, { status: 200 })
    }

    if (session.user.role === 'MODERATOR') {
      const subforum = await db.subforum.findFirst({
        where: {
          id: thread.subforumId,
        },
      })

      if (subforum?.moderatorIds.includes(session.user.id)) {
        deleteThread()

        return new Response(null, { status: 200 })
      } else {
        return new Response('Unauthorized', { status: 401 })
      }
    }

    return new Response('Unexpected result', { status: 400 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response('Invalid Request', { status: 400 })
    }

    return new Response('Internal Server Error', { status: 500 })
  }
}
