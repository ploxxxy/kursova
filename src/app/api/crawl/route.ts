import axios from 'axios'
import * as cheerio from 'cheerio'

export async function GET(req: Request) {
  const url = new URL(req.url)
  let href = url.searchParams.get('url')

  if (!href) {
    return new Response('Invalid URL', { status: 400 })
  }

  if (href.includes('http://')) {
    href.replace('http://', 'https://')
  }

  if (!href.includes('https://')) {
    href = 'https://' + href
  }

  const res = await axios.get(href)
  const $ = cheerio.load(res.data)

  const title = $('title').text()
  const description = $('meta[name="description"]').attr('content')
  const imageUrl = $('meta[property="og:image"]').attr('content')
  const color = $('meta[name="theme-color"]').attr('content')

  console.log({
    success: 1,
    meta: { title, description, image: { url: imageUrl }, color },
  })

  return new Response(
    JSON.stringify({
      success: 1,
      meta: { url: href, title, description, image: { url: imageUrl }, color },
    }),
  )
}
