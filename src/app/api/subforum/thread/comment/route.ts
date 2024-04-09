import { getSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { CommentValidator } from '@/lib/validators/comment'
import { z } from 'zod'

export async function PATCH(req: Request) {
  try {
    const session = await getSession()
    if (!session?.user) {
      return new Response('Unauthorized', { status: 401 })
    }

    if (session.user.role === 'BANNED') {
      return new Response('User is banned', { status: 403 })
    }
    
    const body = await req.json()
    const { threadId, text, replyToId } = CommentValidator.parse(body)

    await db.comment.create({
      data: {
        text,
        threadId,
        authorId: session.user.id,
        replyToId,
      },
    })

    return new Response('OK', { status: 200 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response('Invalid Request', { status: 400 })
    }

    return new Response('Internal Server Error', { status: 500 })
  }
}
