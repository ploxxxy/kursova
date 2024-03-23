import { getSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { ThreadValidator } from '@/lib/validators/thread'
import { z } from 'zod'

export async function POST(req: Request) {
  try {
    const session = await getSession()

    if (!session?.user) {
      return new Response('Unauthorized', { status: 401 })
    }

    const body = await req.json()
    const { subforumId, title, content } = ThreadValidator.parse(body)

    const subscription = await db.subscription.findFirst({
      where: {
        subforumId,
        userId: session.user.id,
      },
    })

    if (!subscription) {
      return new Response('Not subscribed to the subforum', { status: 400 })
    }

    await db.thread.create({
      data: {
        title,
        content,
        subforumId,
        authorId: session.user.id,
      },
    })

    return new Response(null, { status: 200 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response('Invalid Request', { status: 400 })
    }

    return new Response('Internal Server Error', { status: 500 })
  }
}
