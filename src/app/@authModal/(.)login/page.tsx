import CloseModal from '@/components/CloseModal'
import Login from '@/components/Login'
import { FC } from 'react'

const page: FC = () => {
  return (
    <div className="fixed inset-0 z-10 backdrop-blur-md">
      <div className="container mx-auto flex h-full max-w-lg items-center">
        <div className="relative h-fit w-full rounded-lg bg-card px-2 py-20">
          <div className="absolute right-4 top-4">
            <CloseModal />
          </div>

          <Login />
        </div>
      </div>
    </div>
  )
}

export default page
