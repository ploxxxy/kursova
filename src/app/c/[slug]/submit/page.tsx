import Editor from '@/components/Editor'
import { Button } from '@/components/ui/Button'
import { db } from '@/lib/db'
import { notFound } from 'next/navigation'
import { FC } from 'react'

interface PageProps {
  params: {
    slug: string
  }
}

const page: FC<PageProps> = async ({ params }) => {
  const subforum = await db.subforum.findFirst({
    where: {
      name: params.slug,
    },
  })

  if (!subforum) return notFound()

  return (
    <div className="flex flex-col items-start gap-2">
      <div className="flex flex-wrap items-baseline">
        <h3 className="text-xl font-semibold leading-6">Створити тему</h3>
        <p className="ml-2 truncate text-lg text-text">у c/{params.slug}</p>
      </div>

      <Editor subforumId={subforum.id} />

      <div className="flex w-full justify-end">
        <Button type="submit" className="w-full" form="subforum-thread-form">
          Відправити
        </Button>
      </div>
    </div>
  )
}

export default page
