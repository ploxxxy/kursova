'use client'

import ErrorBoundary from '@/app/ErrorBoundary'
import { cn } from '@/lib/utils'
import { useDebounceCallback } from '@mantine/hooks'
import { Prisma, Subforum } from '@prisma/client'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { Loader2, Users } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import { FC, useEffect, useRef, useState } from 'react'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from './ui/Command'
import { useOnClickOutside } from '@/hooks/use-on-click-outside'
import Link from 'next/link'

interface SearchbarProps {}

const Searchbar: FC<SearchbarProps> = () => {
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  const { data, refetch, isFetched } = useQuery({
    queryKey: ['searchbar'],
    queryFn: async () => {
      if (!input) return []

      const { data } = await axios.get(`/api/search?q=${input}`)
      setIsLoading(false)
      return data as (Subforum & { _count: Prisma.SubforumCountOutputType })[]
    },
    enabled: false,
  })

  const router = useRouter()
  const commandRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()

  const request = useDebounceCallback(async () => {
    refetch()
  }, 500)

  useEffect(() => {
    setIsLoading(true)
  }, [input])

  useOnClickOutside(commandRef, () => {
    setInput('')
  })

  useEffect(() => {
    setInput('')
  }, [pathname])

  return (
    <ErrorBoundary>
      <Command
        ref={commandRef}
        className="relative max-w-lg overflow-visible rounded-full border"
      >
        <CommandInput
          value={input}
          onValueChange={(v) => {
            setInput(v)
            request()
          }}
          className="border-none outline-none ring-0 focus:border-none focus:outline-none"
          placeholder="Пошук серед форумів..."
        />

        <CommandList
          className={cn(
            'absolute inset-x-0 top-full mt-1 rounded border bg-card',
            input.length <= 0 && 'hidden',
          )}
        >
          {isLoading && (
            <CommandEmpty>
              <Loader2 className="mx-auto h-4 w-4 animate-spin" />
            </CommandEmpty>
          )}
          {!isLoading && isFetched && (
            <CommandEmpty>Нічого не знайдено</CommandEmpty>
          )}
          {data && data.length > 0 ? (
            <CommandGroup heading="Форуми">
              {data.map((subforum) => (
                <CommandItem
                  key={subforum.id}
                  onSelect={(e) => {
                    router.push(`/c/${e}`)
                  }}
                  value={subforum.name}
                >
                  <Users className="mr-2 h-4 w-4" />
                  <a href={`/c/${subforum.name}`}>c/{subforum.name}</a>
                </CommandItem>
              ))}
            </CommandGroup>
          ) : null}
        </CommandList>
      </Command>
    </ErrorBoundary>
  )
}

export default Searchbar
