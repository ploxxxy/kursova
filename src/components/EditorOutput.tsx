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
    <Output
      className="text-sm"
      style={style}
      renderers={renderers}
      data={content}
    />
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
    <div className="relative min-h-[15rem] w-full">
      <Image
        src={src}
        className="object-contain"
        fill
        alt={data.caption}
      />
    </div>
  )
}

interface CodeProps {
  code: string
}
function CustomCodeRenderer({ data }: { data: CodeProps }) {
  return (
    <pre className="rounded-md bg-background-50 p-4">
      <code className="text-sm text-foreground">{data.code}</code>
    </pre>
  )
}

export default EditorOutput
