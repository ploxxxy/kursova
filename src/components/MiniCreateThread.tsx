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
    <div className="overflow-hidden rounded-md bg-card shadow border">
      <div className="flex h-full items-center justify-between gap-2 p-4">
        <div className="relative hidden sm:block">
          <UserAvatar
            user={{
              name: session?.user.name || null,
              image: session?.user.image || null,
            }}
          />

          <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 outline outline-2 outline-card" />
        </div>
        <Input readOnly onClick={forwardToSubmit} placeholder="Створити тему" />
        <Button
          onClick={forwardToSubmit}
          variant="ghost"
          className="aspect-square p-0"
        >
          <ImageIcon />
        </Button>

        <Button
          onClick={forwardToSubmit}
          variant="ghost"
          className="aspect-square p-0"
        >
          <Link2 />
        </Button>
      </div>
    </div>
  )
}

export default MiniCreateThread
