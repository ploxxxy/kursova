import { FC } from 'react'
import { Skeleton } from '../ui/skeleton'

const SkeletonFeed: FC = () => {
  return (
    <>
      <FakeThread />
      <FakeThread />
      <FakeThread />
    </>
  )
}

const FakeThread = () => (
  <div className="flex flex-col gap-y-4 rounded border bg-card">
    <div className="flex max-h-80 gap-3 px-3 py-4">
      <div className="flex w-8 flex-col items-center gap-2 ">
        <Skeleton className="h-6 w-6" />
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-6 w-6" />
      </div>
      <div className="relative flex w-full flex-col gap-4 ">
        <div className="flex gap-2">
          <Skeleton className="h-4 w-[50px]" />
          <Skeleton className="h-4 w-[250px]" />
        </div>
        <Skeleton className="h-8 w-1/2 shrink-0" />
        <Skeleton className="h-80 w-3/4" />
        <Skeleton className="h-80 w-3/4" />
        <div className="absolute bottom-0 left-0 h-48 w-full bg-gradient-to-t from-card to-transparent" />
      </div>
    </div>
    <div className="flex h-12 w-full bg-background-50 px-4">
      <Skeleton className="my-auto h-5 w-[150px]" />
    </div>
  </div>
)

export default SkeletonFeed
