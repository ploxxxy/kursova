'use client'

import { Session } from 'next-auth'
import { usePathname, useRouter } from 'next/navigation'
import { FC } from 'react'
import UserAvatar from './UserAvatar'
import { Input } from './ui/Input'
import { Button } from './ui/Button'
import { ImageIcon, Link2 } from 'lucide-react'

interface MiniCreateThreadProps {
  session: Session | null
}

const MiniCreateThread: FC<MiniCreateThreadProps> = ({ session }) => {
  const router = useRouter()
  const pathName = usePathname()

  const forwardToSubmit = () => {
    router.push(pathName + '/submit')
  }

  return (
    <div className="overflow-hidden rounded-md bg-white shadow">
      <div className="flex h-full justify-between gap-2 p-4">
        <div className="relative hidden sm:block">
          <UserAvatar
            user={{
              name: session?.user.name || null,
              image: session?.user.image || null,
            }}
          />

          <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 outline outline-2 outline-white" />
        </div>
        <Input readOnly onClick={forwardToSubmit} placeholder="Створити тему" />
        <Button onClick={forwardToSubmit} variant="outline">
          <ImageIcon className="text-zinc-600" />
        </Button>

        <Button onClick={forwardToSubmit} variant="outline">
          <Link2 className="text-zinc-600" />
        </Button>
      </div>
    </div>
  )
}

export default MiniCreateThread
