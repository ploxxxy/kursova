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
}

const EditorOutput: FC<EditorOutputProps> = ({ content }) => {
  return (
    <div className="prose prose-sm prose-stone dark:prose-invert">
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
    <a className="relative min-h-[15rem]" href={src} target="_blank">
      <Image
        src={src}
        alt={data.caption}
        width={0}
        height={0}
        className="h-full w-full rounded-xl"
        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
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

export default EditorOutput
