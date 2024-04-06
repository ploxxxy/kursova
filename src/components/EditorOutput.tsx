'use client'

import dynamic from 'next/dynamic'
import Image from 'next/image'
import { FC } from 'react'

const Output = dynamic(
  async () => (await import('editorjs-react-renderer')).default,
  {
    ssr: false,
  },
)

interface EditorOutputProps {
  content: unknown
}

const style = {
  paragraph: {
    fontSize: '0.875rem',
    lineHeight: '1.25rem',
  },
}

const renderers = {
  image: CustomImageRenderer,
  code: CustomCodeRenderer,
  linktool: CustomLinkRenderer,
}

const EditorOutput: FC<EditorOutputProps> = ({ content }) => {
  return (
    <div className="prose prose-sm prose-stone max-w-none dark:prose-invert">
      <Output style={style} renderers={renderers} data={content} />
    </div>
  )
}

interface ImageProps {
  caption: string
  file: {
    url: string
  }
  stretched: boolean
  withBackground: boolean
  withBorder: boolean
}

function CustomImageRenderer({ data }: { data: ImageProps }) {
  const src = data.file.url

  return (
    <a className="relative block w-full md:w-3/4" href={src} target="_blank">
      <Image
        src={src}
        alt={data.caption}
        width={0}
        height={0}
        className="h-full w-full rounded-xl"
        sizes="(max-width: 1024px) 100vw, 33vw"
      />
    </a>
  )
}

interface CodeProps {
  code: string
}

function CustomCodeRenderer({ data }: { data: CodeProps }) {
  return (
    <pre className="my-4 rounded-md bg-background-50 p-4">
      <code className="text-sm text-foreground">{data.code}</code>
    </pre>
  )
}

interface LinkProps {
  link: string
  meta: {
    url: string
    title: string | null
    description: string | null
    color: string | null
    image: {
      url: string
    }
  }
}

function CustomLinkRenderer({ data }: { data: LinkProps }) {
  return (
    <div className="relative flex flex-col rounded border bg-background-50 p-4 pt-1">
      {data.meta.color && (
        <div
          className="absolute inset-0 h-full w-1"
          style={{ background: data.meta.color }}
        />
      )}
      <a className="w-3/5" href={data.meta.url}>
        {data.meta.title}
      </a>
      {data.meta.description && (
        <p className="m-0 w-3/5 no-underline">{data.meta.description}</p>
      )}
      {data.meta.image.url && (
        <div>
          <div className="absolute right-0 top-0 z-10 h-full w-2/5 bg-gradient-to-r from-background-50 to-transparent" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="absolute right-0 top-0 m-0 h-full w-2/5 object-cover"
            src={data.meta.image.url}
            alt={data.link}
          />
        </div>
      )}
    </div>
  )
}

export default EditorOutput
