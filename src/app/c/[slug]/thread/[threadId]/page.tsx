import CommentSection from '@/components/CommentSection'
import EditorOutput from '@/components/EditorOutput'
import ThreadVoteServer from '@/components/thread-vote/ThreadVoteServer'
import { buttonVariants } from '@/components/ui/Button'
import { db } from '@/lib/db'
import { redis } from '@/lib/redis'
import { formatTimeToNow } from '@/lib/utils'
import { CachedThread } from '@/types/redis'
import { Thread, User, Vote } from '@prisma/client'
import { ArrowBigDown, ArrowBigUp, Loader2 } from 'lucide-react'
import { notFound } from 'next/navigation'
import { FC, Suspense } from 'react'

interface PageProps {
  params: {
    threadId: string
  }
}

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

const page: FC<PageProps> = async ({ params }) => {
  const cachedThread = (await redis.hGetAll(
    `thread:${params.threadId}`,
  )) as CachedThread

  let thread: (Thread & { votes: Vote[]; author: User }) | null = null

  if (!Object.keys(cachedThread).length) {
    thread = await db.thread.findFirst({
      where: {
        id: params.threadId,
      },
      include: {
        votes: true,
        author: true,
      },
    })
  }

  if (!thread && !cachedThread) return notFound()

  return (
    <div>
      <div className="flex h-full flex-col items-center justify-between sm:flex-row sm:items-start">
        <Suspense fallback={<ThreadVoteSkeleton />}>
          <ThreadVoteServer
            insideThread
            threadId={thread?.id ?? cachedThread.id}
            getData={async () => {
              return await db.thread.findUnique({
                where: {
                  id: params.threadId,
                },
                include: {
                  votes: true,
                },
              })
            }}
          />
        </Suspense>

        <div className="w-full flex-1 rounded border bg-card p-4 sm:w-0">
          <p className="mt-1 max-h-40 truncate text-xs text-text">
            {thread?.author.username
              ? '@' + thread.author.username
              : thread?.author.name ?? cachedThread.authorName}
            <span className="px-1">•</span>
            {formatTimeToNow(
              thread?.createdAt ?? new Date(cachedThread.createdAt),
            )}
          </p>
          <h1 className="py-2 text-xl font-semibold leading-6 text-text-950">
            {thread?.title ?? cachedThread.title}
          </h1>

          <EditorOutput
            content={thread?.content ?? JSON.parse(cachedThread.content)}
          />

          <Suspense
            fallback={<Loader2 className="h-5 w-5 animate-spin text-text" />}
          >
            <CommentSection authorId={thread?.authorId ?? cachedThread.authorId} threadId={thread?.id ?? cachedThread.id} />
          </Suspense>
        </div>
      </div>
    </div>
  )
}

const ThreadVoteSkeleton = () => {
  return (
    <div className="mb-3 flex w-20 items-center gap-2 sm:mb-0 sm:flex-col">
      <div
        className={buttonVariants({
          variant: 'ghost',
          size: 'sm',
          className: 'hover:bg-unset! p-0 hover:text-green-500',
        })}
      >
        <ArrowBigUp className="h-5 w-5" />
      </div>

      <div className="py-2 text-center text-sm font-medium text-text-950">
        <Loader2 className="h-3 w-3 animate-spin" />
      </div>

      <div
        className={buttonVariants({
          variant: 'ghost',
          size: 'sm',
          className: 'hover:bg-unset! p-0 hover:text-red-500',
        })}
      >
        <ArrowBigDown className="h-5 w-5" />
      </div>
    </div>
  )
}

export default page
