'use client'

import { Session } from 'next-auth'
import { signOut } from 'next-auth/react'
import Link from 'next/link'
import { FC } from 'react'
import ThemeSwitch from './ThemeSwitch'
import UserAvatar from './UserAvatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/DropdownMenu'

interface UserAccountNavProps {
  user: Session['user']
}

const UserAccountNav: FC<UserAccountNavProps> = ({ user }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <UserAvatar
          className="h-8 w-8"
          user={{ name: user.name, image: user.image }}
        />
      </DropdownMenuTrigger>

      <DropdownMenuContent className="bg-card text-foreground" align="end">
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col gap-y-1 leading-none">
            <p className="font-medium">
              {user.name}
              {user.username && (
                <span className="ml-1 text-sm text-text">
                  (@{user.username})
                </span>
              )}
            </p>

            <p className="max-w-[200px] truncate text-sm text-muted-foreground">
              {user.email}
            </p>
          </div>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link href="/">Стрічка</Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href="/c/create">Створити групу</Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href="/settings">Налаштування</Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <ThemeSwitch />

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onSelect={(event) => {
            event.preventDefault()
            signOut({
              callbackUrl: `${window.location.origin}/login`,
            })
          }}
          className="cursor-pointer"
        >
          Вийти
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default UserAccountNav
