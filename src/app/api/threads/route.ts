import { getSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { z } from 'zod'

export async function GET(req: Request) {
  const url = new URL(req.url)

  const session = await getSession()

  let followedCommunitiesIds: string[] = []

  if (session) {
    const followedCommunities = await db.subscription.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        subforum: true,
      },
    })

    followedCommunitiesIds = followedCommunities.map(
      ({ subforum }) => subforum.id,
    )
  }

  try {
    const { limit, page, subforumName } = z
      .object({
        limit: z.string(),
        page: z.string(),
        subforumName: z.string().nullish().optional(),
      })
      .parse({
        limit: url.searchParams.get('limit'),
        page: url.searchParams.get('page'),
        subforumName: url.searchParams.get('subforumName'),
      })

    let whereClause = {}

    if (subforumName) {
      whereClause = {
        subforum: {
          name: subforumName,
        },
      }
    } else if (session) {
      whereClause = {
        subforum: {
          id: {
            in: followedCommunitiesIds,
          },
        },
      }
    }

    const threads = await db.thread.findMany({
      take: parseInt(limit),
      skip: (parseInt(page) - 1) * parseInt(limit),
      where: whereClause,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        subforum: true,
        votes: true,
        author: true,
        comments: true,
      },
    })

    return new Response(JSON.stringify(threads))
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response('Invalid Request', { status: 400 })
    }

    return new Response('Internal Server Error', { status: 500 })
  }
}
